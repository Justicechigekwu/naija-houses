import { Tabs, useRouter } from "expo-router";
import {
  House,
  Heart,
  CirclePlus,
  MessageCircle,
  User,
} from "lucide-react-native";

import { useAuthStore } from "@/store/auth-store";
import { useTheme } from "@/hooks/useTheme";

export default function TabsLayout() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { colors } = useTheme();

  const requireAuth = (target: string) => ({
    tabPress: (e: any) => {
      if (user) return;

      e.preventDefault();
      router.push({
        pathname: "/login",
        params: { redirect: target },
      } as any);
    },
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 0,
          height: 60,
          paddingTop: 3,
          paddingBottom: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "400",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <House
              color={color}
              size={focused ? size + 2 : size}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        listeners={requireAuth("/favorites")}
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, size, focused }) => (
            <Heart
              color={color}
              size={focused ? size + 2 : size}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        listeners={requireAuth("/create")}
        options={{
          title: "Create",
          tabBarIcon: ({ color, size, focused }) => (
            <CirclePlus
              color={color}
              size={focused ? size + 2 : size}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="messages"
        listeners={requireAuth("/messages")}
        options={{
          title: "Messages",
          tabBarIcon: ({ color, size, focused }) => (
            <MessageCircle
              color={color}
              size={focused ? size + 2 : size}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        listeners={requireAuth("/profile")}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <User
              color={color}
              size={focused ? size + 2 : size}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
}