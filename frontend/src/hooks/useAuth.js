import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser, registerUser } from "../features/auth/authSlice";
import {
  selectAuthError,
  selectAuthInitialized,
  selectAuthStatus,
  selectIsAdmin,
  selectIsAuthenticated,
  selectIsSeller,
  selectUser,
} from "../features/auth/authSelectors";

export default function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isSeller = useSelector(selectIsSeller);
  const isAdmin = useSelector(selectIsAdmin);
  const initialized = useSelector(selectAuthInitialized);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  // These return promises that reject with { message, status, code }
  const login = useCallback((credentials) => dispatch(loginUser(credentials)).unwrap(), [dispatch]);
  const register = useCallback((payload) => dispatch(registerUser(payload)).unwrap(), [dispatch]);
  const logout = useCallback(() => dispatch(logoutUser()).unwrap(), [dispatch]);

  return {
    user, isAuthenticated, isSeller, isAdmin, role: user?.role,
    initialized, loading: status === "loading", error,
    login, register, logout,
  };
}