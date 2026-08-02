import express from "express";
import { login, logout, register } from "../controllers/auth";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", requireAuth, logout);

export default router;
