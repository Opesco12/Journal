import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  bookmarkPost,
  createPost,
  deletePost,
  getBookmarkedPosts,
  getCategories,
  getDraftPosts,
  getPost,
  getPosts,
  getPostsByCategory,
  getUserPosts,
  likePost,
  publishPost,
  removeBookmark,
  searchDraftPosts,
  searchPosts,
  unlikePost,
  unpublishPost,
  updatePost,
  type CategoryListParams,
  type CreatePostInput,
  type ListParams,
  type SearchParams,
  type UpdatePostInput,
} from "./api";

const toastError = (error: Error) => {
  toast.error(error.message);
};

const invalidatePosts = (queryClient: ReturnType<typeof useQueryClient>) => {
  void queryClient.invalidateQueries({ queryKey: ["posts"] });
  void queryClient.invalidateQueries({ queryKey: ["categories"] });
};

export const usePosts = (params?: ListParams) =>
  useQuery({
    queryKey: ["posts", "published", params],
    queryFn: () => getPosts(params),
  });

export const useDraftPosts = (params?: ListParams) =>
  useQuery({
    queryKey: ["posts", "drafts", params],
    queryFn: () => getDraftPosts(params),
  });

export const usePostSearch = (params: SearchParams, enabled = true) =>
  useQuery({
    queryKey: ["posts", "search", params],
    queryFn: () => searchPosts(params),
    enabled: enabled && params.title.trim().length > 0,
  });

export const useDraftPostSearch = (params: SearchParams, enabled = true) =>
  useQuery({
    queryKey: ["posts", "drafts", "search", params],
    queryFn: () => searchDraftPosts(params),
    enabled: enabled && params.title.trim().length > 0,
  });

export const useCategoryPosts = (categoryId: string | undefined, params?: ListParams) =>
  useQuery({
    queryKey: ["posts", "category", categoryId, params],
    queryFn: () => getPostsByCategory(categoryId as string, params),
    enabled: Boolean(categoryId),
  });

export const useUserPosts = (userId: string | undefined, params?: ListParams) =>
  useQuery({
    queryKey: ["posts", "user", userId, params],
    queryFn: () => getUserPosts(userId as string, params),
    enabled: Boolean(userId),
  });

export const useBookmarkedPosts = (params?: ListParams) =>
  useQuery({
    queryKey: ["posts", "bookmarks", params],
    queryFn: () => getBookmarkedPosts(params),
  });

export const usePost = (postId: string | undefined) =>
  useQuery({
    queryKey: ["posts", "detail", postId],
    queryFn: () => getPost(postId as string),
    enabled: Boolean(postId),
  });

export const useCategories = (params?: CategoryListParams) =>
  useQuery({
    queryKey: ["categories", params],
    queryFn: () => getCategories(params),
  });

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePostInput) => createPost(payload),
    onError: toastError,
    onSuccess: (response) => {
      toast.success(response.message ?? "Post added to drafts");
      invalidatePosts(queryClient);
    },
  });
};

export const useUpdatePost = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePostInput) => updatePost(postId, payload),
    onError: toastError,
    onSuccess: () => {
      toast.success("Post updated");
      invalidatePosts(queryClient);
      void queryClient.invalidateQueries({ queryKey: ["posts", "detail", postId] });
    },
  });
};

export const usePublishPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => publishPost(postId),
    onError: toastError,
    onSuccess: (response) => {
      toast.success(response.message ?? "Post published");
      invalidatePosts(queryClient);
    },
  });
};

export const useUnpublishPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => unpublishPost(postId),
    onError: toastError,
    onSuccess: (response) => {
      toast.success(response.message ?? "Post saved to drafts");
      invalidatePosts(queryClient);
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onError: toastError,
    onSuccess: (response) => {
      toast.success(response.message ?? "Post deleted");
      invalidatePosts(queryClient);
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => likePost(postId),
    onError: toastError,
    onSuccess: (response) => {
      toast.success(response.message ?? "Post liked");
      invalidatePosts(queryClient);
    },
  });
};

export const useUnlikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => unlikePost(postId),
    onError: toastError,
    onSuccess: (response) => {
      toast.success(response.message ?? "Post unliked");
      invalidatePosts(queryClient);
    },
  });
};

export const useBookmarkPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => bookmarkPost(postId),
    onError: toastError,
    onSuccess: () => {
      toast.success("Post bookmarked");
      invalidatePosts(queryClient);
    },
  });
};

export const useRemoveBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => removeBookmark(postId),
    onError: toastError,
    onSuccess: () => {
      toast.success("Bookmark removed");
      invalidatePosts(queryClient);
    },
  });
};
