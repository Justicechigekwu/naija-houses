import { Pressable, Text, View } from "react-native";
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react-native";
import type { ToastType } from "@/context/UIContext";

export default function Toast({
  message,
  type,
  onClose,
  offset = 0,
}: {
  message: string;
  type: ToastType;
  onClose: () => void;
  offset?: number;
}) {
  const icon =
    type === "success" ? (
      <CheckCircle2 size={18} color="#34D399" />
    ) : type === "error" ? (
      <AlertCircle size={18} color="#F87171" />
    ) : type === "warning" ? (
      <TriangleAlert size={18} color="#FBBF24" />
    ) : (
      <Info size={18} color="#60A5FA" />
    );

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 120 + offset * 72,
        zIndex: 9999,
      }}
    >
      <View className="rounded-full border border-white/10 bg-[#1B1B1B] px-4 py-3 shadow-lg">
        <View className="flex-row items-center gap-3">
          {icon}
          <Text className="flex-1 text-sm font-medium text-white">{message}</Text>
          <Pressable onPress={onClose} hitSlop={10}>
            <X size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}