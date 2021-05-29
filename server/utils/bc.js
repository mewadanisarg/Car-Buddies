const { genSalt, hash, compare } = require("bcryptjs");

exports.hash = (password) => {
    console.log("password: ", password);
    return genSalt().then((salt) => {
        console.log("salt: ", salt);
        return hash(password, salt);
    });
};

exports.compare = compare;
