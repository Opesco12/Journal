import express from "express";
import multer from "multer";

import { errorHandler } from "./middleware/error";
import authRoutes from "./routes/auth";
import posts from "./routes/posts";
import categoryRoutes from "./routes/category";
import userRoutes from "./routes/users";
import { requireAuth } from "./middleware/auth";
import { swaggerHtml, swaggerSpec } from "./docs/swagger";

const upload = multer({ dest: "uploads/" });
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/docs.json", (_req, res) => {
  res.json(swaggerSpec);
});
app.get("/api/docs", (_req, res) => {
  res.type("html").send(swaggerHtml);
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", requireAuth, upload.array("images"), posts);
app.use("/api/users", requireAuth, userRoutes);
app.use("/api/category", categoryRoutes);

// error handling middleware
app.use(errorHandler);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
