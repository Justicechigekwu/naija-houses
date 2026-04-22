import { ReactNode } from "react";
import { Text } from "react-native";
import { useTheme } from "@/hooks/useTheme";

export function LegalText({ children }: { children: ReactNode }) {
  const { colors } = useTheme();

  return (
    <Text className="text-[14px] leading-6" style={{ color: colors.text }}>
      {children}
    </Text>
  );
}

export function LegalMutedText({ children }: { children: ReactNode }) {
  const { colors } = useTheme();

  return (
    <Text className="text-[13px] leading-5" style={{ color: colors.muted }}>
      {children}
    </Text>
  );
}