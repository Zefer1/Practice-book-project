# Express + Express/TS — Full Recap

---

## Core Concepts (Angela Yu — Vanilla Express)

### 1. Server Setup
```javascript
import express from "express";
const app = express();
app.listen(3000, () => console.log("Running"));
```

### 2. Route Handlers
```javascript
app.get("/", (req, res) => res.send("home"));
app.post("/submit", (req, res) => res.send("ok"));
```

### 3. The `req` and `res` Objects

| Object | Property/Method | What it does |
|---|---|---|
| `req` | `req.body` | Parsed request body (forms, JSON) |
| `req` | `req.params` | URL parameters like `:id` |
| `req` | `req.method` | GET, POST, etc. |
| `req` | `req.url` | The request URL |
| `res` | `res.send()` | Text/HTML response |
| `res` | `res.json()` | JSON response |
| `res` | `res.sendFile()` | Serve a file |
| `res` | `res.redirect()` | Redirect to another route |
| `res` | `res.status(404)` | Set status code |

### 4. Static Files — `__dirname` in ES6 Modules
```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
```

### 5. Middleware
```javascript
const myMiddleware = (req, res, next) => {
  // do something
  next(); // NEVER forget this — or send a response, never both
};
```

**Rules:**
- Always call `next()` OR send a response. Never both.
- Order matters — runs top to bottom.

**Types:**
- Built-in: `express.json()`, `express.urlencoded({ extended: true })`
- Third-party: `morgan("dev")`
- Custom: write your own

### 6. Mounting Middleware

```javascript
// Global — runs on every request
app.use(morgan("dev"));
app.use(express.json());

// Route-level — runs only on this route
app.post("/enter", checkMember, (req, res) => { ... });
```

**Always this order:**
```javascript
app.use(morgan("dev"));                          // 1. log
app.use(express.urlencoded({ extended: true })); // 2. parse
app.use(customMiddleware);                       // 3. use req.body
```

---

## Additions from Maximilian (TypeScript Layer)

### 1. Project Setup
- TypeScript as **dev dependency**
- `tsconfig.json` with `target`, `module: NodeNext`, `outDir: dist`, `strict`, `esModuleInterop`
- Compile workflow: `tsc` → `node dist/app.js`

### 2. Type Packages
```bash
npm install --save-dev @types/node @types/express
```

### 3. Type Inference in Route Handlers
```typescript
// Inline — types inferred automatically
router.get("/", (req, res) => { ... });

// Standalone function — must declare types explicitly
function handler(req: Request, res: Response) { ... }
```

### 4. `req.body` is `any`
TypeScript won't catch typos on `req.body.propertyName`. Be careful. Use Zod later.

### 5. Router — Split Routes into Separate Files
```typescript
// src/routes/books.ts
const router = express.Router();
router.post("/books", (req, res) => { ... });
export default router;

// app.ts
import bookRoutes from "./src/routes/books.js";
app.use(bookRoutes);
```

The import name (`bookRoutes`) is yours to choose — it's a default export.

### 6. URL Params Always Come as Strings
```typescript
const id = Number(req.params.id); // always cast to number
```

### 7. Global Error Handler — 4 Parameters
```typescript
import type { Request, Response, NextFunction } from "express";

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message || "An error occurred" });
});
```
- Must have exactly **4 parameters** or Express won't treat it as an error handler
- Must be registered **after all routes**

### 8. The `.js` Extension Rule
```typescript
import bookRoutes from "./src/routes/books.js"; // ✅
import bookRoutes from "./src/routes/books";    // ❌
import bookRoutes from "./src/routes/books.ts"; // ❌
```
Node runs compiled `.js` files. Imports must point to the output, not the source.
