import { api } from "@/libs/api";
import type { AppNotification } from "@/types/marketplace";

export async function getNotifications() {
  const response = await api.get<AppNotification[]>("/notifications");
  return response.data;
}

export async function getUnreadNotificationCount() {
  const response = await api.get<{ unreadCount: number }>("/notifications/unread-count");
  return response.data;
}

export async function markNotificationAsRead(id: string) {
  const response = await api.patch<AppNotification>(`/notifications/${id}/read`);
  return response.data;
}

export async function markAllNotificationsAsRead() {
  const response = await api.patch<{ message: string }>("/notifications/read-all");
  return response.data;
}

export async function deleteNotification(id: string) {
  const response = await api.delete<{ message: string }>(`/notifications/${id}`);
  return response.data;
}