import express from "express";
import { getCategoriesController } from "../controllers/category";
import { validate } from "../middleware/validate";
import { categorySortSchema } from "../validators/categories";

const router = express.Router();

router.get("/", validate(categorySortSchema), getCategoriesController);

export default router;
