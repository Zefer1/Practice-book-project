DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id         SERIAL PRIMARY KEY,
    email      VARCHAR(255) UNIQUE NOT NULL,
    password   VARCHAR(255),                              -- nullable for OAuth users
    provider   VARCHAR(20) NOT NULL DEFAULT 'local',      -- 'local' or 'google'
    google_id  VARCHAR(255) UNIQUE,                       -- only set for Google users
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE books (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title      VARCHAR(255) NOT NULL,
    author     VARCHAR(255) NOT NULL,
    status     VARCHAR(50)  NOT NULL DEFAULT 'want to read',
    rating     INTEGER CHECK (rating >= 1 AND rating <= 5),
    isbn       VARCHAR(20),
    cover_url  TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
