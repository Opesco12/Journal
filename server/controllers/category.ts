import type { Request, Response } from "express";
import {
  assignPostToCategory,
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../services/category";

export const getCategoriesController = async (req: Request, res: Response) => {
  const { sortBy, sortOrder, page, limit } = req.query;
  const { categories, pagination } = await getCategories({
    sortBy: sortBy as "name" | "id",
    sortOrder: sortOrder as "asc" | "desc",
    page: page as number,
    limit: limit as number,
  });

  res.json({
    success: true,
    categories,
    pagination,
  });
};

export const createCategoryController = async (req: Request, res: Response) => {
  const { name } = req.body;

  const createdCategory = await createCategory(name);

  res.json({
    success: true,
    message: "Category created successfully",
    category: createdCategory,
  });
};

export const updateCategoryController = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  const updatedCategory = await updateCategory({
    id: categoryId as string,
    category: name,
  });

  res.json({
    success: true,
    message: "Category updated successfully",
    category: updatedCategory,
  });
};

export const deleteCategoryController = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  await deleteCategory(categoryId as string);

  res.json({
    success: true,
    message: "Category deleted successfully",
  });
};

export const assignPostToCategoryController = async (
  req: Request,
  res: Response,
) => {
  const { postId, categoryId } = req.body;

  const postCategory = await assignPostToCategory({
    postId,
    categoryId,
  });

  res.json({
    success: true,
    message: "Post assigned to category successfully",
    postCategory,
  });
};
