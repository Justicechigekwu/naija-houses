"use client";

import { useNotifications } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import { getNotificationBadge } from "@/utils/notificationText";

export default function NotificationsPage() {
  const router = useRouter();
  const {
    notifications,
    loading,
    markOneAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications();

  const handleOpenNotification = async (item: any) => {
    try {
      if (!item.isRead) {
        await markOneAsRead(item._id);
      }

      const route = item.metadata?.route || "/notification";
      router.push(route);
    } catch (error) {
      console.error("Failed to open notification", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4">Loading notifications...</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <button
        className="border px-3 py-2 rounded bg-[#8A715D] text-white"
        onClick={() => router.push("/profile")}
      >
        Back to Home
      </button>

      <div className="flex items-center justify-between mb-4 mt-4">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <button onClick={markAllAsRead} className="border px-3 py-2 rounded">
          Mark all as read
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="border rounded p-4 text-gray-500">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item._id}
              className={`border rounded p-4 ${
                item.isRead ? "bg-white" : "bg-blue-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => handleOpenNotification(item)}
                >
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold">{item.title}</h2>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {getNotificationBadge(item.type)}
                    </span>
                  </div>

                  <p className="text-gray-700 mt-1">{item.message}</p>

                  {item.listing?.title && (
                    <p className="text-sm text-gray-500 mt-1">
                      Listing: {item.listing.title}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>

                  {/* <p className="text-xs text-blue-600 mt-2">
                    Tap to open
                  </p> */}
                  <p className="text-xs text-blue-600 mt-2">
                    {item.metadata?.actionLabel || "Open"}
                  </p>
                </div>

                <button
                  onClick={() => removeNotification(item._id)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
