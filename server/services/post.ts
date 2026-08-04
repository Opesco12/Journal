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
