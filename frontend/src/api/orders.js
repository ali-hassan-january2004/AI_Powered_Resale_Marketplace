import axiosClient from "./axiosClient";

// payload: { shippingAddress, paymentMethod: "cod" | "test_card" }
export const createOrder = (payload) => axiosClient.post("/orders", payload);
export const getOrders = (params) => axiosClient.get("/orders", { params });
export const getOrder = (id) => axiosClient.get(`/orders/${id}`);
export const cancelOrder = (id) => axiosClient.post(`/orders/${id}/cancel`);