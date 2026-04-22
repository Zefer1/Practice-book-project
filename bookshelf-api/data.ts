interface Book {
    id: number,
    title: string,
    author: string,
    status: "want to read" | "reading" | "finished...good book!" | "finished...trash! Dont read it"
};

let BOOKS: Book[] = [];

let nextId = 1;

export function addBook(title: string, author: string) {
    const newBook = { id: nextId++, title, author, status: "want to read" as const};
    BOOKS.push(newBook);
    return newBook;
}

export function getBook(id: number) {
    const book = BOOKS.find(function(book) {
        return book.id === id;
    });
    if(!book) {
        throw new Error("Book not found");
    }
    return book;
}

export function getBooks() {
    return BOOKS;
}

export function deleteBook(id: number) {
    BOOKS = BOOKS.filter(function(book){
        return book.id !== id;
    });
}

export function updateBook(id: number, title: string, author: string, status: Book["status"]): Book {
    const book = getBook(id);
    book.title = title;
    book.author = author;
    book.status = status;
    return book;
}
