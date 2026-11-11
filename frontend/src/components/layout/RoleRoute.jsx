import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { PATHS } from "../../app/routePaths";

export default function RoleRoute({ roles = [] }) {
  const user = useSelector((s) => s.auth.user);
  const location = useLocation();

  if (!user) return <Navigate to={PATHS.login} replace state={{ from: location }} />;

  if (!roles.includes(user.role)) {
    // Buyers who try to open seller pages are sent to the account page,
    // where they can enable the seller role.
    return <Navigate to={PATHS.account} replace />;
  }
  return <Outlet />;
}