import { createElement, lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Courses from "../pages/Courses";
// Loader Component
const Loader = () =>  <div className="flex items-center justify-center p-6">
    <div className="w-10 h-10 border-4 border-primary border-dashed rounded-full animate-spin"></div>
  </div>;
const Loadable = (LazyComponent) => (props) =>
  (
    <Suspense fallback={<Loader />}>
      {createElement(LazyComponent, props)}
    </Suspense>
  );

// Lazy load pages with auto Suspense wrapper
const Home = Loadable(lazy(() => import("../pages/Home")));
const ErrorPage = Loadable(lazy(() => import("../pages/Errorpage")));
const Contact=Loadable(lazy(() => import("../pages/Contact")));
const CourseDetails = Loadable(lazy(() => import("../pages/CourseDetails")));
const SearchCourses = Loadable(lazy(() => import("../pages/SreachCourses")));
const Profile = Loadable(lazy(() => import("../pages/Profile")));
const Checkout = Loadable(lazy(() => import("../pages/Checkout")));
const Enroll = Loadable(lazy(() => import("../pages/Enroll")));
const AdminPanel = Loadable(lazy(() => import("../pages/AdminPanel")));
const routes = createBrowserRouter([
  {
    path: "/",
    element: (
     <MainLayout></MainLayout>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <Navigate to="/#about" replace /> },
      { path: "Courses", element: <Navigate to="/courses" replace /> },
      { path: "courses", element: <Courses/> },
      { path: "courses/:courseId", element: <CourseDetails /> },
      { path: "courses/search", element: <SearchCourses /> },
      { path: "checkout", element: <Checkout /> },
      { path: "enroll", element: <Enroll /> },
      { path: "profile", element: <Profile /> },
      { path: "admin", element: <AdminPanel /> },
      { path: "Contact", element: <Contact /> },
    ],
  },
  { path: "*", element: <ErrorPage /> },
]);

export default function AppRoutes() {
  return <RouterProvider router={routes} />;
}
