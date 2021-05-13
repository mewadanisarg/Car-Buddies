DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reset_codes;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL CHECK(first_name != ''),
    last_name VARCHAR NOT NULL CHECK(last_name != ''),
    email VARCHAR NOT NULL UNIQUE CHECK(email != ''),
    hash_password VARCHAR NOT NULL CHECK (hash_password != ''),
    img_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    code VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);