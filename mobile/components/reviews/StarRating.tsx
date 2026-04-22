import { Pressable, View } from "react-native";
import { Star } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";

export default function StarRating({
  value,
  onChange,
  size = 28,
}: {
  value: number;
  onChange?: (val: number) => void;
  size?: number;
}) {
  const { colors } = useTheme();

  return (
    <View className="flex-row" style={{ gap: 6 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const active = value >= star;

        return (
          <Pressable
            key={star}
            onPress={() => onChange?.(star)}
            disabled={!onChange}
            className="rounded-md"
            hitSlop={6}
          >
            <Star
              size={size}
              color={active ? "#FACC15" : colors.border}
              fill={active ? "#FACC15" : "transparent"}
            />
          </Pressable>
        );
      })}
    </View>
  );
}