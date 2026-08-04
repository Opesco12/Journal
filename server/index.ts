import express from "express";
import multer from "multer";

import { errorHandler } from "./middleware/error";
import authRoutes from "./routes/auth";
import posts from "./routes/posts";
import { requireAuth } from "./middleware/auth";

const upload = multer({ dest: "uploads/" });
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/posts", requireAuth, upload.array("images"), posts);

// error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
