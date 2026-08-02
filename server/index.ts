import express from "express";

import { errorHandler } from "./middleware/error";
import { requireAuth } from "./middleware/auth";
import authRoutes from "./routes/auth";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// authentication middleware
app.use(requireAuth);

app.use("/auth", authRoutes);

// error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
