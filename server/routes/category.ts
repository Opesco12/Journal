import express from "express";
import {
  assignPostToCategoryController,
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  updateCategoryController,
} from "../controllers/category";

const router = express.Router();

router.get("/", getCategoriesController);
router.post("/create", createCategoryController);
router.patch("/update/:categoryId", updateCategoryController);
router.delete("/delete/:categoryId", deleteCategoryController);
router.post("/assign", assignPostToCategoryController);

export default router;
