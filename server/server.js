const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const { hash, compare } = require("./utils/ bcrypt.js");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");

const {
    addUser,
    registeredUser,
    updateUserInfo,
    insertValidationCode,
    selectCode,
} = require("./sql/db");

// Setting up cookie parser
app.use(
    cookieSession({
        secret: "im always angry",
        maxAge: 1000 * 60 * 60 * 24 * 14, // After two week, cookies will be reset
    })
);

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
//Express JSON--
app.use(express.json());

// This is going to min the size of response we send
app.use(compression());

// We are servering our public directory
app.use(express.static(path.join(__dirname, "..", "client", "public")));

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
    const { first_name, last_name, email, password } = req.body;
    hash(password)
        .then((password_hashed) => {
            console.log("password_hashed:", password_hashed);
            addUser(first_name, last_name, email, password_hashed)
                .then((result) => {
                    console.log("result.rows:", result.rows);
                    const { id } = result.rows[0];
                    req.session.userId = id;
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
                error:
                    "Error in /registration route, Please check the route..!",
            });
        });
});

app.post("/login", (req, res) => {
    console.log("POST req to /login page was made");
    const { email, password } = req.body;
    console.log("Req.body:", req.body);
    registeredUser(email)
        .then((result) => {
            compare(password, result.rows[0].password_hashed)
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
    registeredUser(req.body.email).then((result) => {
        console.log("results:", result);
    });
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
