const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const csurf = require("csurf");
const { hash, compare } = require("./utils/bc.js");
const cryptoRandomString = require("crypto-random-string");
const cookieSession = require("cookie-session");
const { sendEmail } = require("./ses");
const {
    addUser,
    registeredUser,
    updateUserInfo,
    insertValidationCode,
    selectCode,
    getUserInfo,
    uploadProfilePic,
    updateUserBio,
    getOtherUserProfile,
    getNewlyAddedUser,
    getUsersByName,
} = require("./db");
const s3 = require("../s3");
const { s3Url } = require("../config.json");
const multer = require("multer"); // This talk with harddrive for uploading the file
const uidSafe = require("uid-safe");
// Setting up cookie parser
app.use(
    cookieSession({
        secret: require("../secrets.json").COOKIE_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14, // After two week, cookies will be reset
    })
);

// Image Upload Code

const diskStorage = multer.diskStorage({
    //diskstorage
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
// We are servering our public directory
app.use(express.static(path.join(__dirname, "..", "client", "public")));
// csurf MUST come after cookieSession
// This will prevent clickJacking(csrf attack)
app.use(csurf());
app.use((req, res, next) => {
    res.cookie("mytoken", req.csrfToken());
    next();
});

// looking for the every request and look at the csurf token and if the valid token
app.use(function (req, res, next) {
    // this prevents clicking jacking
    res.setHeader("x-frame-options", "deny");
    res.locals.csrfToken = req.csrfToken(); // generating the CSRF token and store it into var csrfToken
    next();
});

//Express JSON--
app.use(express.json());
// URL encoding Parser: --->
app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use((req, res, next) => {
    console.log("Req.Method:", req.method);
    console.log("req.url:", req.url);
    next();
});

// This is going to min the size of response we send
app.use(compression());

//GET request from db.js
//Checking if the user has logged out the page...!
app.get("/welcome", function (req, res) {
    if (req.session.userId) {
        // the user is logged in
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/registration", (req, res) => {
    console.log("a POST request was made to /welcome route:");
    console.log("req.body:", req.body);
    const { first, last, email, password } = req.body;
    hash(password)
        .then((password_hashed) => {
            console.log("password_hashed:", password_hashed);
            addUser(first, last, email, password_hashed)
                .then((result) => {
                    console.log("result.rows:", result.rows);
                    const { id } = result.rows[0];
                    req.session.userId = id; //Setting cookie with the name userId
                    res.redirect("/");
                })
                .catch((error) => {
                    console.log("Error in POST /welcome route:", error);
                    res.render("/welcome", {
                        error: "Something went wrong, Please try again.!",
                    });
                });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: "Error in /registration route, Please check the route..!",
            });
        });
});

app.post("/login", (req, res) => {
    console.log("POST req to /login page was made");
    const { email, password } = req.body;
    console.log("Req.body:", req.body);
    registeredUser(email)
        .then((result) => {
            console.log("result.rows:", result.rows);
            compare(password, result.rows[0].hash_password)
                .then((match) => {
                    if (match == true) {
                        req.session.userId = result.rows[0].id;
                        res.status(200).json({
                            success: true,
                        });
                    } else {
                        res.status(500).json({
                            error: "Invalid password input",
                        });
                    }
                })
                .catch((error) => {
                    console.log(
                        "Error in Matching the password /login route",
                        error
                    );
                    res.status(500).json({
                        error: "Error in /login password Match route",
                    });
                });
        })
        .catch((error) => {
            console.log(
                "Error in registeredUser(email).then(result) /login route:",
                error
            );
            res.status(500).json({
                error: "Error in /login route:",
            });
        });
});

app.post("/password/reset/start", (req, res) => {
    console.log("a POST request was made to /login:");
    registeredUser(req.body.email)
        .then((result) => {
            console.log("result:", result);
            console.log("req.body.email:", req.body.email);
            if (result.rows.length > 0) {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                const email = result.rows[0].email;
                insertValidationCode(secretCode, email)
                    .then(({ rows }) => {
                        if (rows.length > 0) {
                            sendEmail(
                                rows[0].email,
                                `Your Verification code to reset password is: ${rows[0].code}`,
                                "Your verifcation code"
                            );
                            res.status(200).json({
                                success: "Verified",
                            });
                        } else {
                            res.status(500).json({
                                error: "Error in entering verification code, please check again",
                            });
                        }
                    })
                    .catch((error) => {
                        console.log(
                            "Error in insertValidationCode(secretCode, email).then(({rows}) ",
                            error
                        );
                    });
            } else {
                res.status(500).json({
                    error: "Invalid Email",
                });
            }
        })
        .catch((error) => {
            console.log("Error in registeredUser(req.body.email)", error);
            res.status(500).json({
                error: " Error in POST /password/reset/start route:",
            });
        });
});

app.post("/password/reset/verify", (req, res) => {
    const { email, password, code } = req.body;
    console.log("const{email, password, code} = req.body:", req.body);
    selectCode(email)
        .then((result) => {
            console.log("result.rows:", result.rows);
            if (result.rows[0].code === code) {
                hash(password).then((password_hashed) => {
                    updateUserInfo(password_hashed, email)
                        .then(() => {
                            res.status(200).json({
                                success: "New password entered successfully",
                            });
                        })
                        .catch((error) => {
                            console.log(
                                "Error in updateUserInfo(password_hashed, email).then(() ",
                                error
                            );
                            res.status(500).json({
                                error: "Error in verify password route, please check.!",
                            });
                        });
                });
            } else {
                res.status(500).json({
                    error: "Invalid input, please check your email",
                });
            }
        })
        .catch((error) => {
            console.log("Error", error);
            res.status(500).json({
                error: "Error in reset/verify route",
            });
        });
});

// Image POST route
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log(" POST req to /upload is working..!");
    console.log(req.body);
    console.log("req.file:", req.file);
    if (req.file) {
        const { userId } = req.session;
        const { filename } = req.file;
        const fullUrl = s3Url + filename;
        console.log("fullUrl:", fullUrl);
        uploadProfilePic(fullUrl, userId)
            .then(({ rows }) => {
                console.log(("rows:", rows));
                res.json(rows[0]);
            })
            .catch((error) => {
                console.log("Error in uploadProfilePic ", error);
                res.status(500).json({
                    error: "Error in /upload route, please check.",
                });
            });
    } else {
        res.json({
            success: false,
        });
    }
});

app.get("/user", (req, res) => {
    const { userId } = req.session;
    getUserInfo(userId)
        .then((response) => {
            console.log("rows", response.rows);
            res.json(response.rows[0]);
        })
        .catch((error) => console.log("Error:", error));
});

app.post("/update-UserBio", (req, res) => {
    console.log("a POST req was made to /update-UserBio route.!");
    console.log("req.body: ", req.body);
    console.log("req.session: ", req.session);
    const { bio } = req.body;
    const { userId } = req.session;
    updateUserBio(bio, userId)
        .then((response) => {
            res.json(response.rows[0]);
        })
        .catch((error) => {
            console.log("Error in update-UserBio:", error);
        });
});

//Other-Profile Get route

app.get("/other-user/:id", async (req, res) => {
    console.log("a GET req was made to /other-user/:id route");
    console.log("req.params:", req.params);
    const { id } = req.params;
    console.log("A GET req was made to id for other users:", id);
    if (parseInt(id) === req.session.userId) {
        res.status(400).json({
            error: "Cannot access your own url",
        });
        return;
    }
    try {
        const { rows } = await getOtherUserProfile(id);
        if (rows.length === 0) {
            res.status(400).json({
                error: "Please check the written url, it does not exist",
            });
            return;
        }
        res.json(rows[0]);
    } catch (error) {
        console.log("Error in getOtherUserProfile route:", error);
    }
});

// Find new people and display recently added users limited 3
app.get("/find/users.json", async (req, res) => {
    console.log("A GET req was made from /find/user route");
    try {
        const { rows } = await getNewlyAddedUser();
        console.log("app.get for finding users: ", rows);
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            error: "Error GET route of finding users data in server",
        });
    }
});

app.post("/find/users.json", async (req, res) => {
    console.log("A POST req made to /find/users ");
    const { searchField } = req.body;
    console.log("searchField: ", searchField);
    try {
        const { rows } = await getUsersByName(searchField);
        console.log("{rows} : ", rows);
        res.json(rows);
    } catch (error) {
        console.log(
            "Error in POST route in finding users data in server",
            error
        );
        res.status(500).json({
            error: "Error in POST /find/users.json",
        });
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        // the user is logged out
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening, and you are doing great..!");
});
