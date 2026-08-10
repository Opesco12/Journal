import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { PageSkeleton } from "./components/common/PageSkeleton";

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));

const App = () => (
  <Suspense fallback={<PageSkeleton />}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  </Suspense>
);

export default App;
