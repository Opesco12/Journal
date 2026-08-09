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
  categoryIdParamSchema,
  categorySortSchema,
  createCategorySchema,
  updateCategorySchema,
} from "../validators/categories";

const router = express.Router();

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
