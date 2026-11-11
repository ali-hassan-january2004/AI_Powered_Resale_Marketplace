import axiosClient from "./axiosClient";

// params: q, category, minPrice, maxPrice, size, condition, brand, color, sort, page, limit
export const getListings = (params) => axiosClient.get("/listings", { params });
export const getListing = (id) => axiosClient.get(`/listings/${id}`);
export const getSimilarListings = (id) => axiosClient.get(`/listings/${id}/similar`);
export const createListing = (payload) => axiosClient.post("/listings", payload);
export const updateListing = (id, payload) => axiosClient.patch(`/listings/${id}`, payload);
export const deleteListing = (id) => axiosClient.delete(`/listings/${id}`);
export const markListingSold = (id) => axiosClient.post(`/listings/${id}/mark-sold`);

export const uploadListingImages = (id, files) => {
  const formData = new FormData();
  Array.from(files).forEach((f) => formData.append("images", f));
  return axiosClient.post(`/listings/${id}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });
};