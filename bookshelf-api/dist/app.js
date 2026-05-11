import express from "express";
import cors from "cors";
import bookRoutes from "./src/routes/books.js";
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());
app.use(bookRoutes);
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message || "An error occurred" });
});
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
