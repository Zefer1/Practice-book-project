# React Hooks & Props — Recap

---

## 1. Props — Passing Data Between Components

Props are how a parent component passes data to a child. Think of them as arguments to a function — the child declares what it needs, the parent provides it.

```tsx
// Parent — passes data down
<BookList books={books} setBooks={setBooks} />

// Child — declares what it accepts
interface Props {
    books: Book[];
    setBooks: (books: Book[]) => void;
}

export default function BookList({ books, setBooks }: Props) {
    // books and setBooks are available here
}
```

### Rules
- Data flows **one way** — parent to child, never the other way around
- To let a child modify parent state, pass the **setter function** as a prop
- Props are **read-only** inside the child — never modify them directly

### interface Props

The `interface Props` block is TypeScript describing the shape of what the parent passes in:

```tsx
interface Props {
    books: Book[];                     // an array of Book objects
    setBooks: (books: Book[]) => void; // a function, returns nothing
}
```

Without it, TypeScript doesn't know what the component accepts and can't catch typos.

---

## 2. `useState` — Memory Inside a Component

React re-renders components when data changes. But regular variables reset on every render. `useState` gives you a variable that **survives re-renders** and **triggers a re-render when it changes**.

```tsx
const [books, setBooks] = useState<Book[]>([]);
//     ^^^^^  ^^^^^^^^   ^^^^^^^^^^^^^^^^^^^^^^^
//     value  setter     initial value (empty array)
```

**Rules:**
- Never mutate state directly → `books.push(x)` won't trigger a re-render
- Always use the setter → `setBooks([...books, newBook])` ✅

```tsx
// ❌ Wrong — React won't notice
books.push(newBook);

// ✅ Add a book
setBooks([...books, newBook]);

// ✅ Remove a book
setBooks(books.filter(b => b.id !== id));

// ✅ Update one book
setBooks(books.map(b => b.id === id ? { ...b, status } : b));
```

---

## 2. `useEffect` — Side Effects After Render

React renders your component, then runs `useEffect`. Use it for anything that touches the outside world: fetching data, timers, event listeners.

```tsx
useEffect(() => {
    // code to run
}, [/* dependency array */]);
```

### The dependency array controls when it runs:

| Syntax | When it runs |
|---|---|
| `useEffect(() => {...}, [])` | Once — when component first appears |
| `useEffect(() => {...}, [id])` | On mount + every time `id` changes |
| `useEffect(() => {...})` | Every render (almost never what you want) |

### Fetching on mount:

```tsx
useEffect(() => {
    fetch('http://localhost:3000/books')
        .then(res => res.json())
        .then(data => setBooks(data.books));
}, []); // [] = "only run once when the page loads"
```

---

## 3. Lifting State Up

When two sibling components need the same data, move state to their common parent and pass it down via props.

```
App.tsx        ← owns books[]
├── AddBookForm  ← receives setBooks → adds a book
└── BookList     ← receives books + setBooks → displays, deletes, updates
```

```tsx
// App.tsx
const [books, setBooks] = useState<Book[]>([]);

return (
    <>
        <AddBookForm setBooks={setBooks} />
        <BookList books={books} setBooks={setBooks} />
    </>
);
```

---

## Common Pitfalls

| Problem | Cause | Fix |
|---|---|---|
| `Property X does not exist` TS error | Prop not declared in `interface Props` | Add it to the interface |
| Child can't update parent data | Passed the value, not the setter | Pass `setBooks` as a prop |
| `useEffect` runs infinitely | Missing or wrong dependency array | Use `[]` for mount-only |
| UI doesn't update after mutation | State not refreshed | Re-fetch or manually update state with setter |
| `Cannot read properties of undefined` | Wrong shape assumed | `console.log(data)` to inspect response first |