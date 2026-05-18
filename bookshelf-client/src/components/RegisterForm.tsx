import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://localhost:3000/auth/register', {
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
                placeholder="Password (min 8 characters)"
                required
                className="border rounded px-3 py-2"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 cursor-pointer">
                Register
            </button>
        </form>
    );
}