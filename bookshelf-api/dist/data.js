import pool from './db/pool.js';
export async function addBook(title, author) {
    const result = await pool.query('INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *', [title, author]);
    return result.rows[0];
}
export async function getBook(id) {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (result.rows.length === 0) {
        throw new Error('Book not found');
    }
    return result.rows[0];
}
export async function getBooks(status) {
    if (status) {
        const result = await pool.query('SELECT * FROM books WHERE status = $1 ORDER BY id ASC', [status]);
        return result.rows;
    }
    const result = await pool.query('SELECT * FROM books ORDER BY id ASC');
    return result.rows;
}
export async function deleteBook(id) {
    const result = await pool.query('DELETE FROM books WHERE id = $1', [id]);
    if (result.rowCount === 0) {
        throw new Error('Book not found');
    }
}
export async function updateBook(id, title, author, status) {
    const result = await pool.query('UPDATE books SET title = $1, author = $2, status = $3 WHERE id = $4 RETURNING *', [title, author, status, id]);
    if (result.rows.length === 0) {
        throw new Error('Book not found');
    }
    return result.rows[0];
}
export async function updateBookStatus(id, status) {
    const result = await pool.query('UPDATE books SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    if (result.rows.length === 0) {
        throw new Error('Book not found');
    }
    return result.rows[0];
}
