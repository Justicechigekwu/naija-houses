import { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/useTheme";

type LegalPageScreenProps = {
  title: string;
  description?: string;
  lastUpdated?: string;
  children: ReactNode;
};

export default function LegalPageScreen({
  title,
  description,
  lastUpdated = "March 22, 2026",
  children,
}: LegalPageScreenProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="rounded-[28px] px-4 py-5"
          style={{ backgroundColor: colors.brand }}
        >
          <Text className="text-[24px] font-bold text-white">{title}</Text>

          {description ? (
            <Text className="mt-2 text-[13px] leading-5 text-white/85">
              {description}
            </Text>
          ) : null}

          <Text className="mt-4 text-[12px] text-white/80">
            Last updated: {lastUpdated}
          </Text>
        </View>

        <View
          className="mt-5 rounded-[24px] border p-4"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}
        >
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}