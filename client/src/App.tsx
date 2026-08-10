import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { PageSkeleton } from "./components/common/PageSkeleton";
import { AppShell } from "./components/layout/AppShell";

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const PublishedPostsPage = lazy(() => import("./pages/posts/PublishedPostsPage"));
const SearchPostsPage = lazy(() => import("./pages/posts/SearchPostsPage"));
const DraftPostsPage = lazy(() => import("./pages/posts/DraftPostsPage"));
const DraftSearchPage = lazy(() => import("./pages/posts/DraftSearchPage"));
const BookmarkedPostsPage = lazy(() => import("./pages/posts/BookmarkedPostsPage"));
const CategoryPostsPage = lazy(() => import("./pages/posts/CategoryPostsPage"));
const UserPostsPage = lazy(() => import("./pages/posts/UserPostsPage"));
const CategoriesPage = lazy(() => import("./pages/posts/CategoriesPage"));
const CreatePostPage = lazy(() => import("./pages/posts/CreatePostPage"));
const EditPostPage = lazy(() => import("./pages/posts/EditPostPage"));
const PostDetailPage = lazy(() => import("./pages/posts/PostDetailPage"));

const App = () => (
  <Suspense fallback={<PageSkeleton />}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<AppShell />}>
        <Route path="/posts" element={<PublishedPostsPage />} />
        <Route path="/posts/search" element={<SearchPostsPage />} />
        <Route path="/posts/drafts" element={<DraftPostsPage />} />
        <Route path="/posts/drafts/search" element={<DraftSearchPage />} />
        <Route path="/posts/bookmarks" element={<BookmarkedPostsPage />} />
        <Route path="/posts/category/:categoryId" element={<CategoryPostsPage />} />
        <Route path="/posts/user/:userId" element={<UserPostsPage />} />
        <Route path="/posts/new" element={<CreatePostPage />} />
        <Route path="/posts/:postId/edit" element={<EditPostPage />} />
        <Route path="/posts/:postId" element={<PostDetailPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
      </Route>
      <Route path="*" element={<HomePage />} />
    </Routes>
  </Suspense>
);

export default App;
