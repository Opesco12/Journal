type HttpMethod = "get" | "post" | "patch" | "delete";

type OpenApiSchema = Record<string, unknown>;

type RouteDoc = {
  method: HttpMethod;
  path: string;
  tags: string[];
  summary: string;
  description?: string;
  security?: Array<Record<string, string[]>>;
  parameters?: OpenApiSchema[];
  requestBody?: OpenApiSchema;
  responses?: Record<string, OpenApiSchema>;
};

const authSecurity = [{ cookieAuth: [] }, { bearerAuth: [] }];

const jsonContent = (schema: OpenApiSchema) => ({
  content: {
    "application/json": {
      schema,
    },
  },
});

const multipartContent = (schema: OpenApiSchema) => ({
  content: {
    "multipart/form-data": {
      schema,
    },
  },
});

const successResponse = (description = "Successful response") => ({
  description,
  ...jsonContent({
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
    },
  }),
});

const errorResponses = {
  "400": {
    description: "Invalid input",
  },
  "401": {
    description: "Unauthenticated",
  },
  "403": {
    description: "Forbidden",
  },
  "404": {
    description: "Not found",
  },
};

const cuidParam = (name: string, description: string) => ({
  name,
  in: "path",
  required: true,
  description,
  schema: {
    type: "string",
    example: "clx123abc456def789ghi012",
  },
});

const searchQueryParam = (name: string, description: string) => ({
  name,
  in: "query",
  required: true,
  description,
  schema: {
    type: "string",
    minLength: 1,
    maxLength: 100,
  },
});

const sortQueryParams = ({
  sortByValues,
  defaultSortBy,
  defaultSortOrder,
}: {
  sortByValues: string[];
  defaultSortBy: string;
  defaultSortOrder: "asc" | "desc";
}) => [
  {
    name: "sortBy",
    in: "query",
    required: false,
    description: "Field to sort by",
    schema: {
      type: "string",
      enum: sortByValues,
      default: defaultSortBy,
    },
  },
  {
    name: "sortOrder",
    in: "query",
    required: false,
    description: "Sort direction",
    schema: {
      type: "string",
      enum: ["asc", "desc"],
      default: defaultSortOrder,
    },
  },
];

const paginationQueryParams = [
  {
    name: "page",
    in: "query",
    required: false,
    description: "Page number",
    schema: {
      type: "integer",
      minimum: 1,
      default: 1,
    },
  },
  {
    name: "limit",
    in: "query",
    required: false,
    description: "Items per page",
    schema: {
      type: "integer",
      minimum: 1,
      maximum: 100,
      default: 20,
    },
  },
];

const postSortParams = sortQueryParams({
  sortByValues: ["createdAt", "updateAt", "title"],
  defaultSortBy: "createdAt",
  defaultSortOrder: "desc",
});

const userSortParams = sortQueryParams({
  sortByValues: ["name", "firstname", "lastname", "createdAt"],
  defaultSortBy: "name",
  defaultSortOrder: "asc",
});

const categorySortParams = sortQueryParams({
  sortByValues: ["name", "id"],
  defaultSortBy: "name",
  defaultSortOrder: "asc",
});

const routeDocs: RouteDoc[] = [
  {
    method: "post",
    path: "/api/auth/register",
    tags: ["Auth"],
    summary: "Register a user",
    requestBody: {
      required: true,
      ...jsonContent({ $ref: "#/components/schemas/RegisterRequest" }),
    },
    responses: {
      "200": successResponse("User registered successfully"),
      "400": errorResponses["400"],
    },
  },
  {
    method: "post",
    path: "/api/auth/login",
    tags: ["Auth"],
    summary: "Log in a user",
    requestBody: {
      required: true,
      ...jsonContent({ $ref: "#/components/schemas/LoginRequest" }),
    },
    responses: {
      "200": successResponse("User logged in successfully"),
      "400": errorResponses["400"],
    },
  },
  {
    method: "post",
    path: "/api/auth/me",
    tags: ["Auth"],
    summary: "Get the current user",
    security: authSecurity,
    responses: {
      "200": successResponse("Current user returned"),
      "401": errorResponses["401"],
    },
  },
  {
    method: "post",
    path: "/api/auth/logout",
    tags: ["Auth"],
    summary: "Log out the current user",
    security: authSecurity,
    responses: {
      "200": successResponse("User logged out successfully"),
      "401": errorResponses["401"],
    },
  },
  {
    method: "get",
    path: "/api/posts",
    tags: ["Posts"],
    summary: "List published posts",
    security: authSecurity,
    parameters: [...postSortParams, ...paginationQueryParams],
    responses: {
      "200": successResponse("Published posts returned"),
      "401": errorResponses["401"],
    },
  },
  {
    method: "get",
    path: "/api/posts/drafts",
    tags: ["Posts"],
    summary: "List current user's draft posts",
    security: authSecurity,
    parameters: [...postSortParams, ...paginationQueryParams],
    responses: {
      "200": successResponse("Draft posts returned"),
      "401": errorResponses["401"],
    },
  },
  {
    method: "get",
    path: "/api/posts/search",
    tags: ["Posts"],
    summary: "Search published posts by title",
    security: authSecurity,
    parameters: [
      searchQueryParam("title", "Title text to search for"),
      ...postSortParams,
      ...paginationQueryParams,
    ],
    responses: {
      "200": successResponse("Matching posts returned"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
    },
  },
  {
    method: "get",
    path: "/api/posts/drafts/search",
    tags: ["Posts"],
    summary: "Search current user's unpublished posts by title",
    security: authSecurity,
    parameters: [
      searchQueryParam("title", "Title text to search for"),
      ...postSortParams,
      ...paginationQueryParams,
    ],
    responses: {
      "200": successResponse("Matching draft posts returned"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
    },
  },
  {
    method: "get",
    path: "/api/posts/category/:categoryId",
    tags: ["Posts"],
    summary: "List published posts by category",
    security: authSecurity,
    parameters: [
      cuidParam("categoryId", "Category ID"),
      ...postSortParams,
      ...paginationQueryParams,
    ],
    responses: {
      "200": successResponse("Category posts returned"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
    },
  },
  {
    method: "get",
    path: "/api/posts/user/:userId",
    tags: ["Posts"],
    summary: "List posts by user",
    security: authSecurity,
    parameters: [
      {
        name: "userId",
        in: "path",
        required: true,
        description: "User ID",
        schema: { type: "string" },
      },
      ...postSortParams,
      ...paginationQueryParams,
    ],
    responses: {
      "200": successResponse("User posts returned"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
    },
  },
  {
    method: "get",
    path: "/api/posts/bookmarks",
    tags: ["Bookmarks"],
    summary: "List current user's bookmarked posts",
    security: authSecurity,
    parameters: [...postSortParams, ...paginationQueryParams],
    responses: {
      "200": successResponse("Bookmarked posts returned"),
      "401": errorResponses["401"],
    },
  },
  {
    method: "get",
    path: "/api/posts/:postId",
    tags: ["Posts"],
    summary: "Get a single post",
    security: authSecurity,
    parameters: [cuidParam("postId", "Post ID")],
    responses: {
      "200": successResponse("Post returned"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
      "404": errorResponses["404"],
    },
  },
  {
    method: "post",
    path: "/api/posts/create",
    tags: ["Posts"],
    summary: "Create a draft post",
    security: authSecurity,
    requestBody: {
      required: true,
      ...multipartContent({ $ref: "#/components/schemas/PostFormRequest" }),
    },
    responses: {
      "200": successResponse("Post added to drafts"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
    },
  },
  {
    method: "patch",
    path: "/api/posts/update/:postId",
    tags: ["Posts"],
    summary: "Update a post",
    security: authSecurity,
    parameters: [cuidParam("postId", "Post ID")],
    requestBody: {
      required: true,
      ...multipartContent({ $ref: "#/components/schemas/PostUpdateFormRequest" }),
    },
    responses: {
      "200": successResponse("Post updated"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
      "404": errorResponses["404"],
    },
  },
  {
    method: "patch",
    path: "/api/posts/publish/:postId",
    tags: ["Posts"],
    summary: "Publish a draft post",
    security: authSecurity,
    parameters: [cuidParam("postId", "Post ID")],
    responses: {
      "200": successResponse("Post published successfully"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
      "404": errorResponses["404"],
    },
  },
  {
    method: "patch",
    path: "/api/posts/unPublish/:postId",
    tags: ["Posts"],
    summary: "Unpublish a post",
    security: authSecurity,
    parameters: [cuidParam("postId", "Post ID")],
    responses: {
      "200": successResponse("Post saved to drafts"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
      "404": errorResponses["404"],
    },
  },
  {
    method: "delete",
    path: "/api/posts/delete/:postId",
    tags: ["Posts"],
    summary: "Delete a post",
    security: authSecurity,
    parameters: [cuidParam("postId", "Post ID")],
    responses: {
      "200": successResponse("Post deleted"),
      "401": errorResponses["401"],
      "404": errorResponses["404"],
    },
  },
  {
    method: "post",
    path: "/api/posts/like/:postId",
    tags: ["Likes"],
    summary: "Like a post",
    security: authSecurity,
    parameters: [cuidParam("postId", "Post ID")],
    responses: {
      "200": successResponse("Post liked"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
    },
  },
  {
    method: "delete",
    path: "/api/posts/unlike/:postId",
    tags: ["Likes"],
    summary: "Unlike a post",
    security: authSecurity,
    parameters: [cuidParam("postId", "Post ID")],
    responses: {
      "200": successResponse("Post unliked"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
    },
  },
  {
    method: "post",
    path: "/api/posts/bookmark/:postId",
    tags: ["Bookmarks"],
    summary: "Bookmark a post",
    security: authSecurity,
    parameters: [cuidParam("postId", "Post ID")],
    responses: {
      "200": successResponse("Post bookmarked"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
    },
  },
  {
    method: "delete",
    path: "/api/posts/unBookmark/:postId",
    tags: ["Bookmarks"],
    summary: "Remove a post bookmark",
    security: authSecurity,
    parameters: [cuidParam("postId", "Post ID")],
    responses: {
      "200": successResponse("Bookmark removed"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
    },
  },
  {
    method: "get",
    path: "/api/category",
    tags: ["Categories"],
    summary: "List categories",
    parameters: [...categorySortParams, ...paginationQueryParams],
    responses: {
      "200": successResponse("Categories returned"),
    },
  },
  {
    method: "get",
    path: "/api/admin/stats",
    tags: ["Admin"],
    summary: "Get admin dashboard stats",
    security: authSecurity,
    responses: {
      "200": successResponse("Admin stats returned"),
      "401": errorResponses["401"],
      "403": errorResponses["403"],
    },
  },
  {
    method: "get",
    path: "/api/admin/users",
    tags: ["Admin"],
    summary: "List users",
    security: authSecurity,
    parameters: [
      {
        name: "search",
        in: "query",
        required: false,
        description: "Search by name or email",
        schema: { type: "string", maxLength: 100 },
      },
      ...sortQueryParams({
        sortByValues: ["name", "firstname", "lastname", "email", "createdAt"],
        defaultSortBy: "createdAt",
        defaultSortOrder: "desc",
      }),
      ...paginationQueryParams,
    ],
    responses: {
      "200": successResponse("Users returned"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
      "403": errorResponses["403"],
    },
  },
  {
    method: "patch",
    path: "/api/admin/users/:userId/role",
    tags: ["Admin"],
    summary: "Update a user's role",
    security: authSecurity,
    parameters: [
      {
        name: "userId",
        in: "path",
        required: true,
        description: "User ID",
        schema: { type: "string" },
      },
    ],
    requestBody: {
      required: true,
      ...jsonContent({ $ref: "#/components/schemas/AdminUserRoleRequest" }),
    },
    responses: {
      "200": successResponse("User role updated successfully"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
      "403": errorResponses["403"],
      "404": errorResponses["404"],
    },
  },
  {
    method: "get",
    path: "/api/admin/posts",
    tags: ["Admin"],
    summary: "List all posts",
    security: authSecurity,
    parameters: [
      {
        name: "search",
        in: "query",
        required: false,
        description: "Search by title",
        schema: { type: "string", maxLength: 100 },
      },
      {
        name: "published",
        in: "query",
        required: false,
        description: "Filter by publication status",
        schema: { type: "boolean" },
      },
      ...postSortParams,
      ...paginationQueryParams,
    ],
    responses: {
      "200": successResponse("Posts returned"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
      "403": errorResponses["403"],
    },
  },
  {
    method: "patch",
    path: "/api/admin/posts/:postId/publish",
    tags: ["Admin"],
    summary: "Publish a post",
    security: authSecurity,
    parameters: [cuidParam("postId", "Post ID")],
    responses: {
      "200": successResponse("Post published successfully"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
      "403": errorResponses["403"],
      "404": errorResponses["404"],
    },
  },
  {
    method: "patch",
    path: "/api/admin/posts/:postId/unpublish",
    tags: ["Admin"],
    summary: "Unpublish a post",
    security: authSecurity,
    parameters: [cuidParam("postId", "Post ID")],
    responses: {
      "200": successResponse("Post unpublished successfully"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
      "403": errorResponses["403"],
      "404": errorResponses["404"],
    },
  },
  {
    method: "delete",
    path: "/api/admin/posts/:postId",
    tags: ["Admin"],
    summary: "Delete a post",
    security: authSecurity,
    parameters: [cuidParam("postId", "Post ID")],
    responses: {
      "200": successResponse("Post deleted successfully"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
      "403": errorResponses["403"],
      "404": errorResponses["404"],
    },
  },
  {
    method: "delete",
    path: "/api/admin/comments/:commentId",
    tags: ["Admin"],
    summary: "Delete a comment",
    security: authSecurity,
    parameters: [cuidParam("commentId", "Comment ID")],
    responses: {
      "200": successResponse("Comment deleted successfully"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
      "403": errorResponses["403"],
      "404": errorResponses["404"],
    },
  },
  {
    method: "get",
    path: "/api/admin/category",
    tags: ["Admin"],
    summary: "List categories",
    description: "Admin-only category management route.",
    security: authSecurity,
    parameters: [...categorySortParams, ...paginationQueryParams],
    responses: {
      "200": successResponse("Categories returned"),
      "401": errorResponses["401"],
      "403": errorResponses["403"],
    },
  },
  {
    method: "post",
    path: "/api/admin/category/create",
    tags: ["Admin"],
    summary: "Create a category",
    description: "Admin-only category management route.",
    security: authSecurity,
    requestBody: {
      required: true,
      ...jsonContent({ $ref: "#/components/schemas/CategoryRequest" }),
    },
    responses: {
      "200": successResponse("Category created successfully"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
      "403": errorResponses["403"],
    },
  },
  {
    method: "patch",
    path: "/api/admin/category/update/:categoryId",
    tags: ["Admin"],
    summary: "Update a category",
    description: "Admin-only category management route.",
    security: authSecurity,
    parameters: [cuidParam("categoryId", "Category ID")],
    requestBody: {
      required: true,
      ...jsonContent({ $ref: "#/components/schemas/CategoryRequest" }),
    },
    responses: {
      "200": successResponse("Category updated successfully"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
      "403": errorResponses["403"],
      "404": errorResponses["404"],
    },
  },
  {
    method: "delete",
    path: "/api/admin/category/delete/:categoryId",
    tags: ["Admin"],
    summary: "Delete a category",
    description: "Admin-only category management route.",
    security: authSecurity,
    parameters: [cuidParam("categoryId", "Category ID")],
    responses: {
      "200": successResponse("Category deleted successfully"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
      "403": errorResponses["403"],
      "404": errorResponses["404"],
    },
  },
  {
    method: "post",
    path: "/api/admin/category/assign",
    tags: ["Admin"],
    summary: "Assign a post to a category",
    description: "Admin-only category management route.",
    security: authSecurity,
    requestBody: {
      required: true,
      ...jsonContent({ $ref: "#/components/schemas/AssignPostCategoryRequest" }),
    },
    responses: {
      "200": successResponse("Post assigned to category successfully"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
      "403": errorResponses["403"],
    },
  },
  {
    method: "get",
    path: "/api/users/search",
    tags: ["Users"],
    summary: "Search users by name",
    security: authSecurity,
    parameters: [
      searchQueryParam("name", "Name text to search for"),
      ...userSortParams,
      ...paginationQueryParams,
    ],
    responses: {
      "200": successResponse("Matching users returned"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
    },
  },
  {
    method: "post",
    path: "/api/users/profile-image",
    tags: ["Users"],
    summary: "Upload the current user's profile image",
    security: authSecurity,
    requestBody: {
      required: true,
      ...multipartContent({ $ref: "#/components/schemas/ProfileImageRequest" }),
    },
    responses: {
      "200": successResponse("Profile image uploaded successfully"),
      "400": errorResponses["400"],
      "401": errorResponses["401"],
    },
  },
];

const toOpenApiPath = (path: string) =>
  path.replace(/:([A-Za-z0-9_]+)/g, "{$1}");

const buildPaths = (routes: RouteDoc[]) =>
  routes.reduce<Record<string, Record<string, OpenApiSchema>>>((paths, route) => {
    const path = toOpenApiPath(route.path);
    paths[path] ??= {};
    paths[path][route.method] = {
      tags: route.tags,
      summary: route.summary,
      ...(route.description && { description: route.description }),
      ...(route.security && { security: route.security }),
      ...(route.parameters && { parameters: route.parameters }),
      ...(route.requestBody && { requestBody: route.requestBody }),
      responses: route.responses ?? {
        "200": successResponse(),
      },
    };

    return paths;
  }, {});

export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Blog Server API",
    version: "1.0.0",
    description: "Automatically generated OpenAPI documentation for the blog server.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Auth" },
    { name: "Admin" },
    { name: "Posts" },
    { name: "Categories" },
    { name: "Users" },
    { name: "Likes" },
    { name: "Bookmarks" },
  ],
  paths: buildPaths(routeDocs),
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "better-auth.session_token",
      },
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      RegisterRequest: {
        type: "object",
        required: ["firstname", "lastname", "email", "password"],
        properties: {
          firstname: { type: "string", example: "Ada" },
          lastname: { type: "string", example: "Lovelace" },
          email: { type: "string", format: "email", example: "ada@example.com" },
          password: { type: "string", minLength: 8, example: "password123" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "ada@example.com" },
          password: { type: "string", example: "password123" },
        },
      },
      PostFormRequest: {
        type: "object",
        required: ["title", "body"],
        properties: {
          title: { type: "string", maxLength: 200 },
          body: { type: "string", maxLength: 4000 },
          images: {
            type: "array",
            items: {
              oneOf: [
                { type: "string", format: "binary" },
                { type: "string", format: "uri" },
              ],
            },
          },
        },
      },
      PostUpdateFormRequest: {
        type: "object",
        properties: {
          title: { type: "string", maxLength: 200 },
          body: { type: "string", maxLength: 4000 },
          images: {
            type: "array",
            items: {
              oneOf: [
                { type: "string", format: "binary" },
                { type: "string", format: "uri" },
              ],
            },
          },
        },
      },
      CategoryRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 1, maxLength: 100 },
        },
      },
      AssignPostCategoryRequest: {
        type: "object",
        required: ["postId", "categoryId"],
        properties: {
          postId: { type: "string", example: "clx123abc456def789ghi012" },
          categoryId: { type: "string", example: "clx123abc456def789ghi012" },
        },
      },
      AdminUserRoleRequest: {
        type: "object",
        required: ["role"],
        properties: {
          role: {
            type: "string",
            enum: ["user", "admin"],
          },
        },
      },
      ProfileImageRequest: {
        type: "object",
        required: ["image"],
        properties: {
          image: {
            type: "string",
            format: "binary",
            description: "JPEG, PNG, WebP, or GIF image up to 5MB",
          },
        },
      },
    },
  },
};

export const swaggerHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Blog Server API Docs</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      body {
        margin: 0;
        background: #f7f7f7;
      }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: "/api/docs.json",
          dom_id: "#swagger-ui",
          deepLinking: true,
          presets: [SwaggerUIBundle.presets.apis],
          layout: "BaseLayout"
        });
      };
    </script>
  </body>
</html>`;
