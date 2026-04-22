import { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

type AppScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
};

export default function AppScreen({
  children,
  scroll = false,
  padded = true,
}: AppScreenProps) {
  const { colors } = useTheme();

  const content = (
    <View className={padded ? "flex-1 px-4 py-4" : "flex-1"}>{children}</View>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {scroll ? (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}