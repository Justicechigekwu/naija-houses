import { ReactNode } from "react";
import { Text, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

type LegalBulletListProps = {
  items: ReactNode[];
};

export default function LegalBulletList({ items }: LegalBulletListProps) {
  const { colors } = useTheme();

  return (
    <View className="gap-2">
      {items.map((item, index) => (
        <View key={index} className="flex-row items-start">
          <Text
            className="mr-2 mt-[1px] text-[14px]"
            style={{ color: colors.text }}
          >
            •
          </Text>
          <Text
            className="flex-1 text-[14px] leading-6"
            style={{ color: colors.text }}
          >
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}