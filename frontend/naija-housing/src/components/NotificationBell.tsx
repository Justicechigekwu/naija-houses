"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotifications, type AppNotification } from "@/context/NotificationContext";
import { getNotificationBadge } from "@/utils/notificationText";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const {
    notifications,
    unreadCount,
    markOneAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications();

  const handleOpenNotification = async (item: AppNotification) => {
    try {
      if (!item.isRead) {
        await markOneAsRead(item._id);
      }

      setOpen(false);
      router.push(item.metadata?.route || "/notification");
    } catch (error) {
      console.error("Failed to open notification", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded border"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[360px] bg-white border rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between p-3 border-b">
            <h3 className="font-semibold">Notifications</h3>
            <button onClick={markAllAsRead} className="text-sm text-blue-600">
              Mark all read
            </button>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">
                No notifications yet.
              </div>
            ) : (
              notifications.slice(0, 8).map((item) => (
                <div
                  key={item._id}
                  className={`p-3 border-b ${
                    item.isRead ? "bg-white" : "bg-blue-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => handleOpenNotification(item)}
                    >
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{item.title}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {getNotificationBadge(item.type)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mt-1">
                        {item.message}
                      </p>

                      {item.listing?.title && (
                        <p className="text-xs text-gray-500 mt-1">
                          Listing: {item.listing.title}
                        </p>
                      )}

                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>

                      <p className="text-xs text-blue-600 mt-2 inline-block">
                        Open
                      </p>
                    </div>

                    <button
                      onClick={() => removeNotification(item._id)}
                      className="text-xs text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t">
            <Link
              href="/notification"
              className="text-sm text-blue-600"
              onClick={() => setOpen(false)}
            >
              See all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}