import { prisma } from "../prisma";
import {
  buildPagination,
  getPaginationArgs,
  type PaginationInput,
} from "../utils/pagination";

type SortOrder = "asc" | "desc";
type CategorySortBy = "name" | "id";

export const getCategories = ({
  sortBy,
  sortOrder,
  page,
  limit,
}: {
  sortBy: CategorySortBy;
  sortOrder: SortOrder;
} & PaginationInput) =>
  Promise.all([
    prisma.category.findMany({
      orderBy: {
        [sortBy]: sortOrder,
      },
      ...getPaginationArgs({ page, limit }),
    }),
    prisma.category.count(),
  ]).then(([categories, total]) => ({
    categories,
    pagination: buildPagination({ page, limit, total }),
  }));

export const createCategory = (category: string) =>
  prisma.category.create({
    data: {
      name: category,
    },
  });

export const updateCategory = ({
  id,
  category,
}: {
  id: string;
  category: string;
}) =>
  prisma.category.update({
    where: {
      id: id,
    },
    data: {
      name: category,
    },
  });

export const deleteCategory = (id: string) =>
  prisma.category.delete({
    where: {
      id: id,
    },
  });

export const assignPostToCategory = ({
  postId,
  categoryId,
}: {
  postId: string;
  categoryId: string;
}) =>
  prisma.postCategory.upsert({
    where: {
      postId_categoryId: {
        postId,
        categoryId,
      },
    },
    update: {},
    create: {
      postId,
      categoryId,
    },
  });
