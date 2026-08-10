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
