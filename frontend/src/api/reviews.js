import axiosClient from "./axiosClient";

export const createReview = (orderId, { rating, comment }) =>
  axiosClient.post(`/orders/${orderId}/review`, { rating, comment });
export const getSellerReviews = (sellerId, params) =>
  axiosClient.get(`/users/${sellerId}/reviews`, { params });