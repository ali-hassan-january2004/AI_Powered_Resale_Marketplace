import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { PATHS } from "../../app/routePaths";

export default function ProtectedRoute() {
  const user = useSelector((s) => s.auth.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to={PATHS.login} replace state={{ from: location }} />;
  }
  return <Outlet />;
}