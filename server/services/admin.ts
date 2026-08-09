import { prisma } from "../prisma";
import {
  buildPagination,
  getPaginationArgs,
  type PaginationInput,
} from "../utils/pagination";

type SortOrder = "asc" | "desc";
type UserSortBy = "name" | "firstname" | "lastname" | "email" | "createdAt";
type PostSortBy = "createdAt" | "updateAt" | "title";

export const getAdminUsers = ({
  search,
  sortBy,
  sortOrder,
  page,
  limit,
}: {
  search: string | undefined;
  sortBy: UserSortBy;
  sortOrder: SortOrder;
} & PaginationInput) => {
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { firstname: { contains: search, mode: "insensitive" as const } },
          { lastname: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  return Promise.all([
    prisma.user.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      ...getPaginationArgs({ page, limit }),
      select: {
        id: true,
        name: true,
        firstname: true,
        lastname: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
            likes: true,
            bookmarks: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]).then(([users, total]) => ({
    users,
    pagination: buildPagination({ page, limit, total }),
  }));
};

export const updateAdminUserRole = ({
  userId,
  role,
}: {
  userId: string;
  role: "user" | "admin";
}) =>
  prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role,
    },
    select: {
      id: true,
      name: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
    },
  });

export const getAdminPosts = ({
  search,
  published,
  sortBy,
  sortOrder,
  page,
  limit,
}: {
  search: string | undefined;
  published: boolean | undefined;
  sortBy: PostSortBy;
  sortOrder: SortOrder;
} & PaginationInput) => {
  const where = {
    ...(typeof published === "boolean" && { published }),
    ...(search && {
      title: {
        contains: search,
        mode: "insensitive" as const,
      },
    }),
  };

  return Promise.all([
    prisma.post.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      ...getPaginationArgs({ page, limit }),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            firstname: true,
            lastname: true,
            email: true,
            image: true,
          },
        },
        postCategories: {
          include: {
            category: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
            bookmarks: true,
          },
        },
      },
    }),
    prisma.post.count({ where }),
  ]).then(([posts, total]) => ({
    posts,
    pagination: buildPagination({ page, limit, total }),
  }));
};

export const setAdminPostPublished = ({
  postId,
  published,
}: {
  postId: string;
  published: boolean;
}) =>
  prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      published,
    },
  });

export const deleteAdminPost = (postId: string) =>
  prisma.$transaction([
    prisma.bookmark.deleteMany({ where: { postId } }),
    prisma.like.deleteMany({ where: { postId } }),
    prisma.postCategory.deleteMany({ where: { postId } }),
    prisma.comment.deleteMany({ where: { postId } }),
    prisma.post.delete({ where: { id: postId } }),
  ]);

export const deleteAdminComment = (commentId: string) =>
  prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

export const getAdminStats = async () => {
  const [
    usersCount,
    adminsCount,
    postsCount,
    publishedPostsCount,
    draftPostsCount,
    categoriesCount,
    commentsCount,
    likesCount,
    bookmarksCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "admin" } }),
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.post.count({ where: { published: false } }),
    prisma.category.count(),
    prisma.comment.count(),
    prisma.like.count(),
    prisma.bookmark.count(),
  ]);

  return {
    usersCount,
    adminsCount,
    postsCount,
    publishedPostsCount,
    draftPostsCount,
    categoriesCount,
    commentsCount,
    likesCount,
    bookmarksCount,
  };
};
