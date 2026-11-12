export const selectUser = (s) => s.auth.user;
export const selectAuthStatus = (s) => s.auth.status;
export const selectAuthError = (s) => s.auth.error;
export const selectAuthInitialized = (s) => s.auth.initialized;
export const selectIsAuthenticated = (s) => !!s.auth.user;
export const selectRole = (s) => s.auth.user?.role ?? null;
export const selectIsSeller = (s) => ["seller", "admin"].includes(s.auth.user?.role);
export const selectIsAdmin = (s) => s.auth.user?.role === "admin";
export const selectAddresses = (s) => s.auth.user?.addresses ?? [];
export const selectDefaultAddress = (s) => {
  const list = s.auth.user?.addresses ?? [];
  return list.find((a) => a.isDefault) ?? list[0] ?? null;
};