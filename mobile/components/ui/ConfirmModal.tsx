import { Modal, Pressable, Text, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  confirmVariant = "primary",
  onClose,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  confirmVariant?: "danger" | "primary";
  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
}) {
  const { colors } = useTheme();

  if (!isOpen) return null;

  const confirmBg = confirmVariant === "danger" ? colors.danger : colors.brand;

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/60 px-4">
        <View
          className="w-full max-w-sm rounded-3xl p-6"
          style={{ backgroundColor: colors.surface }}
        >
          <Text className="text-xl font-semibold" style={{ color: colors.text }}>
            {title}
          </Text>
          <Text className="mt-3 text-sm leading-6" style={{ color: colors.muted }}>
            {message}
          </Text>

          <View className="mt-6 flex-row justify-end gap-3">
            <Pressable
              onPress={onCancel || onClose}
              className="rounded-2xl px-4 py-3"
              style={{ borderWidth: 1, borderColor: colors.border }}
            >
              <Text className="text-sm font-medium" style={{ color: colors.text }}>
                {cancelText}
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              className="rounded-2xl px-4 py-3"
              style={{ backgroundColor: confirmBg }}
            >
              <Text className="text-sm font-medium text-white">{confirmText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}