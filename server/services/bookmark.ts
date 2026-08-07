import { prisma } from "../prisma";
import {
  buildPagination,
  getPaginationArgs,
  type PaginationInput,
} from "../utils/pagination";

type SortOrder = "asc" | "desc";
type BookmarkSortBy = "createdAt" | "updateAt" | "title";

export const bookmarkPost = (userId: string, postId: string) =>
  prisma.bookmark.create({
    data: {
      userId,
      postId,
    },
  });

export const unbookmarkPost = (userId: string, postId: string) =>
  prisma.bookmark.delete({
    where: {
      userId_postId: {
        postId,
        userId,
      },
    },
  });

export const getUserBookmarks = ({
  userId,
  sortBy,
  sortOrder,
  page,
  limit,
}: {
  userId: string;
  sortBy: BookmarkSortBy;
  sortOrder: SortOrder;
} & PaginationInput) => {
  const where = {
    userId,
  };

  return Promise.all([
    prisma.bookmark.findMany({
      where,
      orderBy: {
        post: {
          [sortBy]: sortOrder,
        },
      },
      ...getPaginationArgs({ page, limit }),
      include: {
        post: true,
      },
    }),
    prisma.bookmark.count({ where }),
  ]).then(([posts, total]) => ({
    posts,
    pagination: buildPagination({ page, limit, total }),
  }));
};
