import { prisma } from "../prisma";

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

export const getUserBookmarks = (userId: string) =>
  prisma.bookmark.findMany({
    where: {
      userId: userId,
    },
    include: {
      post: true,
    },
  });
