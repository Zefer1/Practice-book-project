import pool from './db/pool.js';

export interface Book {
  id: number;
  title: string;
  author: string;
  status: "want to read" | "reading" | "finished...good book!" | "finished...trash! Dont read it";
  rating: number | null;
  isbn: string | null;
  cover_url: string | null;
  created_at: string;
}

export async function addBook(title: string, author: string, isbn?: string): Promise<Book> {
  const coverUrl = isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` : null;
  const result = await pool.query(
    'INSERT INTO books (title, author, isbn, cover_url) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, author, isbn ?? null, coverUrl]
  );
  return result.rows[0];
}

export async function getBook(id: number): Promise<Book> {
  const result = await pool.query(
    'SELECT * FROM books WHERE id = $1',
    [id]
  );
  if (result.rows.length === 0) {
    throw new Error('Book not found');
  }
  return result.rows[0];
}

export async function getBooks(status?: string, sort?: string): Promise<Book[]> {
  const orderMap: Record<string, string> = {
    title: 'title ASC',
    rating: 'rating DESC NULLS LAST',
    recent: 'created_at DESC',
  };
  const orderBy = orderMap[sort ?? ''] ?? 'id ASC';

  if (status) {
    const result = await pool.query(
      `SELECT * FROM books WHERE status = $1 ORDER BY ${orderBy}`,
      [status]
    );
    return result.rows;
  }
  const result = await pool.query(`SELECT * FROM books ORDER BY ${orderBy}`);
  return result.rows;
}

export async function deleteBook(id: number): Promise<void> {
  const result = await pool.query(
    'DELETE FROM books WHERE id = $1',
    [id]
  );
  if (result.rowCount === 0) {
    throw new Error('Book not found');
  }
}

export async function updateBook(
  id: number,
  title: string,
  author: string,
  status: Book["status"],
  rating?: number | null
): Promise<Book> {
  const result = await pool.query(
    'UPDATE books SET title = $1, author = $2, status = $3, rating = $4 WHERE id = $5 RETURNING *',
    [title, author, status, rating ?? null, id]
  );
  if (result.rows.length === 0) {
    throw new Error('Book not found');
  }
  return result.rows[0];
}

export async function updateBookStatus(
  id: number,
  status: Book["status"]
): Promise<Book> {
  const result = await pool.query(
    'UPDATE books SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  if (result.rows.length === 0) {
    throw new Error('Book not found');
  }
  return result.rows[0];
}
