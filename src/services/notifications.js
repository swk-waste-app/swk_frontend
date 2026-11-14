import { apiClient } from "./config"

export const apiGetNotifications = () => apiClient.get("/notifications")

export const apiMarkNotificationRead = (id) => apiClient.patch(`/notifications/${id}/read`)

export const apiMarkAllNotificationsRead = () => apiClient.patch("/notifications/read-all")
