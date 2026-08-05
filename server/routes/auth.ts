import express from "express";
import { getCurrentUser, login, logout, register } from "../controllers/auth";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../validators/auth";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/me", requireAuth, getCurrentUser);
router.post("/logout", requireAuth, logout);

export default router;
