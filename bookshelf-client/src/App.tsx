import { useState, useEffect } from 'react';
import { type Book } from './types';
import BookList from './components/BookList';
import AddBookForm from './components/AddBookForm';

function App() {
    const [books, setBooks] = useState<Book[]>([]);
    const [darkMode, setDarkMode] = useState(true);

    // Adds or removes the "dark" class on <html> whenever darkMode changes
    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    useEffect(() => {
        fetch('http://localhost:3000/books')
            .then(res => res.json())
            .then(data => setBooks(data.books));
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 transition-colors duration-300">
            <div className="max-w-md mx-auto px-4 flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Bookshelf</h1>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>
            <AddBookForm books={books} setBooks={setBooks} />
            <div className="mt-6">
                <BookList books={books} setBooks={setBooks} />
            </div>
        </div>
    );
}

export default App;
