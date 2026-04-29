# Async JS — Promises, fetch, .then

---

## 1. Promises — The Foundation

A **Promise** is an object that represents a value you don't have yet.
It's JavaScript's way of saying: *"I'll get back to you."*

```javascript
// A Promise has 3 states:
// - pending   → still waiting
// - fulfilled → got the value
// - rejected  → something went wrong
```

Think of it like ordering food:
- You place the order → **pending**
- Food arrives → **fulfilled**
- Kitchen is closed → **rejected**

---

## 2. `.then()` — What to do when the Promise resolves

`.then()` takes a callback. That callback runs when the Promise fulfills.

```javascript
fetch('http://localhost:3000/books')    // returns a Promise
    .then(res => res.json())            // when fetch is done, parse JSON → another Promise
    .then(data => console.log(data))    // when parsing is done, use the data
```

**Why two `.then()` calls?**

`fetch` gives you a Response object — not the data itself. You have to call `res.json()` to extract the body, and *that* is also async (returns another Promise). So you chain a second `.then()`.

```javascript
fetch(url)                   // Promise<Response>
  .then(res => res.json())   // Promise<any>
  .then(data => {            // actual data finally here
      setBooks(data.books);
  });
```

---

## 3. `fetch` — Talking to the Backend

`fetch` is the browser's built-in tool for making HTTP requests.

```javascript
// GET — no options needed
fetch('http://localhost:3000/books')

// POST
fetch('http://localhost:3000/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Dune', author: 'Frank Herbert' })
})

// PATCH
fetch(`http://localhost:3000/books/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'reading' })
})

// DELETE
fetch(`http://localhost:3000/books/${id}`, {
    method: 'DELETE'
})
```

**Important:** `fetch` never throws on a 404 or 500. It only rejects on network failure. Check `res.ok` if you want to catch HTTP errors.

---

## Common Pitfalls

| Problem | Cause | Fix |
|---|---|---|
| Data is `undefined` | Forgot second `.then()` to parse JSON | Chain `.then(res => res.json())` first |
| 404 doesn't throw | `fetch` only rejects on network failure | Check `res.ok` manually |
| `body` not sending | Forgot `JSON.stringify()` | Wrap object with `JSON.stringify({ ... })` |
| Backend rejects request | Missing `Content-Type` header | Add `headers: { 'Content-Type': 'application/json' }` |
