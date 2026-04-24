export interface Book {
    id: number;
    title: string;
    author: string;
    status: "want to read" | "reading" | "finished...good book!" | "finished...trash! Dont read it";
}
