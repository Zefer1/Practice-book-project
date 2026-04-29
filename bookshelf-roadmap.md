# Bookshelf Project — Build Roadmap

---

## Phase 1: Backend Project Setup

### Step 1 — Create the project
```bash
mkdir bookshelf-api && cd bookshelf-api
npm init -y
```

### Step 2 — `package.json`
```json
{
  "type": "module",
  "scripts": {
    "compile": "tsc",
    "start": "node dist/app.js"
  }
}
```

### Step 3 — Install dependencies
```bash
npm install express cors
npm install --save-dev typescript @types/express @types/node @types/cors
```

### Step 4 — `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "lib": ["es2022", "dom"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### Step 5 — Folder structure
```
bookshelf-api/
  app.ts
  data.ts
  src/
    routes/
      books.ts
  test/
    books.http
```

---

## Phase 2: Data Layer

### Step 6 — Interface in `data.ts`
```typescript
interface Book {
  id: number;
  title: string;
  author: string;
  status: "want to read" | "reading" | "finished";
}
```

### Step 7 — CRUD functions to implement
- `addBook(title, author)` — status defaults to `"want to read"`
- `getBook(id)` — throws if not found
- `getBooks()` — returns all
- `updateBook(id, status)` — updates status only
- `removeBook(id)` — filters out

---

## Phase 3: Routes

### Step 8 — `src/routes/books.ts`

| Method | Path | Action |
|---|---|---|
| POST | `/books` | Add a book |
| GET | `/books` | Get all books |
| GET | `/books/:id` | Get one book |
| PATCH | `/books/:id` | Update status |
| DELETE | `/books/:id` | Remove a book |

- Wrap `getBook()` calls in try/catch — throws if id not found
- Always cast `req.params.id` with `Number()`
- Export router as default

---

## Phase 4: Server

### Step 9 — `app.ts`
```typescript
import express from "express";
import cors from "cors";
import type { Request, Response, NextFunction } from "express";
import bookRoutes from "./src/routes/books.js";

const app = express();

app.use(express.json());   // 1. parse JSON
app.use(cors());           // 2. allow frontend requests
app.use(bookRoutes);       // 3. mount routes

// 4. global error handler — must be last
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message || "An error occurred" });
});

app.listen(3000, () => console.log("Running on port 3000"));
```

---

## Phase 5: Test Backend

### Step 10 — Install REST Client extension in VS Code
Search: **REST Client** by Huachao Mao

### Step 11 — `test/books.http`
```http
### Add a book
POST http://localhost:3000/books
Content-Type: application/json

{ "title": "Dune", "author": "Frank Herbert" }

### Get all books
GET http://localhost:3000/books

### Get one book
GET http://localhost:3000/books/1

### Update status
PATCH http://localhost:3000/books/1
Content-Type: application/json

{ "status": "reading" }

### Delete a book
DELETE http://localhost:3000/books/1
```

### Step 12 — Compile and run
```bash
npm run compile
npm start
```

**Confirm every route works before touching the frontend.**

---

## Phase 6: Frontend Project Setup

### Step 13 — Create Vite project
```bash
npm create vite@latest bookshelf-client -- --template react-ts
cd bookshelf-client
npm install
npm install -D tailwindcss @tailwindcss/vite
```

### Step 14 — Folder structure
```
bookshelf-client/
  src/
    components/
      BookList.tsx
      AddBookForm.tsx
    App.tsx
    types.ts
```

### Step 15 — `types.ts`
Define the same Book interface so frontend and backend share the same shape:
```typescript
export interface Book {
  id: number;
  title: string;
  author: string;
  status: "want to read" | "reading" | "finished";
}
```

---

## Phase 7: Frontend Features

### Step 16 — `App.tsx`
- `useState` for books array
- `useEffect` to fetch all books on mount from `http://localhost:3000/books`

### Step 17 — `BookList.tsx`
- Renders list of books
- Each book has a **delete button** → fires `DELETE /books/:id`
- Each book has a **status dropdown** → fires `PATCH /books/:id`

### Step 18 — `AddBookForm.tsx`
- Controlled inputs for title and author
- On submit → fires `POST /books`
- On success → updates books list in `App.tsx`

---

## Phase 8: Connect Everything

### Step 19 — Run both servers
```bash
# Terminal 1 — backend
npm run compile && npm start   # port 3000

# Terminal 2 — frontend
npm run dev                    # port 5173
```

### Step 20 — Test the full cycle
- [ ] Add a book from the form
- [ ] See it appear in the list
- [ ] Change its status
- [ ] Delete it
- [ ] Confirm it's gone

---

## Phase 9: Styling with Tailwind

### Step 21 — Style `AddBookForm.tsx`
- Wrap form in a centered container with padding
- Style inputs: full width, border, rounded corners, padding
- Style button: background color, text color, hover state
- Add spacing between elements with `gap` or `mb`

### Step 22 — Style `BookList.tsx`
- Style the `<ul>` — remove default list styles (`list-none`)
- Each `<li>` — card look: border, rounded, padding, shadow
- `<span>` — title bold, author muted color
- Delete button — red, small
- Status `<select>` — styled to match the card

### Step 23 — Style `App.tsx` layout
- Center everything on the page
- Add a heading for the app
- Add spacing between the form and the list

---

## Common Pitfalls

| Problem | Cause | Fix |
|---|---|---|
| CORS error in browser | Missing `cors()` on backend | `app.use(cors())` |
| `req.body` undefined | Missing `express.json()` | `app.use(express.json())` |
| UI not updating after mutation | State not refreshed | Re-fetch or update state after every POST/PATCH/DELETE |
| Port conflict | Both running on same port | Backend: 3000, Frontend: 5173 |
| Import error at runtime | Wrong file extension | Use `.js` in all backend imports |
