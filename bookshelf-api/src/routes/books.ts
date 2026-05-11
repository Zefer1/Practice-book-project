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

router.post('/books', async (req, res) => {
    const { title, author, isbn } = req.body;

    if (typeof title !== "string" || title.trim() === "") {
        res.status(400).json({ message: "title is required and must be a non-empty string" });
        return;
    }
    if (typeof author !== "string" || author.trim() === "") {
        res.status(400).json({ message: "author is required and must be a non-empty string" });
        return;
    }

    const isbnValue = typeof isbn === "string" && isbn.trim() !== "" ? isbn.trim() : undefined;

    try {
        const addedBook = await addBook(title.trim(), author.trim(), isbnValue);
        res.status(201).json(addedBook);
    } catch {
        res.status(500).json({ message: "Failed to add book" });
    }
});

router.get('/books', async (req, res) => {
    const { status, sort } = req.query;
    try {
        const books = await getBooks(status as string | undefined, sort as string | undefined);
        res.json({ books });
    } catch {
        res.status(500).json({ message: "Failed to fetch books" });
    }
});

router.get('/books/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
        res.status(400).json({ message: "id must be a positive integer" });
        return;
    }
    try {
        const book = await getBook(id);
        res.json(book);
    } catch {
        res.status(404).json({ message: "Book not found" });
    }
});

// Full update — replaces all fields
router.put('/books/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
        res.status(400).json({ message: "id must be a positive integer" });
        return;
    }

    const { title, author, status, rating } = req.body;

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
    if (rating !== undefined && rating !== null) {
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            res.status(400).json({ message: "rating must be an integer between 1 and 5" });
            return;
        }
    }

    try {
        const updated = await updateBook(id, title.trim(), author.trim(), status, rating ?? null);
        res.json(updated);
    } catch {
        res.status(404).json({ message: "Book not found" });
    }
});

// Partial update — status only (for the dropdown)
router.patch('/books/:id/status', async (req, res) => {
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
        const updated = await updateBookStatus(id, status);
        res.json(updated);
    } catch {
        res.status(404).json({ message: "Book not found" });
    }
});

router.delete('/books/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
        res.status(400).json({ message: "id must be a positive integer" });
        return;
    }
    try {
        await deleteBook(id);
        res.json({ message: "Book deleted" });
    } catch {
        res.status(404).json({ message: "Book not found" });
    }
});

export default router;
