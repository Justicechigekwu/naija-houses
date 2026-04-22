import { Pressable, Text, View } from "react-native";
import { Bell } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useNotifications } from "@/context/NotificationContext";

export default function NotificationBell() {
  const router = useRouter();
  const { colors } = useTheme();
  const { unreadCount } = useNotifications();

  return (
    <Pressable
      onPress={() => router.push("/notification" as any)}
      className="relative rounded-2xl p-2"
      style={{
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      <Bell size={20} color={colors.text} />

      {unreadCount > 0 ? (
        <View
          className="absolute -right-1 -top-1 min-h-5 min-w-5 items-center justify-center rounded-full px-1"
          style={{ backgroundColor: colors.danger }}
        >
          <Text className="text-[10px] font-medium text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}