import { ReactNode, forwardRef, useMemo, useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";

type AppInputProps = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  inputClassName?: string;
  isPassword?: boolean;
};

const FOCUS_RING_COLOR = "#8A715D";

const AppInput = forwardRef<TextInput, AppInputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      inputClassName = "",
      isPassword = false,
      secureTextEntry,
      ...props
    },
    ref
  ) => {
    const { colors } = useTheme();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const resolvedSecureTextEntry = useMemo(() => {
      if (isPassword) return !isPasswordVisible;
      return secureTextEntry;
    }, [isPassword, isPasswordVisible, secureTextEntry]);

    const ringColor = error ? colors.danger : FOCUS_RING_COLOR;

    return (
      <View className="mb-4">
        {label ? (
          <Text className="mb-2 text-[14px] font-medium" style={{ color: colors.text }}>
            {label}
          </Text>
        ) : null}

        <View
          className={`min-h-[52px] flex-row items-center rounded-2xl border px-4 ${inputClassName || ""}`}
          style={{
            backgroundColor: colors.surface,
            borderColor: error ? colors.danger : colors.border,
            shadowColor: ringColor,
            shadowOpacity: isFocused ? 0.2 : 0,
            shadowRadius: isFocused ? 0 : 0,
            shadowOffset: { width: 0, height: 0 },
            elevation: 0,
          }}
        >
          <View
            pointerEvents="none"
            className="absolute inset-0 rounded-2xl"
            style={{
              borderWidth: isFocused ? 2 : 0,
              borderColor: ringColor,
            }}
          />

          {leftIcon ? <View className="mr-3">{leftIcon}</View> : null}

          <TextInput
            ref={ref}
            placeholderTextColor={colors.muted}
            className="flex-1 text-[15px]"
            style={{ color: colors.text }}
            secureTextEntry={resolvedSecureTextEntry}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {isPassword ? (
            <Pressable
              onPress={() => setIsPasswordVisible((prev) => !prev)}
              hitSlop={10}
              className="ml-3"
            >
              {isPasswordVisible ? (
                <EyeOff size={18} color={colors.muted} />
              ) : (
                <Eye size={18} color={colors.muted} />
              )}
            </Pressable>
          ) : rightIcon ? (
            <View className="ml-3">{rightIcon}</View>
          ) : null}
        </View>

        {error ? (
          <Text className="mt-2 text-sm" style={{ color: colors.danger }}>
            {error}
          </Text>
        ) : null}
      </View>
    );
  }
);

AppInput.displayName = "AppInput";

export default AppInput;