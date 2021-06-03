const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/carbuddies"
);

// Inserting new user Data into DB with hashed password
module.exports.addUser = (
    first_name,
    last_name,
    email,
    car_maker,
    modal_no,
    registered_year,
    hash_password
) => {
    console.log(
        "Inside module.export.userRegistration",
        first_name,
        last_name,
        email,
        car_maker,
        modal_no,
        registered_year,
        hash_password
    );
    const q = `
    INSERT INTO users (first_name, last_name, email, car_maker, modal_no, registered_year, hash_password) 
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING id`;
    const params = [
        first_name,
        last_name,
        email,
        car_maker,
        modal_no,
        registered_year,
        hash_password,
    ];
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
    const q = `UPDATE users SET hash_password = $1 WHERE email = $2 RETURNING *`;
    const params = [hash_password, email];
    return db.query(q, params);
};

module.exports.getUserInfo = (userId) => {
    return db.query(
        `
            SELECT * FROM users
            WHERE id = $1
        `,
        [userId]
    );
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

// Fetching the user Id
module.exports.getUserInfo = (userId) => {
    console.log("Inside module.exports.getUserInfo: ", userId);
    const q = `SELECT * FROM users WHERE id = $1`;
    const params = [userId];
    return db.query(q, params);
};

// Updating the profile pic of the user
module.exports.uploadProfilePic = (imgUrl, userId) => {
    console.log("Inside module.exports.uploadImage:", imgUrl, userId);
    const q = `UPDATE users SET img_url = $1 WHERE id = $2 RETURNING *`;
    const params = [imgUrl, userId];
    return db.query(q, params);
};

// Updating the Bio information of the user who is logged in
module.exports.updateUserBio = (biotext, userId) => {
    console.log("Inside module.exports.updateUserBio: ", biotext, userId);
    const q = `UPDATE users SET bio = $1 WHERE id = $2 RETURNING *`;
    const params = [biotext, userId];
    return db.query(q, params);
};

// See Other Users Information
module.exports.getOtherUserProfile = (OthersId) => {
    console.log("Inside module.exports.getOtherUserProfile: ", OthersId);
    const q = `SELECT first_name, last_name, bio, img_url FROM users WHERE id = $1`;
    const params = [OthersId];
    return db.query(q, params);
};

// See the newly added user limited to 3 users at time
module.exports.getNewlyAddedUser = () => {
    console.log("Inside module.exports.newlyAddedUser:");
    const q = `SELECT * FROM users ORDER BY id DESC LIMIT 3`;
    const params = [];
    return db.query(q, params);
};

module.exports.getUsersByName = (nameSearch) => {
    console.log("Inside module.exports.getUsersByName:", nameSearch);
    const q = `SELECT * FROM users WHERE car_maker ILIKE $1`;
    const params = [nameSearch + "%"];
    return db.query(q, params);
};

// Part 8 for frienship connection

module.exports.getConnected = (loggedInUser, connectingUser) => {
    console.log(
        "Inside module.exports.getConnected: ",
        loggedInUser,
        connectingUser
    );
    const q = `SELECT * FROM friendships WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id =$2 AND sender_id=$1)`;
    const params = [loggedInUser, connectingUser];
    return db.query(q, params);
};

module.exports.addConnection = (loggedInUser, connectingUser) => {
    console.log(
        "Inside module.exports.addConnection: ",
        loggedInUser,
        connectingUser
    );
    const q = `INSERT INTO friendships (sender_id, recipient_id) VALUES ($1, $2) RETURNING *`;
    const params = [loggedInUser, connectingUser];
    return db.query(q, params);
};

module.exports.updateConnection = (loggedInUser, connectingUser) => {
    console.log(
        "Inside module.exports.updateConnection: ",
        loggedInUser,
        connectingUser
    );
    const q = `UPDATE friendships SET accepted = true WHERE recipient_id = $1 AND sender_id = $2 RETURNING *`;
    const params = [loggedInUser, connectingUser];
    return db.query(q, params);
};

module.exports.unfriendConnection = (loggedInUser, connectingUser) => {
    console.log(
        "Inside module.exports.unfriendConnection",
        loggedInUser,
        connectingUser
    );
    const q = `DELETE FROM friendships WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id =$2 AND sender_id=$1)`;
    const params = [loggedInUser, connectingUser];
    return db.query(q, params);
};

// Part-9 for Freinds.js
module.exports.seeFriendsRequest = (userId) => {
    const q = `SELECT users.id, first_name, last_name, img_url, accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)`;
    const params = [userId];
    return db.query(q, params);
};

// Part-10 for chats

module.exports.insertMessages = (message, userId) => {
    const q = `INSERT INTO chat (message, sender_id) VALUES ($1, $2) RETURNING *`;
    const params = [message, userId];
    return db.query(q, params);
};

module.exports.getRecentChats = () => {
    return db.query(
        `SELECT users.id, first_name, last_name, img_url, message, chat.created_at FROM users JOIN chat ON chat.sender_id = users.id ORDER BY chat.created_at DESC LIMIT 10`
    );
};

// Delete Account with chats, info and connection.!

module.exports.deleteUsersInfo = (userId) => {
    console.log("Inside module.exports.deleteUsersInfo:", userId);
    const q = `DELETE FROM users WHERE id = $1`;
    const params = [userId];
    return db.query(q, params);
};

module.exports.deleteUsersConnection = (userId) => {
    console.log("Inside module.exports.deleteUsersConnection:", userId);
    const q = `DELETE FROM friendships WHERE recipient_id = $1 OR sender_id = $1`;
    const params = [userId];
    return db.query(q, params);
};

module.exports.deleteUsersChats = (userId) => {
    console.log("Inside module.exports.deleteUsersChats:", userId);
    const q = `DELETE FROM chat WHERE sender_id = $1`;
    const params = [userId];
    return db.query(q, params);
};

// Gallery Component
module.exports.insertImages = (url, userId) => {
    const q = `INSERT INTO gallery (url, user_id) VALUES ($1,$2) RETURNING *`;
    const params = [url, userId];
    return db.query(q, params);
};
module.exports.getAllImages = (userId) => {
    return db.query(
        `SELECT * FROM gallery WHERE user_id =$1 ORDER BY created_at DESC LIMIT 6`,
        [userId]
    );
};

module.exports.getOthersImages = (othersId) => {
    console.log("Inside module.exports.getOthersImages", othersId);
    return db.query(
        `SELECT * FROM gallery WHERE user_id =$1 ORDER BY created_at DESC LIMIT 6`,
        [othersId]
    );
};

//Private Message
module.exports.recentPrivateMessage = (sender_id, recipient_id) => {
    console.log(
        "Inside module.exports.recentPrivateMessage: ",
        sender_id,
        recipient_id
    );
    const q = `(SELECT privateMessage.sender_id, privateMessage.recipient_id, privateMessage.message, privateMessage.created_at, users.img_url, users.first_name, users.last_name
        FROM privateMessage
        JOIN users
        ON privateMessage.sender_id = users.id
        WHERE privateMessage.sender_id = ($1) AND privateMessage.recipient_id = ($2)
        OR privateMessage.recipient_id = ($1) AND privateMessage.sender_id = ($2)
    LIMIT 10)
    ORDER BY privateMessage.created_at DESC
    `;
    const params = [sender_id, recipient_id];
    return db.query(q, params);
};

module.exports.newPrivateMessage = (sender_id, recipient_id, message) => {
    console.log(
        "Inside module.exports.newPrivateMessage: ",
        sender_id,
        recipient_id,
        message
    );
    const q = `INSERT INTO privateMessage (sender_id, recipient_id, message)
    VALUES ($1, $2, $3)
    RETURNING id, created_at`;
    const params = [sender_id, recipient_id, message];
    return db.query(q, params);
};
