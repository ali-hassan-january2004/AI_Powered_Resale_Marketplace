import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { PATHS } from "../app/routePaths";
import { selectAuthInitialized } from "../features/auth/authSelectors";

export default function AuthLayout() {
  const user = useSelector((s) => s.auth.user);
  const location = useLocation();

  const initialized = useSelector(selectAuthInitialized);
if (!initialized) return null;

  // Already logged in: skip the login/register screens.
  if (user) return <Navigate to={location.state?.from?.pathname || PATHS.home} replace />;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 py-10">
      <Link to={PATHS.home} className="mb-6 text-2xl font-bold tracking-tight">
        Resale<span className="text-emerald-600">.</span>
      </Link>
      <main className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <Outlet />
      </main>
      <Link to={PATHS.home} className="mt-6 text-sm text-stone-500 hover:text-stone-900">
        ← Back to the shop
      </Link>
    </div>
  );
}