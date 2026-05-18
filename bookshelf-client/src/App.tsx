import { useState, useEffect } from 'react';
import { type Book } from './types';
import BookList from './components/BookList';
import AddBookForm from './components/AddBookForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { useAuth } from './context/AuthContext';

function App() {
    const { user, token, logout } = useAuth();
    const [books, setBooks] = useState<Book[]>([]);
    const [darkMode, setDarkMode] = useState(true);
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    useEffect(() => {
        if (!token) return;
        fetch('http://localhost:3000/books', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setBooks(data.books));
    }, [token]);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 w-full max-w-sm">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">My Bookshelf</h1>
                    {showRegister ? (
                        <>
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Create account</h2>
                            <RegisterForm />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                                Already have an account?{' '}
                                <button onClick={() => setShowRegister(false)} className="text-blue-600 hover:underline cursor-pointer">
                                    Log in
                                </button>
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Log in</h2>
                            <LoginForm />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                                No account yet?{' '}
                                <button onClick={() => setShowRegister(true)} className="text-blue-600 hover:underline cursor-pointer">
                                    Register
                                </button>
                            </p>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 transition-colors duration-300">
            <div className="max-w-md mx-auto px-4 flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Bookshelf</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button
                        onClick={logout}
                        className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-700"
                    >
                        Log out
                    </button>
                </div>
            </div>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">{user.email}</p>
            <AddBookForm books={books} setBooks={setBooks} />
            <div className="mt-6">
                <BookList books={books} setBooks={setBooks} />
            </div>
        </div>
    );
}

export default App;
