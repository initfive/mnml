DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS playlist;
DROP TABLE IF EXISTS imageboard;




CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(100) NOT NULL,
    bio VARCHAR(100),
    image VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE friendships (
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id),
    receiver_id INT REFERENCES users(id),
    status VARCHAR (10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE playlist (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    song_title VARCHAR (150) NOT NULL,
    song_url TEXT NOT NULL
);

CREATE TABLE imageboard (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
