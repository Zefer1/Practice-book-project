export interface Book {
    id: number;
    title: string;
    author: string;
    status: "want to read" | "reading" | "finished...good book!" | "finished...trash! Dont read it";
    rating: number | null;
    isbn: string | null;
    cover_url: string | null;
    created_at: string;
}