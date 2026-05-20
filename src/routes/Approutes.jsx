import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "../layout/MainLayout";
// Loader Component
const Loader = () =>  <div className="flex items-center justify-center p-6">
    <div className="w-10 h-10 border-4 border-primary border-dashed rounded-full animate-spin"></div>
  </div>;
const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );

// Lazy load pages with auto Suspense wrapper
const Home = Loadable(lazy(() => import("../pages/Home")));
const About = Loadable(lazy(() => import("../pages/About")));
const ErrorPage = Loadable(lazy(() => import("../pages/Errorpage")));
const Contact=Loadable(lazy(() => import("../pages/Contact")));
const Courses=Loadable(lazy(() => import("../pages/Courses")));
const routes = createBrowserRouter([
  {
    path: "/",
    element: (
     <MainLayout></MainLayout>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "Courses", element: <Courses/> },
      { path: "Contact", element: <Contact /> },
    ],
  },
  { path: "*", element: <ErrorPage /> },
]);

export default function AppRoutes() {
  return <RouterProvider router={routes} />;
}
