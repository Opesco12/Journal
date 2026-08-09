# Journal

Journal is a blogging project with an Express and Prisma backend, plus a React/Vite frontend that is still early in development.

The API currently supports authentication, posts and drafts, categories, likes, bookmarks, profile image uploads, and admin routes for moderation and basic management. The frontend has not been built out yet, so most of the useful work lives in the server for now.

## Project Structure

- `server/` - Express API, Better Auth setup, Prisma schema, routes, controllers, services, and Swagger docs.
- `client/` - React/Vite app scaffold for the future Journal interface.

API docs are available from the server at `/api/docs` when the backend is running.
