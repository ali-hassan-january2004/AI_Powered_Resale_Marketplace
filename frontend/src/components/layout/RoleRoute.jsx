import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { PATHS } from "../../app/routePaths";
import { selectAuthInitialized, selectUser } from "../../features/auth/authSelectors";
import Spinner from "../ui/Spinner";

export default function RoleRoute({ roles = [] }) {
  const user = useSelector(selectUser);
  const initialized = useSelector(selectAuthInitialized);
  const location = useLocation();

  if (!initialized) {
    return <div className="flex justify-center p-16 text-stone-500"><Spinner size={28} /></div>;
  }
  if (!user) return <Navigate to={PATHS.login} replace state={{ from: location }} />;
  if (!roles.includes(user.role)) return <Navigate to={PATHS.account} replace />;
  return <Outlet />;
}