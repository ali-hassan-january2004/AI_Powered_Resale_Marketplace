import axiosClient from "./axiosClient";

export const getAdminStats = () => axiosClient.get("/admin/stats");
export const getAdminUsers = (params) => axiosClient.get("/admin/users", { params });
export const toggleBlockUser = (id, blocked) =>
  axiosClient.patch(`/admin/users/${id}/block`, { blocked });
export const getAdminListings = (params) => axiosClient.get("/admin/listings", { params });
export const removeAdminListing = (id, reason) =>
  axiosClient.delete(`/admin/listings/${id}`, { data: { reason } });
export const createCategory = (payload) => axiosClient.post("/admin/categories", payload);
export const updateCategory = (id, payload) => axiosClient.patch(`/admin/categories/${id}`, payload);
export const deleteCategory = (id) => axiosClient.delete(`/admin/categories/${id}`);
export const getAdminReports = (params) => axiosClient.get("/admin/reports", { params });
export const resolveReport = (id, status) =>
  axiosClient.patch(`/admin/reports/${id}`, { status }); // "dismissed" | "actioned"