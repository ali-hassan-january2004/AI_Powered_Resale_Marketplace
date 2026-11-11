import axiosClient from "./axiosClient";

export const getWishlist = () => axiosClient.get("/wishlist");
export const addToWishlist = (listingId) => axiosClient.post(`/wishlist/${listingId}`);
export const removeFromWishlist = (listingId) => axiosClient.delete(`/wishlist/${listingId}`);