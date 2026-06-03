import { Outlet, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";

import Navbar from "../components/navbar/Navbar";
import Courses from "../pages/Courses";

const Footer = lazy(() => import("../components/Footer"));

export default function MainLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isCourseCatalogRoute = location.pathname.toLowerCase() === "/courses";

  if (isAdminRoute) {
    return (
      <section className="min-h-screen">
        <Outlet />
      </section>
    );
  }

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-[-12rem] top-[-8rem] h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute right-[-8rem] top-40 h-72 w-72 rounded-full bg-orange-200/35 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      <Navbar />

      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {isCourseCatalogRoute ? <Courses /> : <Outlet />}
      </main>

      <Suspense fallback={<div className="p-2 text-center">Loading footer...</div>}>
        <Footer />
      </Suspense>
    </section>
  );
}
