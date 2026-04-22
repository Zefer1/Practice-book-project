;
let BOOKS = [];
let nextId = 1;
export function addBook(title, author) {
    const newBook = { id: nextId++, title, author, status: "want to read" };
    BOOKS.push(newBook);
    return newBook;
}
export function getBook(id) {
    const book = BOOKS.find(function (book) {
        return book.id === id;
    });
    if (!book) {
        throw new Error("Book not found");
    }
    return book;
}
export function getBooks() {
    return BOOKS;
}
export function deleteBook(id) {
    BOOKS = BOOKS.filter(function (book) {
        return book.id !== id;
    });
}
export function updateBook(id, title, author, status) {
    const book = getBook(id);
    book.title = title;
    book.author = author;
    book.status = status;
    return book;
}
