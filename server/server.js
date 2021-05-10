const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");

const csurf = require("csurf");
const { hash, compare } = require("./utils/ bcrypt.js");

const { addUser, registeredUser } = require("./sql/db");
// This is going to min the size of response we send
app.use(compression());
// We are servering our public directory
app.use(express.static(path.join(__dirname, "..", "client", "public")));

// Setting up cookie parser
app.use(
    cookieSession({
        secret:
            process.env.COOKIE_SECRET ||
            require("../secrets.json").COOKIE_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14, // After two week, cookies will be reset
    })
);

// Check for cookie will come here

// app.use((req, res, next) => {
//     const request = ["../registeration", "../welcome"];
// });

// csurf MUST come after cookieSession
// This will prevent clickJacking(csrf attack)
app.use(csurf()); // looking for the every request and look at the csurf token and if the valid token
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

//Express JSON--
app.use(express.json());

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

app.post("/welcome", (req, res) => {
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
                error: "Error in /registration roue, Please check the route..!",
            });
        });
});



app.post("/login", (req, res) => {
    console.log("POST req to /login page was made");
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
