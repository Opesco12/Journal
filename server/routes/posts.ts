import express from "express";
import {
  createPostController,
  deletePostController,
  draftPostsController,
  getAllPublishedPostsController,
  getSinglePostController,
  publishPostController,
  updatePostController,
  unpublishPostController,
} from "../controllers/posts";
import { validate } from "../middleware/validate";
import {
  createPostSchema,
  postIdParamSchema,
  updatePostSchema,
} from "../validators/posts";

const router = express.Router();

router.get("/", getAllPublishedPostsController);
router.get("/drafts", draftPostsController);
router.get("/:postId", validate(postIdParamSchema), getSinglePostController);

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
