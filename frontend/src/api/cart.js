import axiosClient from "./axiosClient";

export const getCart = () => axiosClient.get("/cart");
export const addToCart = (listingId) => axiosClient.post("/cart/items", { listingId });
export const removeFromCart = (listingId) => axiosClient.delete(`/cart/items/${listingId}`);