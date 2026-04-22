"use client";

import { useNotifications, type AppNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import { getNotificationBadge } from "@/utils/notificationText";
import PageReadyLoader from "@/components/pages/PageReadyLoader";

export default function NotificationsPage() {
  const router = useRouter();
  const {
    notifications,
    loading,
    markOneAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications();

  const handleOpenNotification = async (item: AppNotification) => {
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

  return (
    <PageReadyLoader ready={!loading}>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/profile")}
            className="text-sm px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
          >
            ← Back
          </button>

          <button
            onClick={markAllAsRead}
            className="text-sm px-4 py-2 rounded-xl bg-[#8A715D] text-white hover:opacity-90 transition shadow-sm"
          >
            Mark all as read
          </button>
        </div>

        <h1 className="text-3xl font-semibold mb-6">Notifications</h1>

        {notifications.length === 0 ? (
          <div className="border border-dashed rounded-2xl p-10 text-center text-gray-500 bg-white">
            <p className="text-lg font-medium">No notifications yet</p>
            <p className="text-sm mt-1">
              When something happens, you will see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item._id}
                className={`group rounded-2xl border p-5 transition-all duration-200 hover:shadow-md cursor-pointer ${
                  item.isRead
                    ? "bg-white border-gray-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="flex-1"
                    onClick={() => handleOpenNotification(item)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-semibold text-gray-800">
                        {item.title}
                      </h2>

                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        {getNotificationBadge(item.type)}
                      </span>

                      {!item.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm">{item.message}</p>

                    {item.listing?.title && (
                      <p className="text-sm text-gray-500 mt-1">
                        Listing:{" "}
                        <span className="font-medium">
                          {item.listing.title}
                        </span>
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>

                      <p className="text-xs font-medium text-[#8A715D]">
                        {item.metadata?.actionLabel || "Open"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeNotification(item._id)}
                    className="text-xs text-red-500 opacity-0 group-hover:opacity-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageReadyLoader>
  );
}