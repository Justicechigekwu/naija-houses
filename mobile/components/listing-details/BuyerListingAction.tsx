import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

const QUICK_MESSAGES = [
  "Is this still available?",
  "What's the last price?",
  "Can I make a half payment?",
];

type Props = {
  onSendMessage: (text: string) => Promise<void>;
  sending?: boolean;
};

export default function BuyerListingActions({
  onSendMessage,
  sending = false,
}: Props) {
  const [message, setMessage] = useState("");
  const { colors } = useTheme();

  const handleSend = async () => {
    const text = message.trim();
    if (!text) return;

    await onSendMessage(text);
    setMessage("");
  };

  const handleQuickMessage = async (text: string) => {
    if (sending) return;
    await onSendMessage(text);
  };

  return (
    <View
      className="mt-6 rounded-2xl border p-4"
      style={{
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      <Text
        className="mb-4 text-lg font-semibold"
        style={{ color: colors.text }}
      >
        Message Owner
      </Text>

      <View className="mb-4 flex-row flex-wrap gap-2">
        {QUICK_MESSAGES.map((item) => (
          <Pressable
            key={item}
            onPress={() => handleQuickMessage(item)}
            className="rounded-full px-3 py-2"
            style={{
              backgroundColor: `${colors.brand}1A`,
            }}
          >
            <Text
              className="text-[12px]"
              style={{ color: colors.brand }}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type your message..."
        placeholderTextColor={colors.muted}
        className="rounded-xl border px-4 py-3"
        style={{
          borderColor: colors.border,
          color: colors.text,
          backgroundColor: colors.surface,
        }}
      />

      <Pressable
        onPress={handleSend}
        disabled={sending || !message.trim()}
        className="mt-3 items-center rounded-xl py-3"
        style={{
          backgroundColor:
            sending || !message.trim() ? colors.border : colors.brand,
        }}
      >
        <Text className="font-semibold text-white">
          {sending ? "Sending..." : "Send"}
        </Text>
      </Pressable>
    </View>
  );
}