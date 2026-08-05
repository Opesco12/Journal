import { prisma } from "../prisma";
import { byteship } from "../lib/byteship";

export const getPosts = () =>
  prisma.post.findMany({
    where: {
      published: true,
    },
  });

export const uploadImage = ({ file, path }: { path: string; file: any }) =>
  byteship.upload(file, {
    path,
    visibility: "public",
  });

export const createNewPost = ({
  title,
  body,
  images,
}: {
  title: string;
  body: string;
  images: string[];
}) =>
  prisma.post.create({
    data: {
      title,
      body,
      images,
    },
  });

export const getDraftPosts = () =>
  prisma.post.findMany({
    where: {
      published: false,
    },
  });

export const publishDraftPost = (postId: string) =>
  prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      published: true,
    },
  });

export const unPublishPost = (postId: string) =>
  prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      published: false,
    },
  });

export const updatePost = ({
  postId,
  title,
  body,
  images,
}: {
  postId: string;
  title?: string;
  body?: string;
  images?: string[];
}) =>
  prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      ...(title !== undefined && { title }),
      ...(body !== undefined && { body }),
      ...(images !== undefined && { images }),
    },
  });

export const deletePost = (postId: string) =>
  prisma.post.delete({
    where: {
      id: postId,
    },
  });

export const getSinglePost = (postId: string) =>
  prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });
