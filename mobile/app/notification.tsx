import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import AppScreen from "@/components/ui/AppScreen";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useTheme } from "@/hooks/useTheme";
import { useNotifications } from "@/context/NotificationContext";
import { resolveNotificationRoute } from "@/utils/resolveNotificationRoute";
import type { AppNotification } from "@/types/marketplace";
import { hexToRgba } from "@/libs/theme-utils";
import { buildExpoRouteFromBackendPath } from "@/libs/navigation";

function getNotificationBadge(type: AppNotification["type"]) {
  switch (type) {
    case "LISTING_APPROVED":
      return "Approved";
    case "LISTING_REJECTED":
      return "Rejected";
    case "LISTING_EXPIRED":
      return "Expired";
    case "PAYMENT_REJECTED":
      return "Payment";
    case "PAYMENT_CONFIRMED":
      return "Payment";
    case "DRAFT_REMINDER":
      return "Draft";
    case "LISTING_REMOVED_BY_ADMIN":
      return "Violation";
    case "LISTING_APPEAL_SUBMITTED":
      return "Appeal";
    case "LISTING_APPEAL_APPROVED":
      return "Appeal";
    case "LISTING_APPEAL_REJECTED":
      return "Appeal";
    default:
      return "Notice";
  }
}

export default function NotificationsPage() {
  const router = useRouter();
  const { colors } = useTheme();
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

      const route = resolveNotificationRoute(item);
      router.push(buildExpoRouteFromBackendPath(route) as any);
    } catch {
      router.push("/notification" as any);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <AppScreen scroll padded>
      <View className="mb-6 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="rounded-2xl px-4 py-3"
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}
        >
          <Text className="text-sm font-medium" style={{ color: colors.text }}>
            Back
          </Text>
        </Pressable>

        <Pressable
          onPress={markAllAsRead}
          className="rounded-2xl px-4 py-3"
          style={{ backgroundColor: colors.brand }}
        >
          <Text className="text-sm font-medium text-white">
            Mark all as read
          </Text>
        </Pressable>
      </View>

      <Text className="mb-6 text-3xl font-semibold" style={{ color: colors.text }}>
        Notifications
      </Text>

      {notifications.length === 0 ? (
        <View
          className="rounded-3xl border p-10"
          style={{
            borderWidth: 1,
            borderStyle: "dashed",
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}
        >
          <Text className="text-center text-lg font-medium" style={{ color: colors.text }}>
            No notifications yet
          </Text>
          <Text className="mt-1 text-center text-sm" style={{ color: colors.muted }}>
            When something happens, you will see it here.
          </Text>
        </View>
      ) : (
        <View>
          {notifications.map((item) => (
            <View
              key={item._id}
              className="mb-4 rounded-3xl border p-5"
              style={{
                borderColor: item.isRead
                  ? colors.border
                  : hexToRgba(colors.brand, 0.25),
                backgroundColor: item.isRead
                  ? colors.surface
                  : hexToRgba(colors.brand, 0.08),
              }}
            >
              <View className="flex-row items-start justify-between gap-4">
                <Pressable
                  onPress={() => handleOpenNotification(item)}
                  className="flex-1"
                >
                  <View className="mb-1 flex-row items-center gap-2">
                    <Text className="font-semibold" style={{ color: colors.text }}>
                      {item.title}
                    </Text>

                    <View
                      className="rounded-full px-2 py-1"
                      style={{ backgroundColor: colors.background }}
                    >
                      <Text className="text-xs" style={{ color: colors.muted }}>
                        {getNotificationBadge(item.type)}
                      </Text>
                    </View>

                    {!item.isRead ? (
                      <View
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: colors.brand }}
                      />
                    ) : null}
                  </View>

                  <Text className="text-sm leading-6" style={{ color: colors.muted }}>
                    {item.message}
                  </Text>

                  {item.listing?.title ? (
                    <Text className="mt-1 text-sm" style={{ color: colors.muted }}>
                      Listing: <Text style={{ color: colors.text }}>{item.listing.title}</Text>
                    </Text>
                  ) : null}

                  <View className="mt-3 flex-row items-center justify-between">
                    <Text className="text-xs" style={{ color: colors.muted }}>
                      {new Date(item.createdAt).toLocaleString()}
                    </Text>

                    <Text className="text-xs font-medium" style={{ color: colors.brand }}>
                      {item.metadata?.actionLabel || "Open"}
                    </Text>
                  </View>
                </Pressable>

                <Pressable onPress={() => removeNotification(item._id)}>
                  <Text className="text-xs" style={{ color: colors.danger }}>
                    Delete
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}
    </AppScreen>
  );
}