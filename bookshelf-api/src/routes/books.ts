import { Router } from "express";
import { addBook, getBook, getBooks, updateBook, updateBookStatus, deleteBook } from "../../data.js";

const router = Router();

const VALID_STATUSES = [
    "want to read",
    "reading",
    "finished...good book!",
    "finished...trash! Dont read it",
] as const;

type Status = typeof VALID_STATUSES[number];

function parseId(raw: string): number | null {
    const id = Number(raw);
    return Number.isInteger(id) && id > 0 ? id : null;
}

router.post('/books', (req, res) => {
    const { title, author } = req.body;

    if (typeof title !== "string" || title.trim() === "") {
        res.status(400).json({ message: "title is required and must be a non-empty string" });
        return;
    }
    if (typeof author !== "string" || author.trim() === "") {
        res.status(400).json({ message: "author is required and must be a non-empty string" });
        return;
    }

    const addedBook = addBook(title.trim(), author.trim());
    res.status(201).json(addedBook);
});

router.get('/books', (req, res) => {
    const { status } = req.query;
    const books = status
        ? getBooks().filter(b => b.status === status)
        : getBooks();
    res.json({ books });
});
router.get('/books/:id', (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
        res.status(400).json({ message: "id must be a positive integer" });
        return;
    }
    try {
        const book = getBook(id);
        res.json(book);
    } catch {
        res.status(404).json({ message: "Book not found" });
    }
});

// Full update — replaces all fields
router.put('/books/:id', (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
        res.status(400).json({ message: "id must be a positive integer" });
        return;
    }

    const { title, author, status } = req.body;

    if (typeof title !== "string" || title.trim() === "") {
        res.status(400).json({ message: "title is required and must be a non-empty string" });
        return;
    }
    if (typeof author !== "string" || author.trim() === "") {
        res.status(400).json({ message: "author is required and must be a non-empty string" });
        return;
    }
    if (!VALID_STATUSES.includes(status as Status)) {
        res.status(400).json({ message: `status must be one of: ${VALID_STATUSES.join(", ")}` });
        return;
    }

    try {
        res.json(updateBook(id, title.trim(), author.trim(), status));
    } catch {
        res.status(404).json({ message: "Book not found" });
    }
});

// Partial update — status only (for the dropdown)
router.patch('/books/:id/status', (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
        res.status(400).json({ message: "id must be a positive integer" });
        return;
    }

    const { status } = req.body;

    if (!VALID_STATUSES.includes(status as Status)) {
        res.status(400).json({ message: `status must be one of: ${VALID_STATUSES.join(", ")}` });
        return;
    }

    try {
        res.json(updateBookStatus(id, status));
    } catch {
        res.status(404).json({ message: "Book not found" });
    }
});

router.delete('/books/:id', (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
        res.status(400).json({ message: "id must be a positive integer" });
        return;
    }
    try {
        deleteBook(id);
        res.json({ message: "Book deleted" });
    } catch {
        res.status(404).json({ message: "Book not found" });
    }
});

export default router;
