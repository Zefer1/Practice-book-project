import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.message);
                return;
            }

            login(data.token, data.user);
        } catch {
            setError('Network error');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <button
                type="button"
                onClick={() => { window.location.href = 'http://localhost:3000/auth/google'; }}
                className="border border-gray-300 rounded px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300"
            >
                Continue with Google
            </button>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
                <hr className="flex-1 border-gray-300 dark:border-gray-600" />
                or
                <hr className="flex-1 border-gray-300 dark:border-gray-600" />
            </div>
            <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="border rounded px-3 py-2"
            />
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="border rounded px-3 py-2"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 cursor-pointer">
                Log in
            </button>
        </form>
    );
}