import { useState } from 'react';
import { type Book } from '../types';

interface Props {
    books: Book[];
    setBooks: (books: Book[]) => void;
}

const inputClass = "w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400";

export default function AddBookForm({ books, setBooks }: Props) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        fetch('http://localhost:3000/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author })
        })
        .then(res => res.json())
        .then(newBook => {
            setBooks([...books, newBook]);
            setTitle('');
            setAuthor('');
        });
    }

    return (
        <div className="max-w-md mx-auto px-4">
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <input
                    className={inputClass}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Title"
                />
                <input
                    className={inputClass}
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    placeholder="Author"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 cursor-pointer"
                >
                    Add Book
                </button>
            </form>
        </div>
    );
}
