import { ReactNode } from "react";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

type AvatarProps = {
  uri?: string | null;
  name?: string;
  size?: number;
  children?: ReactNode;
};

export default function Avatar({
  uri,
  name = "U",
  size = 88,
  children,
}: AvatarProps) {
  const { colors } = useTheme();

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <View style={{ width: size, height: size }}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          contentFit="cover"
        />
      ) : (
        <View
          className="items-center justify-center rounded-full"
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: "rgba(138,113,93,0.15)",
          }}
        >
          <Text className="text-lg font-semibold" style={{ color: colors.brand }}>
            {initials || "U"}
          </Text>
        </View>
      )}

      {children}
    </View>
  );
}