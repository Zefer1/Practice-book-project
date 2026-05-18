# Bookshelf App

Practice project to re-learn full-stack development.

## Stack

- **Backend** — Node.js, Express, TypeScript, PostgreSQL
- **Frontend** — React, TypeScript, Tailwind CSS, Vite
- **Auth** — JWT (local) + Google OAuth 2.0

## What it does

A bookshelf tracker where each user manages their own books. Add books, update reading status, rate them, delete them. Login with email/password or Google account.

## Running locally

**Requirements:** PostgreSQL running locally with a `bookshelf` database. Create a `.env` file inside `bookshelf-api/`:

```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=bookshelf
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_random_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

Run `bookshelf-api/db/schema.sql` in pgAdmin to create the tables.

**Backend**
```bash
cd bookshelf-api
npm run compile
npm start
```

**Frontend**
```bash
cd bookshelf-client
npm run dev
```

Backend runs on `http://localhost:3000`, frontend on `http://localhost:5173`.
