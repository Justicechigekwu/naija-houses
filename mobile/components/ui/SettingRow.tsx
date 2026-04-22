import { ChevronRight } from "lucide-react-native";
import { Pressable, Text } from "react-native";
import { useTheme } from "@/hooks/useTheme";

type SettingRowProps = {
  label: string;
  onPress: () => void;
};

export default function SettingRow({ label, onPress }: SettingRowProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between border-b px-4 py-4"
      style={{
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      <Text className="text-base" style={{ color: colors.text }}>
        {label}
      </Text>
      <ChevronRight size={18} color={colors.muted} />
    </Pressable>
  );
}