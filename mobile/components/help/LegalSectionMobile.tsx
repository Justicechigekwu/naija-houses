import { ReactNode } from "react";
import { Text, View } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type LegalSectionMobileProps = {
  title: string;
  children: ReactNode;
};

export default function LegalSectionMobile({
  title,
  children,
}: LegalSectionMobileProps) {
  const { colors } = useTheme();

  return (
    <View className="mb-7">
      <Text
        className="text-[18px] font-semibold"
        style={{ color: colors.text }}
      >
        {title}
      </Text>

      <View className="mt-3">{children}</View>
    </View>
  );
}