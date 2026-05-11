DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  author     VARCHAR(255) NOT NULL,
  status     VARCHAR(50)  NOT NULL DEFAULT 'want to read',
  rating     INTEGER CHECK (rating >= 1 AND rating <= 5),
  isbn       VARCHAR(20),
  cover_url  TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
