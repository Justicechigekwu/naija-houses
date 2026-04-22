import { ActivityIndicator, Pressable, Text } from "react-native";
import { useTheme } from "@/hooks/useTheme";

type AppButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  textClassName?: string;
};

export default function AppButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  className = "",
  textClassName = "",
}: AppButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`items-center justify-center ${
        isDisabled ? "opacity-60" : ""
      } ${className}`}
      style={{
        backgroundColor:
          variant === "primary"
            ? colors.brand
            : variant === "danger"
            ? colors.danger
            : colors.surface,
        borderWidth: variant === "secondary" ? 1 : 0,
        borderColor: variant === "secondary" ? colors.border : "transparent",
      }}
    >
      {loading ? (
        <ActivityIndicator color={variant === "secondary" ? colors.text : "#fff"} />
      ) : (
        <Text
          className={textClassName}
          style={{ color: variant === "secondary" ? colors.text : "#FFFFFF" }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}