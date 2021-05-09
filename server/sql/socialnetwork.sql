DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL CHECK(first_name != ''),
    last_name VARCHAR NOT NULL CHECK(last_name != ''),
    email VARCHAR NOT NULL UNIQUE CHECK(email != ''),
    hash_password VARCHAR NOT NULL CHECK (hash_password != ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);