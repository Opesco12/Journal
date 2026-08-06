import { prisma } from "../prisma";

export const getCategories = () => prisma.category.findMany();

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
