import axiosClient from "./axiosClient";

// payload: { targetType: "listing" | "user" | "review", targetId, reason }
export const createReport = (payload) => axiosClient.post("/reports", payload);