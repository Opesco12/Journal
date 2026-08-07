import express from "express";
import {
  createPostController,
  deletePostController,
  draftPostsController,
  getAllPublishedPostsController,
  getPostsByCategoryController,
  getSinglePostController,
  publishPostController,
  searchDraftPostsController,
  searchPostsController,
  updatePostController,
  unpublishPostController,
  getUserPostsController,
} from "../controllers/posts";
import { validate } from "../middleware/validate";
import {
  categoryPostsSortSchema,
  createPostSchema,
  postSortSchema,
  postIdParamSchema,
  searchPostsSchema,
  updatePostSchema,
  userPostsSortSchema,
} from "../validators/posts";
import { likePostController, unlikePostController } from "../controllers/likes";
import {
  bookmarkController,
  removeBookmarkController,
  userBookmarksController,
} from "../controllers/bookmarks";

const router = express.Router();

router.get("/", validate(postSortSchema), getAllPublishedPostsController);
router.get("/drafts", validate(postSortSchema), draftPostsController);
router.get("/search", validate(searchPostsSchema), searchPostsController);
router.get(
  "/drafts/search",
  validate(searchPostsSchema),
  searchDraftPostsController,
);
router.get(
  "/category/:categoryId",
  validate(categoryPostsSortSchema),
  getPostsByCategoryController,
);
router.get(
  "/user/:userId",
  validate(userPostsSortSchema),
  getUserPostsController,
);
router.get("/bookmarks", validate(postSortSchema), userBookmarksController);
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

export default router;
