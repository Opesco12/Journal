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
