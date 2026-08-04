import express from "express";
import { createPost, getAllPublishedPosts } from "../controllers/posts";

const router = express.Router();

router.get("/", getAllPublishedPosts);
router.post("/create", createPost);

export default router;
