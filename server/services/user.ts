import { prisma } from "../prisma";
import {
  buildPagination,
  getPaginationArgs,
  type PaginationInput,
} from "../utils/pagination";

type SortOrder = "asc" | "desc";
type UserSortBy = "name" | "firstname" | "lastname" | "createdAt";

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
