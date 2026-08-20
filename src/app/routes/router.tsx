/** @format */

import { createBrowserRouter, Link, useRouteError } from "react-router-dom";
import { LandingPage } from "@/pages/landing";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { ProfilePage } from "@/pages/profile";
import { CoursesPage, CourseDetailPage } from "@/pages/courses";
import { LearningPage } from "@/pages/learning";
import { ApplicationsPage } from "@/pages/applications";
import { PaymentsPage } from "@/pages/payments";
import { SettingsPage } from "@/pages/settings";
import { NotFoundPage } from "@/pages/not-found";
import { AppShell } from "@/widgets/app-shell";
import { AuthLayout } from "@/widgets/auth-layout";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { paths } from "@/shared/config/routes";

function RouteErrorFallback() {
  const error = useRouteError();
  if (import.meta.env.DEV) {
    console.error(error);
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-brand-softer text-ink">
      <h1 className="text-3xl font-medium">Xatolik yuz berdi</h1>
      <p>Kutilmagan xatolik yuz berdi. Sahifani qayta yuklab ko'ring.</p>
      <Link to={paths.home} className="text-brand font-medium">
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    errorElement: <RouteErrorFallback />,
    children: [
      { path: paths.home, element: <LandingPage /> },
      {
        element: <AuthLayout />,
        children: [
          { path: paths.login, element: <LoginPage /> },
          { path: paths.register, element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <PrivateRoute />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: paths.courses, element: <CoursesPage /> },
          { path: paths.courseDetail, element: <CourseDetailPage /> },
          { path: paths.learning, element: <LearningPage /> },
          { path: paths.applications, element: <ApplicationsPage /> },
          { path: paths.payments, element: <PaymentsPage /> },
          { path: paths.settings, element: <SettingsPage /> },
          { path: paths.profile, element: <ProfilePage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
    errorElement: <RouteErrorFallback />,
  },
]);
