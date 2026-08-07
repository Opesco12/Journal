import { prisma } from "../prisma";
import { byteship } from "../lib/byteship";
import {
  buildPagination,
  getPaginationArgs,
  type PaginationInput,
} from "../utils/pagination";

type SortOrder = "asc" | "desc";
type PostSortBy = "createdAt" | "updateAt" | "title";
type PostSort = {
  sortBy: PostSortBy;
  sortOrder: SortOrder;
};

const postOrderBy = ({ sortBy, sortOrder }: PostSort) => ({
  [sortBy]: sortOrder,
});

const withLikesCount = <T extends { _count: { likes: number } }>(posts: T[]) =>
  posts.map(({ _count, ...post }) => ({
    ...post,
    likesCount: _count.likes,
  }));

export const getPosts = (options: PostSort & PaginationInput) => {
  const where = {
    published: true,
  };

  return Promise.all([
    prisma.post.findMany({
      where,
      orderBy: postOrderBy(options),
      ...getPaginationArgs(options),
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    }),
    prisma.post.count({ where }),
  ]).then(([posts, total]) => ({
    posts: withLikesCount(posts),
    pagination: buildPagination({ ...options, total }),
  }));
};

export const getPostsByCategory = ({
  categoryId,
  sortBy,
  sortOrder,
  page,
  limit,
}: {
  categoryId: string;
} & PostSort &
  PaginationInput) => {
  const where = {
    published: true,
    postCategories: {
      some: {
        categoryId,
      },
    },
  };

  return Promise.all([
    prisma.post.findMany({
      where,
      orderBy: postOrderBy({ sortBy, sortOrder }),
      ...getPaginationArgs({ page, limit }),
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    }),
    prisma.post.count({ where }),
  ]).then(([posts, total]) => ({
    posts: withLikesCount(posts),
    pagination: buildPagination({ page, limit, total }),
  }));
};

export const searchPostsByTitle = ({
  title,
  sortBy,
  sortOrder,
  page,
  limit,
}: {
  title: string;
} & PostSort &
  PaginationInput) => {
  const where = {
    published: true,
    title: {
      contains: title,
      mode: "insensitive" as const,
    },
  };

  return Promise.all([
    prisma.post.findMany({
      where,
      orderBy: postOrderBy({ sortBy, sortOrder }),
      ...getPaginationArgs({ page, limit }),
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    }),
    prisma.post.count({ where }),
  ]).then(([posts, total]) => ({
    posts: withLikesCount(posts),
    pagination: buildPagination({ page, limit, total }),
  }));
};

export const searchDraftPostsByTitle = ({
  title,
  userId,
  sortBy,
  sortOrder,
  page,
  limit,
}: {
  title: string;
  userId: string;
} & PostSort &
  PaginationInput) => {
  const where = {
    userId,
    published: false,
    title: {
      contains: title,
      mode: "insensitive" as const,
    },
  };

  return Promise.all([
    prisma.post.findMany({
      where,
      orderBy: postOrderBy({ sortBy, sortOrder }),
      ...getPaginationArgs({ page, limit }),
    }),
    prisma.post.count({ where }),
  ]).then(([posts, total]) => ({
    posts,
    pagination: buildPagination({ page, limit, total }),
  }));
};

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

export const getDraftPosts = ({
  userId,
  sortBy,
  sortOrder,
  page,
  limit,
}: {
  userId: string;
} & PostSort &
  PaginationInput) => {
  const where = {
    userId,
    published: false,
  };

  return Promise.all([
    prisma.post.findMany({
      where,
      orderBy: postOrderBy({ sortBy, sortOrder }),
      ...getPaginationArgs({ page, limit }),
    }),
    prisma.post.count({ where }),
  ]).then(([posts, total]) => ({
    posts,
    pagination: buildPagination({ page, limit, total }),
  }));
};

export const getUserPosts = ({
  userId,
  sortBy,
  sortOrder,
  page,
  limit,
}: {
  userId: string;
} & PostSort &
  PaginationInput) => {
  const where = {
    userId,
  };

  return Promise.all([
    prisma.post.findMany({
      where,
      orderBy: postOrderBy({ sortBy, sortOrder }),
      ...getPaginationArgs({ page, limit }),
    }),
    prisma.post.count({ where }),
  ]).then(([posts, total]) => ({
    posts,
    pagination: buildPagination({ page, limit, total }),
  }));
};

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
