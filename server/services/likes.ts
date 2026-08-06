import { prisma } from "../prisma";

export const likePost = ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) =>
  prisma.like.create({
    data: {
      postId,
      userId,
    },
  });

export const unlikePost = ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) =>
  prisma.like.delete({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });
