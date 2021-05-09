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
    console.log("module.exports.finduser email", email);
    return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};
