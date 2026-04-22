import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { submitReport, type ReportTargetType } from "@/features/reports/api";
import { useUI } from "@/hooks/useUI";
import { useTheme } from "@/hooks/useTheme";

const REPORT_REASONS = [
  "SCAM",
  "FAKE_ITEM",
  "FAKE_PRICE",
  "ABUSIVE_BEHAVIOR",
  "SPAM",
  "DUPLICATE",
  "PROHIBITED_ITEM",
  "MISLEADING_INFO",
  "OTHER",
];

export default function ReportChatTargetModal({
  open,
  targetType,
  targetId,
  targetLabel,
  onClose,
}: {
  open: boolean;
  targetType: ReportTargetType;
  targetId?: string;
  targetLabel?: string;
  onClose: () => void;
}) {
  const { showToast } = useUI();
  const { colors, resolvedTheme } = useTheme();
  const [reason, setReason] = useState("SCAM");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!targetId) return;

    try {
      setSubmitting(true);

      await submitReport({
        targetType,
        targetId,
        reason,
        message,
      });

      showToast("Report submitted successfully.", "success");
      setReason("SCAM");
      setMessage("");
      onClose();
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Failed to submit report",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal transparent visible={open} animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50 px-4">
        <View
          className="w-full max-w-sm rounded-3xl p-5"
          style={{ backgroundColor: colors.surface }}
        >
          <Text className="text-lg font-semibold" style={{ color: colors.text }}>
            Report {targetType === "USER" ? "Seller" : "Listing"}
          </Text>

          <Text className="mt-2 text-sm" style={{ color: colors.muted }}>
            {targetLabel
              ? `You are reporting: ${targetLabel}`
              : "Submit your report below."}
          </Text>

          <Text
            className="mb-2 mt-4 text-sm font-medium"
            style={{ color: colors.text }}
          >
            Reason
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <View className="flex-row gap-2">
              {REPORT_REASONS.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setReason(item)}
                  className="rounded-full px-3 py-2"
                  style={{
                    backgroundColor:
                      reason === item
                        ? colors.danger
                        : resolvedTheme === "dark"
                        ? colors.background
                        : "#F3F4F6",
                  }}
                >
                  <Text
                    className="text-xs font-medium"
                    style={{ color: reason === item ? "#FFFFFF" : colors.text }}
                  >
                    {item.replaceAll("_", " ")}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <Text className="mb-2 text-sm font-medium" style={{ color: colors.text }}>
            Extra details
          </Text>

          <TextInput
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholder="Explain what happened..."
            placeholderTextColor={colors.muted}
            className="min-h-[110px] rounded-2xl border px-4 py-3"
            style={{
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: colors.surface,
            }}
          />

          <View className="mt-5 flex-row justify-end gap-3">
            <Pressable
              onPress={onClose}
              disabled={submitting}
              className="rounded-2xl border px-4 py-3"
              style={{ borderColor: colors.border }}
            >
              <Text className="text-sm font-medium" style={{ color: colors.text }}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSubmit}
              disabled={submitting || !targetId}
              className="rounded-2xl px-4 py-3"
              style={{
                backgroundColor: submitting ? "rgba(239,68,68,0.5)" : colors.danger,
              }}
            >
              <Text className="text-sm font-medium text-white">
                {submitting ? "Submitting..." : "Submit Report"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}