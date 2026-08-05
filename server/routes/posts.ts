import express from "express";
import {
  createPostController,
  draftPostsController,
  getAllPublishedPostsController,
  publishPostController,
  updatePostController,
  unpublishPostController,
  getSinglePostController,
  deletePostController,
} from "../controllers/posts";
import { validate } from "../middleware/validate";
import { createPostSchema } from "../validators/create-post";
import { updatePostSchema } from "../validators/update-post";

const router = express.Router();

router.get("/", getAllPublishedPostsController);
router.get("/drafts", draftPostsController);
router.get("/:postId", getSinglePostController);

router.patch("/publish/:postId", publishPostController);
router.patch("/unPublish/:postId", unpublishPostController);
router.patch(
  "/update/:postId",
  validate(updatePostSchema),
  updatePostController,
);
router.delete("/delete/:postId", deletePostController);
router.post("/create", validate(createPostSchema), createPostController);

export default router;
