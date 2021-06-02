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
    getConnected,
    addConnection,
    updateConnection,
    unfriendConnection,
    seeFriendsRequest,
    insertMessages,
    getRecentChats,
    deleteUsersInfo,
    deleteUsersConnection,
    deleteUsersChats,
    insertImages,
    recentPrivateMessage,
    newPrivateMessage,
    getAllImages,
} = require("./db");
const s3 = require("../s3");
const { s3Url } = require("../config.json");
const multer = require("multer"); // This talk with harddrive for uploading the file
const uidSafe = require("uid-safe");

// Setting up cookie parser
// app.use(
//     cookieSession({
//         secret: require("../secrets.json").COOKIE_SECRET,
//         maxAge: 1000 * 60 * 60 * 24 * 14, // After two week, cookies will be reset
//     })
// );

// Setting up Socket.io
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});
// New Cookie Session from Part-10

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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
    const { first, last, email, carmaker, modalno, regyear, password } =
        req.body;
    hash(password)
        .then((password_hashed) => {
            console.log("password_hashed:", password_hashed);
            addUser(
                first,
                last,
                email,
                carmaker,
                modalno,
                regyear,
                password_hashed
            )
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
        console.log("app.get for finding users: ", rows.length);
        res.json(rows);
    } catch (error) {
        console.log("Inside Catch of GET req of /find/users", error);
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

// Part 8 for friendship button..!

app.get("/friendsconnection/:connectingUser", async (req, res) => {
    const loggedInUser = req.session.userId;
    console.log("loggedInUser:", req.session.userId);
    const { connectingUser } = req.params;
    console.log("Connecting to user:", req.params);
    const { rows } = await getConnected(loggedInUser, connectingUser);
    console.log("Rows into /friendsconnection/:connectingUser", rows);
    if (rows.length === 0) {
        return res.json({
            btnText: "Add Friend",
        });
    }
    if (rows[0].accepted) {
        return res.json({
            btnText: "Unfriend",
        });
    }
    if (!rows[0].accepted) {
        if (rows[0].recipient_id === loggedInUser) {
            return res.json({
                btnText: "Accept request",
            });
        } else {
            return res.json({
                btnText: "Cancel request",
            });
        }
    }
});

app.post("/friendsconnection", async (req, res) => {
    const loggedInUser = req.session.userId;
    const { btnText, connectingUser } = req.body;
    console.log("loggedInuser : ", req.session.userId);
    console.log("req.body: ", req.body);

    try {
        if (btnText === "Add Friend") {
            await addConnection(loggedInUser, connectingUser);
            return res.json({
                btnText: "Cancel request",
            });
        }
        if (btnText === "Accept request") {
            await updateConnection(loggedInUser, connectingUser);
            return res.json({
                btnText: "Unfriend",
            });
        }
        if (
            btnText === "Cancel request" ||
            btnText === "Unfriend" ||
            btnText === "Decline request"
        ) {
            await unfriendConnection(loggedInUser, connectingUser);
            return req.json({
                btnText: "Add Friend",
            });
        }
    } catch (error) {
        console.log("Error in app.post /friendship route: ", error);
        return res.json({
            error: "Error in friends-btn route",
        });
    }
});

// Part-9 Friends and Request

app.get("/friendsrequest.json", async (req, res) => {
    const { userId } = req.session;
    try {
        const { rows } = await seeFriendsRequest(userId);
        console.log(("rows: ", rows));
        res.json(rows);
    } catch (error) {
        console.log("Error in /friendsrequest route: ", error);
    }
});

// Photo Gallery

app.post("/gallery", uploader.single("file"), s3.upload, (req, res) => {
    console.log("Gallery post route is working:");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    if (req.file) {
        // this will run if everything worked
        const user_id = req.session.userId;
        const { filename } = req.file;
        const fullUrl = s3Url + filename;
        console.log("fullUrl:", fullUrl);
        //insert into images
        insertImages(fullUrl, user_id)
            .then((results) => {
                console.log("results:", results);
                res.json(results.rows[0]);
            })
            .catch((error) => {
                console.log("Error in POST inserting file req.file", error);
            });
        //send back a reponse using res.json
    } else {
        res.status(500).json({
            msg: "No file uploaded",
        });
    }
});

app.get("/gallery.json", (req, res) => {
    console.log("A GET request was made to /images route");
    getAllImages()
        .then((data) => {
            //logging the data
            console.log("data", data);
            res.json({
                images: data.rows, // storing the images data in image
            });
        })
        .catch((error) => {
            console.log("Error in getting the image from DataBase:", error);
        });
});

// Delete Account Route

app.post("/delete-account", async (req, res) => {
    const { userId } = req.session;
    // console.log("userId:", userId);
    try {
        const result = await getUserInfo(userId);
        result.rows[0].img_url && (await s3.delete(result.rows[0].img_url));
        await deleteUsersChats(userId);
        await deleteUsersConnection(userId);
        await deleteUsersInfo(userId);
        req.session = null;
        res.redirect("/welcome");
    } catch (error) {
        console.log("Error in /delete-account route:", error);
    }
});

// Logout route
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

//app.listen changed to server.listen
server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening, and you are doing great..!");
});

// Part 10 for live chatting.
// Only connect when they are loggedIn ..!!
const onlineUsers = {}; // a mapping of socket ids to user ids
io.on("connection", function (socket) {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    const userId = socket.request.session.userId;
    console.log("userId from io.on in server: ", userId);

    onlineUsers[socket.id] = userId;

    console.log(`User ${userId} just connected with socket ${socket.id}`);
    socket.on("disconnect", () => {
        console.log(
            `User ${userId} just disconnected with socket ${socket.id}`
        );
        delete onlineUsers[socket.id];
    });

    /* ... */
    (async () => {
        try {
            const { rows } = await getRecentChats();
            console.log("ROWS: ", rows);
            io.sockets.emit("chatMessages", rows.reverse());
        } catch (error) {
            console.log("error: ", error);
        }
    })();
    socket.on("chatmessage", async (chat) => {
        const message = chat;
        console.log("Chats from chat route", message);

        try {
            const response = await insertMessages(message, userId);
            console.log("response from chat route: from server.js ", response);
            const { rows } = await getOtherUserProfile(userId);
            console.log("rows of the chat route from server.js: ", rows);

            const chatForData = {
                essage: response.rows[0].message,
                created_at: response.rows[0].created_at,
                first_name: rows[0].first_name,
                last_name: rows[0].last_name,
                img_url: rows[0].img_url,
            };
            socket.emit("chatmessage: ", chatForData);
        } catch (error) {
            console.log("Error in adding the message into chat-box", error);
        }
    });
    // Get Recent Private Messages..!!
    socket.on("get ten recent private messages", (user) => {
        recentPrivateMessage(userId, user.id)
            .then(({ rows }) => {
                console.log("rows from get ten recent private messages", rows);
                socket.emit("recent messages incoming", rows);
                // io.to(onlineUsers[user.id]).emit("private message", rows);
            })
            .catch((error) =>
                console.log(
                    "error in socket on getting recent private messages",
                    error
                )
            );
    });
    // Private Messages
    socket.on("private message", (message) => {
        console.log("Inside socket.on private message: ", message);
        newPrivateMessage(userId, message.recipient_id, message.message)
            .then(() => {
                recentPrivateMessage(userId, message.recipient_id)
                    .then(({ rows }) => {
                        console.log("Private Messages: ", rows);
                        socket.emit("sent message", rows);
                        io.to(onlineUsers[message.recipient_id]).emit(
                            "private messages",
                            rows
                        );
                    })
                    .catch((error) =>
                        console.log("error in recentPrivateMessag: ", error)
                    );
            })
            .catch((error) =>
                console.log("error in newPrivateMessage: ", error)
            );
    });
});
