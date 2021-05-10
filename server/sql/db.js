const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

// Inserting user Data into DB with hashed password
module.exports.addUser = (first_name, last_name, email, hash_password) => {
    console.log(
        "Inside module.export.userRegistration",
        first_name,
        last_name,
        email,
        hash_password
    );
    const q = `
    INSERT INTO users (first_name, last_name, email, hash_password) 
    VALUES($1, $2, $3, $4)
    RETURNING id`;
    const params = [first_name, last_name, email, hash_password];
    return db.query(q, params);
};

// All the users who already have registered on socialNetwork page
module.exports.registeredUser = (email) => {
    const q = `SELECT * FROM users WHERE email = $1`;
    const params = [email];
    return db.query(q, params);
};

module.exports.updateUserInfo = (hash_password, email) => {
    console.log("Inside updateUserInfo db.js :", hash_password, email);
    const q = `UPDATE users SET hash_password = $1 WHERE email = $1 RETURNING *`;
    const params = [hash_password, email];
    return db.query(q, params);
};

module.exports.insertValidationCode = (code, email) => {
    console.log("Inside insertValidationCode db.js", code, email);
    const q = `INSERT INTO reset_codes(code, email) VALUES($1, $2) RETURNING *`;
    const params = [code, email];
    return db.query(q, params);
};

module.exports.selectCode = (email) => {
    console.log("Inside selectCode db.js :", email);
    const q = `SELECT * FROM reset_codes
            WHERE email = $1
            AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
            ORDER BY created_at DESC
            LIMIT 1`;
    const params = [email];
    return db.query(q, params);
};
