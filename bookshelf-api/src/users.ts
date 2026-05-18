import pool from '../db/pool.js';

export interface User {
    id: number;
    email: string;
    password: string | null;
    provider: 'local' | 'google';
    google_id: string | null;
    created_at: string;
}

export async function findUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
    return result.rows[0] ?? null;
}

export async function findUserById(id: number): Promise<User | null> {
    const result = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
    );
    return result.rows[0] ?? null;
}

export async function createLocalUser(
    email: string,
    hashedPassword: string
): Promise<User> {
    const result = await pool.query(
        `INSERT INTO users (email, password, provider)
         VALUES ($1, $2, 'local')
         RETURNING *`,
        [email, hashedPassword]
    );
    return result.rows[0];
}

export async function createGoogleUser(
    email: string,
    googleId: string
): Promise<User> {
    const result = await pool.query(
        `INSERT INTO users (email, provider, google_id)
         VALUES ($1, 'google', $2)
         RETURNING *`,
        [email, googleId]
    );
    return result.rows[0];
}