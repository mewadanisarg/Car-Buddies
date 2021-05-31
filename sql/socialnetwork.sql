DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS reset_codes CASCADE;
DROP TABLE IF EXISTS friendships CASCADE;
DROP TABLE IF EXISTS chats CASCADE;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL CHECK(first_name != ''),
    last_name VARCHAR NOT NULL CHECK(last_name != ''),
    email VARCHAR NOT NULL UNIQUE CHECK(email != ''),
    car_maker VARCHAR NOT NULL CHECK(car_maker != ''),
    modal_no VARCHAR NOT NULL CHECK(modal_no != ''),
    registered_year INT,
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

CREATE TABLE friendships(
id SERIAL PRIMARY KEY,
sender_id INT REFERENCES users(id) NOT NULL,
recipient_id INT REFERENCES users(id) NOT NULL,
accepted BOOLEAN DEFAULT false);

CREATE TABLE chat(
id            SERIAL PRIMARY KEY,
sender_id     INT REFERENCES users(id) NOT NULL,
message       TEXT NOT NULL,
created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);