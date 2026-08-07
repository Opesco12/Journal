import { prisma } from "../prisma";

export const searchUsersByName = (name: string) =>
  prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
        {
          firstname: {
            contains: name,
            mode: "insensitive",
          },
        },
        {
          lastname: {
            contains: name,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      name: "asc",
    },
    take: 20,
    select: {
      id: true,
      name: true,
      firstname: true,
      lastname: true,
      image: true,
    },
  });
