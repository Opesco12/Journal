import express from "express";
import { getCurrentUser, login, logout, register } from "../controllers/auth";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/me", requireAuth, getCurrentUser);
router.post("/logout", requireAuth, logout);

export default router;
