import type { Request, Response } from "express";
import { getAuthenticatedUserId } from "../middleware/auth";
import {
  createNewPost,
  deletePost,
  getDraftPosts,
  getPostsByCategory,
  getPosts,
  getSinglePost,
  getUserPosts,
  publishDraftPost,
  unPublishPost,
  updatePost,
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

export const getPostsByCategoryController = async (
  req: Request,
  res: Response,
) => {
  const { categoryId } = req.params;
  const posts = await getPostsByCategory(categoryId as string);

  res.json({
    success: true,
    posts,
  });
};

export const createPostController = async (req: Request, res: Response) => {
  const { title, body, images: bodyImages } = req.body;
  const userId = getAuthenticatedUserId(req);
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
    userId,
  });

  console.log("new post created: ", post);

  res.json({
    success: true,
    message: "Post added to your drafts",
  });
};

export const draftPostsController = async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);

  const posts = await getDraftPosts(userId);
  console.log("drafts running: ", posts);
  res.json({
    success: true,
    posts,
  });
};

export const getUserPostsController = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const posts = await getUserPosts(userId as string);
  res.json({
    success: true,
    posts,
  });
};

export const publishPostController = async (req: Request, res: Response) => {
  const { postId } = req.params;

  const post = await publishDraftPost(postId as string);

  console.log("published post: ", post);

  res.json({
    success: true,
    message: "Post published successfully",
  });
};

export const unpublishPostController = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const post = await unPublishPost(postId as string);

  res.json({
    success: true,
    message: "Post saved to drafts",
  });
};

export const updatePostController = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { title, body, images: bodyImages } = req.body;
  const files = (req.files as Express.Multer.File[]) || [];

  const existingImageUrls: string[] = !bodyImages
    ? []
    : Array.isArray(bodyImages)
      ? bodyImages
      : [bodyImages];

  const uploadedImages = await Promise.all(
    files.map((file) =>
      uploadImage({ file, path: `posts/${Date.now()}-${file.originalname}` }),
    ),
  );

  const uploadedUrls = uploadedImages
    .map((img) => img.url)
    .filter((url): url is string => typeof url === "string");
  const images = [...existingImageUrls, ...uploadedUrls];

  const post = await updatePost({
    postId: postId as string,
    body,
    title,
    ...(images.length > 0 && { images }),
  });

  res.json({
    success: true,
    post,
  });
};

export const deletePostController = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const deleted = await deletePost(postId as string);
  res.json({
    success: true,
    message: "Post deleted",
  });
};

export const getSinglePostController = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const post = await getSinglePost(postId as string);
  console.log("this is running");
  res.json({
    success: true,
    post,
  });
};
