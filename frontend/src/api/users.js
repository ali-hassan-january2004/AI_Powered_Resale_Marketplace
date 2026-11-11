import axiosClient from "./axiosClient";

export const getMe = () => axiosClient.get("/users/me");
export const updateMe = (payload) => axiosClient.patch("/users/me", payload);
export const becomeSeller = (payload) => axiosClient.post("/users/me/become-seller", payload);
export const getSellerProfile = (id) => axiosClient.get(`/users/${id}`);