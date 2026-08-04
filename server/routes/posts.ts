import express from "express";
import {
  createPostController,
  draftPostsController,
  getAllPublishedPostsController,
  publishPostController,
  updatePostController,
  unpublishPostController,
} from "../controllers/posts";

const router = express.Router();

router.get("/", getAllPublishedPostsController);
router.get("/drafts", draftPostsController);
router.patch("/publish/:postId", publishPostController);
router.patch("/unPublish/:postId", unpublishPostController);
router.patch("/update/:postId", updatePostController);

router.post("/create", createPostController);

export default router;
