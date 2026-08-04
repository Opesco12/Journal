import express from "express";
import {
  createPostController,
  draftPostsController,
  getAllPublishedPostsController,
  publishPostController,
  unpublishPostController,
} from "../controllers/posts";

const router = express.Router();

router.get("/", getAllPublishedPostsController);
router.get("/drafts", draftPostsController);
router.put("/publish", publishPostController);
router.put("/unPublish", unpublishPostController);

router.post("/create", createPostController);

export default router;
