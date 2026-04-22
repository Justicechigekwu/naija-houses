import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { connectSocket } from "@/libs/socket";
import type { AppNotification } from "@/types/marketplace";
import {
  deleteNotification,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/features/notifications/notification-api";

type NotificationContextType = {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
  markOneAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);

      const [items, unread] = await Promise.all([
        getNotifications(),
        getUnreadNotificationCount(),
      ]);

      setNotifications(items || []);
      setUnreadCount(unread?.unreadCount || 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const socket = connectSocket();

    const handleNewNotification = (payload: AppNotification) => {
      setNotifications((prev) => [payload, ...prev]);
    };

    const handleUnreadCount = (payload: { unreadCount: number }) => {
      setUnreadCount(payload?.unreadCount || 0);
    };

    socket.on("notification:new", handleNewNotification);
    socket.on("notification:unread-count", handleUnreadCount);

    return () => {
      socket.off("notification:new", handleNewNotification);
      socket.off("notification:unread-count", handleUnreadCount);
    };
  }, []);

  const markOneAsRead = useCallback(async (id: string) => {
    const updated = await markNotificationAsRead(id);

    setNotifications((prev) =>
      prev.map((item) => (item._id === id ? updated : item))
    );

    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsReadAction = useCallback(async () => {
    await markAllNotificationsAsRead();

    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        isRead: true,
      }))
    );

    setUnreadCount(0);
  }, []);

  const removeNotificationAction = useCallback(async (id: string) => {
    await deleteNotification(id);

    setNotifications((prev) => prev.filter((item) => item._id !== id));
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      refresh,
      markOneAsRead,
      markAllAsRead: markAllAsReadAction,
      removeNotification: removeNotificationAction,
    }),
    [
      notifications,
      unreadCount,
      loading,
      refresh,
      markOneAsRead,
      markAllAsReadAction,
      removeNotificationAction,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);

  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }

  return ctx;
}