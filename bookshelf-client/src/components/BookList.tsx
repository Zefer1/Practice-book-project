import { type Book } from '../types';

interface Props {
    books: Book[];
    setBooks: (books: Book[]) => void;
}

const STATUSES = [
    "want to read",
    "reading",
    "finished...good book!",
    "finished...trash! Dont read it",
] as const;

const selectClass = "bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer";

export default function BookList({ books, setBooks }: Props) {

    function handleDelete(id: number) {
        fetch(`http://localhost:3000/books/${id}`, { method: 'DELETE' })
            .then(() => setBooks(books.filter(b => b.id !== id)));
    }

    function handleStatusChange(id: number, status: Book['status']) {
        fetch(`http://localhost:3000/books/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        })
        .then(() => {
            const updatedBooks = books.map(b => {
                if (b.id === id) {
                    return { ...b, status };
                }
                return b;
            });
            setBooks(updatedBooks);
        });
    }

    return (
        <ul className="max-w-md mx-auto px-4 flex flex-col gap-3">
            {books.map(book => (
                <li key={book.id} className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
                    <span className="text-gray-900 dark:text-white font-medium">{book.title}
                        <span className="text-gray-500 dark:text-gray-400 font-normal"> — {book.author}</span>
                    </span>
                    <div className="flex items-center gap-2">
                        <select
                            value={book.status}
                            onChange={e => handleStatusChange(book.id, e.target.value as Book['status'])}
                            className={selectClass}
                        >
                            {STATUSES.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => handleDelete(book.id)}
                            className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700 cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
