import express from "express";
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
  categorySortSchema,
  categoryIdParamSchema,
  createCategorySchema,
  updateCategorySchema,
} from "../validators/categories";
import { requireAdmin } from "../middleware/auth";

const router = express.Router();

router.get("/", validate(categorySortSchema), getCategoriesController);
router.post(
  "/create",
  requireAdmin,
  validate(createCategorySchema),
  createCategoryController,
);
router.patch(
  "/update/:categoryId",
  requireAdmin,
  validate(updateCategorySchema),
  updateCategoryController,
);
router.delete(
  "/delete/:categoryId",
  requireAdmin,
  validate(categoryIdParamSchema),
  deleteCategoryController,
);
router.post(
  "/assign",
  validate(assignPostToCategorySchema),
  assignPostToCategoryController,
);

export default router;
