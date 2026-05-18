import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createLocalUser } from '../users.js';
import passport from '../auth/passport-config.js';
import type { User } from '../users.js';

const router = Router();
const SALT_ROUNDS = 10;
const JWT_EXPIRY = '7d';

function signToken(user: { id: number; email: string }): string {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: JWT_EXPIRY }
    );
}

// POST /auth/register
router.post('/auth/register', async (req, res) => {
    const { email, password } = req.body;

    if (typeof email !== 'string' || !email.includes('@')) {
        res.status(400).json({ message: 'Valid email is required' });
        return;
    }
    if (typeof password !== 'string' || password.length < 8) {
        res.status(400).json({ message: 'Password must be at least 8 characters' });
        return;
    }

    try {
        const existing = await findUserByEmail(email);
        if (existing) {
            res.status(409).json({ message: 'Email already registered' });
            return;
        }

        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await createLocalUser(email, hash);

        const token = signToken({ id: user.id, email: user.email });
        res.status(201).json({ token, user: { id: user.id, email: user.email } });
    } catch {
        res.status(500).json({ message: 'Failed to register' });
    }
});

// POST /auth/login
router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
        res.status(400).json({ message: 'Email and password required' });
        return;
    }

    try {
        const user = await findUserByEmail(email);

        // Same error message whether the user exists or the password is wrong.
        // Otherwise attackers can probe which emails are registered.
        if (!user || !user.password) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = signToken({ id: user.id, email: user.email });
        res.json({ token, user: { id: user.id, email: user.email } });
    } catch {
        res.status(500).json({ message: 'Failed to log in' });
    }
});

// GET /auth/google — start OAuth flow
router.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// GET /auth/google/callback — Google redirects here
router.get(
    '/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth` }),
    (req, res) => {
        const user = req.user as User;
        const token = signToken({ id: user.id, email: user.email });
        res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
    }
);

export default router;