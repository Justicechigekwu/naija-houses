import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Check, ChevronDown, Search, X } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";

type Option = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  label?: string;
};

const FOCUS_RING_COLOR = "#8A715D";

export default function SearchableSelectMobile({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  error = false,
  label,
}: Props) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, query]);

  const ringColor = error ? colors.danger : FOCUS_RING_COLOR;

  return (
    <View className="mb-4">
      {label ? (
        <Text className="mb-2 text-[14px] font-medium" style={{ color: colors.text }}>
          {label}
        </Text>
      ) : null}

      <Pressable
        disabled={disabled}
        onPress={() => {
          if (!disabled) setOpen(true);
        }}
        className="flex h-14 w-full flex-row items-center justify-between rounded-xl border px-4"
        style={{
          borderColor: error ? colors.danger : colors.border,
          backgroundColor: disabled ? colors.background : colors.surface,
          opacity: disabled ? 0.7 : 1,
        }}
      >
        <View
          pointerEvents="none"
          className="absolute inset-0 rounded-xl"
          style={{
            borderWidth: open ? 2 : 0,
            borderColor: ringColor,
          }}
        />

        <Text style={{ color: selectedOption ? colors.text : colors.muted }}>
          {selectedOption?.label || placeholder}
        </Text>

        <ChevronDown size={18} color={colors.muted} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setOpen(false);
          setQuery("");
        }}
      >
        <View className="flex-1 bg-black/30 px-4 py-10">
          <View
            className="mt-10 flex-1 overflow-hidden rounded-3xl"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="border-b p-4" style={{ borderColor: colors.border }}>
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold" style={{ color: colors.text }}>
                  {label || placeholder}
                </Text>

                <Pressable
                  onPress={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <X size={20} color={colors.muted} />
                </Pressable>
              </View>

              <View
                className="mt-4 flex-row items-center rounded-xl border px-3"
                style={{ borderColor: colors.border }}
              >
                <Search size={16} color={colors.muted} />
                <TextInput
                  autoFocus
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search..."
                  placeholderTextColor={colors.muted}
                  className="ml-2 h-11 flex-1"
                  style={{ color: colors.text }}
                />
                {query ? (
                  <Pressable onPress={() => setQuery("")}>
                    <X size={16} color={colors.muted} />
                  </Pressable>
                ) : null}
              </View>
            </View>

            <ScrollView
              className="flex-1"
              contentContainerStyle={{ padding: 8 }}
              keyboardShouldPersistTaps="handled"
            >
              {filteredOptions.length === 0 ? (
                <View className="px-3 py-4">
                  <Text className="text-sm" style={{ color: colors.muted }}>
                    No result found
                  </Text>
                </View>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = option.value === value;

                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => {
                        onChange(option.value);
                        setOpen(false);
                        setQuery("");
                      }}
                      className="mb-1 flex-row items-center justify-between rounded-xl px-3 py-3"
                      style={{
                        backgroundColor: isSelected
                          ? "rgba(138,113,93,0.1)"
                          : colors.surface,
                      }}
                    >
                      <Text
                        style={{
                          color: isSelected ? colors.brand : colors.text,
                        }}
                      >
                        {option.label}
                      </Text>
                      {isSelected ? <Check size={16} color={colors.brand} /> : null}
                    </Pressable>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}