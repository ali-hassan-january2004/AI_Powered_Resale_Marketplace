import axiosClient from "./axiosClient";

export const getMyListings = (params) => axiosClient.get("/seller/listings", { params });
export const getSellerOrder = (id) => axiosClient.get(`/seller/orders/${id}`);
export const getSellerOrders = (params) => axiosClient.get("/seller/orders", { params });
// status: "confirmed" | "shipped" | "delivered"
export const updateOrderStatus = (id, status, note) =>
  axiosClient.patch(`/seller/orders/${id}/status`, { status, note });
export const getSellerSummary = () => axiosClient.get("/seller/summary");