const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://journal-6ui2.onrender.com";

type ApiErrorBody = {
  message?: string;
  error?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
};

export type SortOrder = "asc" | "desc";
export type PostSortBy = "createdAt" | "updateAt" | "title";
export type CategorySortBy = "name" | "id";

export type ListParams = {
  page?: number;
  limit?: number;
  sortBy?: PostSortBy;
  sortOrder?: SortOrder;
};

export type SearchParams = ListParams & {
  title: string;
};

export type CategoryListParams = {
  page?: number;
  limit?: number;
  sortBy?: CategorySortBy;
  sortOrder?: SortOrder;
};

export type Post = {
  id: string;
  title: string;
  body: string;
  images: string[];
  createdAt: string;
  updateAt?: string;
  published?: boolean;
  userId: string;
  likesCount?: number;
};

export type Category = {
  id: string;
  name: string;
};

export type PostListResponse = {
  success: boolean;
  posts: Post[];
  pagination: Pagination;
};

type BookmarkRow = {
  id: string;
  postId: string;
  userId: string;
  post: Post;
};

type BookmarksResponse = {
  success: boolean;
  posts: BookmarkRow[];
  pagination: Pagination;
};

export type SinglePostResponse = {
  success: boolean;
  post: Post;
};

export type CategoryListResponse = {
  success: boolean;
  categories: Category[];
  pagination: Pagination;
};

export type CreatePostInput = {
  title: string;
  body: string;
  images?: string[];
  published?: boolean;
};

export type UpdatePostInput = Partial<CreatePostInput>;

export type MessageResponse = {
  success: boolean;
  message?: string;
};

export const getAuthToken = () => localStorage.getItem("journal_token");

export const setAuthToken = (token: string) => {
  localStorage.setItem("journal_token", token);
};

export const apiRequest = async <T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> => {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth) {
    const token = getAuthToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = (await response.json().catch(() => ({}))) as ApiErrorBody;

  if (!response.ok) {
    throw new ApiError(
      data.message ?? data.error ?? "Something went wrong. Please try again.",
      response.status,
    );
  }

  return data as T;
};

const buildQueryString = (params?: Record<string, string | number | undefined>) => {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
};

export type RegisterInput = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  token?: string;
  session?: {
    token?: string;
  };
};

const persistReturnedToken = (response: AuthResponse) => {
  const token = response.token ?? response.session?.token;

  if (token) {
    setAuthToken(token);
  }

  return response;
};

export const register = (payload: RegisterInput) =>
  apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then(persistReturnedToken);

export const login = (payload: LoginInput) =>
  apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then(persistReturnedToken);

export const getPosts = (params?: ListParams) =>
  apiRequest<PostListResponse>(`/api/posts${buildQueryString(params)}`, {
    auth: true,
  });

export const getDraftPosts = (params?: ListParams) =>
  apiRequest<PostListResponse>(`/api/posts/drafts${buildQueryString(params)}`, {
    auth: true,
  });

export const searchPosts = (params: SearchParams) =>
  apiRequest<PostListResponse>(`/api/posts/search${buildQueryString(params)}`, {
    auth: true,
  });

export const searchDraftPosts = (params: SearchParams) =>
  apiRequest<PostListResponse>(
    `/api/posts/drafts/search${buildQueryString(params)}`,
    {
      auth: true,
    },
  );

export const getPostsByCategory = (categoryId: string, params?: ListParams) =>
  apiRequest<PostListResponse>(
    `/api/posts/category/${categoryId}${buildQueryString(params)}`,
    {
      auth: true,
    },
  );

export const getUserPosts = (userId: string, params?: ListParams) =>
  apiRequest<PostListResponse>(
    `/api/posts/user/${userId}${buildQueryString(params)}`,
    {
      auth: true,
    },
  );

export const getBookmarkedPosts = async (params?: ListParams) => {
  const response = await apiRequest<BookmarksResponse>(
    `/api/posts/bookmarks${buildQueryString(params)}`,
    {
      auth: true,
    },
  );

  return {
    ...response,
    posts: response.posts.map((bookmark) => bookmark.post),
  } satisfies PostListResponse;
};

export const getPost = (postId: string) =>
  apiRequest<SinglePostResponse>(`/api/posts/${postId}`, {
    auth: true,
  });

export const createPost = (payload: CreatePostInput) =>
  apiRequest<MessageResponse>("/api/posts/create", {
    auth: true,
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updatePost = (postId: string, payload: UpdatePostInput) =>
  apiRequest<SinglePostResponse>(`/api/posts/update/${postId}`, {
    auth: true,
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const publishPost = (postId: string) =>
  apiRequest<MessageResponse>(`/api/posts/publish/${postId}`, {
    auth: true,
    method: "PATCH",
  });

export const unpublishPost = (postId: string) =>
  apiRequest<MessageResponse>(`/api/posts/unPublish/${postId}`, {
    auth: true,
    method: "PATCH",
  });

export const deletePost = (postId: string) =>
  apiRequest<MessageResponse>(`/api/posts/delete/${postId}`, {
    auth: true,
    method: "DELETE",
  });

export const likePost = (postId: string) =>
  apiRequest<MessageResponse>(`/api/posts/like/${postId}`, {
    auth: true,
    method: "POST",
  });

export const unlikePost = (postId: string) =>
  apiRequest<MessageResponse>(`/api/posts/unlike/${postId}`, {
    auth: true,
    method: "DELETE",
  });

export const bookmarkPost = (postId: string) =>
  apiRequest<MessageResponse>(`/api/posts/bookmark/${postId}`, {
    auth: true,
    method: "POST",
  });

export const removeBookmark = (postId: string) =>
  apiRequest<MessageResponse>(`/api/posts/unBookmark/${postId}`, {
    auth: true,
    method: "DELETE",
  });

export const getCategories = (params?: CategoryListParams) =>
  apiRequest<CategoryListResponse>(
    `/api/category${buildQueryString(params)}`,
    {
      auth: true,
    },
  );
