import type { Request, Response } from "express";
import { prisma } from "../prisma";
import {
  createNewPost,
  getDraftPosts,
  getPosts,
  publishDraftPost,
  unpublishPost,
  uploadImage,
} from "../services/post";

export const getAllPublishedPostsController = async (
  req: Request,
  res: Response,
) => {
  const posts = await getPosts();

  res.json({
    success: true,
    posts,
  });
};

export const createPostController = async (req: Request, res: Response) => {
  const { title, body, images: bodyImages } = req.body;
  const files = (req.files as Express.Multer.File[]) || [];

  const existingImageUrls: string[] = !bodyImages
    ? []
    : Array.isArray(bodyImages)
      ? bodyImages
      : [bodyImages];

  const uploadedImages = await Promise.all(
    files?.map((file) =>
      uploadImage({ file, path: `posts/${Date.now()}-${file.originalname}` }),
    ),
  );

  const uploadedUrls = uploadedImages?.map((img) => img.url);
  const images = [...existingImageUrls, ...uploadedUrls];

  const post = await createNewPost({
    title,
    body,
    images: images as string[],
  });

  console.log("new post created: ", post);

  res.json({
    success: true,
    message: "Post added to your drafts",
  });
};

export const draftPostsController = async (req: Request, res: Response) => {
  const posts = await getDraftPosts();

  res.json({
    success: true,
    posts,
  });
};

export const publishPostController = async (req: Request, res: Response) => {
  const { postId } = req.body;

  const post = await publishDraftPost(postId);

  console.log("published post: ", post);

  res.json({
    success: true,
    message: "Post published successfully",
  });
};

export const unpublishPostController = async (req: Request, res: Response) => {
  const { postId } = req.body;
  const post = await unpublishPost(postId);

  res.json({
    success: true,
    message: "Post saved to drafts",
  });
};
