import express from "express";
import {
  deleteAdminCommentController,
  deleteAdminPostController,
  getAdminPostsController,
  getAdminStatsController,
  getAdminUsersController,
  publishAdminPostController,
  unpublishAdminPostController,
  updateAdminUserRoleController,
} from "../controllers/admin";
import {
  assignPostToCategoryController,
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  updateCategoryController,
} from "../controllers/category";
import { validate } from "../middleware/validate";
import {
  assignPostToCategorySchema,
  categoryIdParamSchema,
  categorySortSchema,
  createCategorySchema,
  updateCategorySchema,
} from "../validators/categories";
import {
  adminCommentIdSchema,
  adminPostIdSchema,
  adminPostsSchema,
  adminUserRoleSchema,
  adminUsersSchema,
} from "../validators/admin";

const router = express.Router();

router.get("/stats", getAdminStatsController);

router.get("/users", validate(adminUsersSchema), getAdminUsersController);
router.patch(
  "/users/:userId/role",
  validate(adminUserRoleSchema),
  updateAdminUserRoleController,
);

router.get("/posts", validate(adminPostsSchema), getAdminPostsController);
router.patch(
  "/posts/:postId/publish",
  validate(adminPostIdSchema),
  publishAdminPostController,
);
router.patch(
  "/posts/:postId/unpublish",
  validate(adminPostIdSchema),
  unpublishAdminPostController,
);
router.delete(
  "/posts/:postId",
  validate(adminPostIdSchema),
  deleteAdminPostController,
);

router.delete(
  "/comments/:commentId",
  validate(adminCommentIdSchema),
  deleteAdminCommentController,
);

router.get("/category", validate(categorySortSchema), getCategoriesController);
router.post(
  "/category/create",
  validate(createCategorySchema),
  createCategoryController,
);
router.patch(
  "/category/update/:categoryId",
  validate(updateCategorySchema),
  updateCategoryController,
);
router.delete(
  "/category/delete/:categoryId",
  validate(categoryIdParamSchema),
  deleteCategoryController,
);
router.post(
  "/category/assign",
  validate(assignPostToCategorySchema),
  assignPostToCategoryController,
);

export default router;
