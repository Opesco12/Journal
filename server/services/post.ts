import { prisma } from "../prisma";
import { byteship } from "../lib/byteship";

export const getPosts = () =>
  prisma.post
    .findMany({
      where: {
        published: true,
      },
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    })
    .then((posts) =>
      posts.map(({ _count, ...post }) => ({
        ...post,
        likesCount: _count.likes,
      })),
    );

export const getPostsByCategory = (categoryId: string) =>
  prisma.post
    .findMany({
      where: {
        published: true,
        postCategories: {
          some: {
            categoryId,
          },
        },
      },
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    })
    .then((posts) =>
      posts.map(({ _count, ...post }) => ({
        ...post,
        likesCount: _count.likes,
      })),
    );

export const getSinglePost = (postId: string) =>
  prisma.post
    .findUniqueOrThrow({
      where: {
        id: postId,
      },
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    })
    .then(({ _count, ...post }) => ({
      ...post,
      likesCount: _count.likes,
    }));

export const uploadImage = ({ file, path }: { path: string; file: any }) =>
  byteship.upload(file, {
    path,
    visibility: "public",
  });

export const createNewPost = ({
  title,
  body,
  images,
  userId,
}: {
  title: string;
  body: string;
  images: string[];
  userId: string;
}) =>
  prisma.post.create({
    data: {
      title,
      body,
      images,
      userId,
    },
  });

export const getDraftPosts = (userId: string) =>
  prisma.post.findMany({
    where: {
      userId,
      published: false,
    },
  });

export const getUserPosts = (userId: string) =>
  prisma.post.findMany({
    where: {
      userId,
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
