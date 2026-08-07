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
  getUserPostsController,
} from "../controllers/posts";
import { validate } from "../middleware/validate";
import {
  createPostSchema,
  postIdParamSchema,
  updatePostSchema,
  UserIdParamSchema,
} from "../validators/posts";
import { likePostController, unlikePostController } from "../controllers/likes";
import {
  bookmarkController,
  removeBookmarkController,
  userBookmarksController,
} from "../controllers/bookmarks";

const router = express.Router();

router.get("/", getAllPublishedPostsController);
router.get("/drafts", draftPostsController);
router.get(
  "/user/:userId",
  validate(UserIdParamSchema),
  getUserPostsController,
);
router.get("/bookmarks", userBookmarksController);
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

router.post("/like/:postId", validate(postIdParamSchema), likePostController);
router.delete(
  "/unlike/:postId",
  validate(postIdParamSchema),
  unlikePostController,
);

router.post(
  "/bookmark/:postId",
  validate(postIdParamSchema),
  bookmarkController,
);
router.delete(
  "/unBookmark/:postId",
  validate(postIdParamSchema),
  removeBookmarkController,
);

//TODO: Add route for getting posts by category

export default router;
