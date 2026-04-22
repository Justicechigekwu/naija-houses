import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

export default function NotFoundScreen() {
  const { colors } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: colors.surface }}
      >
        <Text
          className="text-2xl font-bold"
          style={{ color: colors.text }}
        >
          Page not found
        </Text>
        <Link
          href="/"
          className="mt-4 text-base font-medium"
          style={{ color: colors.brand }}
        >
          Go to home
        </Link>
      </View>
    </>
  );
}