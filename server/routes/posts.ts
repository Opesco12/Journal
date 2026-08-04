import express from "express";
import {
  createPost,
  draftPosts,
  getAllPublishedPosts,
  publishPost,
} from "../controllers/posts";

const router = express.Router();

router.get("/", getAllPublishedPosts);
router.get("/drafts", draftPosts);
router.put("/publish", publishPost);

router.post("/create", createPost);

export default router;
