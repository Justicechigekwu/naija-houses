import { ActivityIndicator, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

export default function LoadingScreen() {
  const { colors } = useTheme();

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: colors.background }}
    >
      <ActivityIndicator size="large" color={colors.brand} />
    </View>
  );
}