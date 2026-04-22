import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";

import { useTheme } from "@/hooks/useTheme";

type HelpMenuCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  onPress: () => void;
};

export default function HelpMenuCard({
  title,
  description,
  icon,
  onPress,
}: HelpMenuCardProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 rounded-[22px] border p-4"
      style={{
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      <View className="flex-row items-start">
        <View
          className="h-11 w-11 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${colors.brand}1A` }}
        >
          {icon}
        </View>

        <View className="ml-3 flex-1">
          <Text
            className="text-[16px] font-semibold"
            style={{ color: colors.text }}
          >
            {title}
          </Text>
          <Text
            className="mt-1 text-[13px] leading-5"
            style={{ color: colors.muted }}
          >
            {description}
          </Text>
        </View>

        <ChevronRight size={18} color={colors.muted} />
      </View>
    </Pressable>
  );
}