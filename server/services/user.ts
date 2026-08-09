import { prisma } from "../prisma";
import { byteship } from "../lib/byteship";
import {
  buildPagination,
  getPaginationArgs,
  type PaginationInput,
} from "../utils/pagination";

type SortOrder = "asc" | "desc";
type UserSortBy = "name" | "firstname" | "lastname" | "createdAt";

const profileImageExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const searchUsersByName = ({
  name,
  sortBy,
  sortOrder,
  page,
  limit,
}: {
  name: string;
  sortBy: UserSortBy;
  sortOrder: SortOrder;
} & PaginationInput) => {
  const where = {
    OR: [
      {
        name: {
          contains: name,
          mode: "insensitive" as const,
        },
      },
      {
        firstname: {
          contains: name,
          mode: "insensitive" as const,
        },
      },
      {
        lastname: {
          contains: name,
          mode: "insensitive" as const,
        },
      },
    ],
  };

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
        image: true,
      },
    }),
    prisma.user.count({ where }),
  ]).then(([users, total]) => ({
    users,
    pagination: buildPagination({ page, limit, total }),
  }));
};

export const updateUserProfileImage = async ({
  userId,
  file,
}: {
  userId: string;
  file: Express.Multer.File;
}) => {
  const extension = profileImageExtensions[file.mimetype] ?? "jpg";
  const uploadedImage = await byteship.upload(file as any, {
    path: `users/${userId}/profile-${Date.now()}.${extension}`,
    visibility: "public",
  });

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      image: uploadedImage.url,
    },
    select: {
      id: true,
      name: true,
      firstname: true,
      lastname: true,
      email: true,
      image: true,
    },
  });
};
