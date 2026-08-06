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
import { likePostController } from "../controllers/likes";
import { likePostSchema } from "../validators/likes";

const router = express.Router();

router.get("/", getAllPublishedPostsController);
router.get("/drafts", draftPostsController);
router.get("/:postId", validate(postIdParamSchema), getSinglePostController);

router.patch(
  "/publish/:postId",
  validate(postIdParamSchema),
  publishPostController,
);
router.patch(
  "/unPublish/:postId",
  validate(postIdParamSchema),
  unpublishPostController,
);
router.patch(
  "/update/:postId",
  validate(updatePostSchema),
  updatePostController,
);
router.delete("/delete/:postId", deletePostController);
router.post("/create", validate(createPostSchema), createPostController);

router.post("/like", validate(likePostSchema), likePostController);

export default router;
