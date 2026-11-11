import axiosClient from "./axiosClient";

export const getNotifications = (params) => axiosClient.get("/notifications", { params });
export const markNotificationRead = (id) => axiosClient.patch(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => axiosClient.patch("/notifications/read-all");