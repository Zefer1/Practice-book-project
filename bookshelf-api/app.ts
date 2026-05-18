import express from "express";
import cors from "cors";
import type { Request, Response, NextFunction } from "express";
import bookRoutes from "./src/routes/books.js";
import authRoutes from './src/routes/auth.js';
import passport from './src/auth/passport-config.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use(bookRoutes);
app.use(authRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ message: err.message || "An error occurred" });
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
