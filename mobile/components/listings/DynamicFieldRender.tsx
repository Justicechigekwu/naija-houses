import { Pressable, Text, TextInput, View } from "react-native";
import type { DynamicField, FormValue } from "@/types/listing";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";

type Props = {
  fields: DynamicField[];
  values: Record<string, FormValue>;
  errors?: Record<string, string>;
  onChange: (key: string, value: FormValue) => void;
};

const FOCUS_RING_COLOR = "#8A715D";

export default function DynamicFieldRenderer({
  fields,
  values,
  errors = {},
  onChange,
}: Props) {
  const { colors } = useTheme();

  return (
    <View className="mt-4">
      {fields.map((field) => {
        const value = values[field.key];
        const error = errors[`attributes.${field.key}`];

        if (field.type === "select") {
          return (
            <View key={field.key} className="mb-4">
              <Text
                className="mb-2 text-[14px] font-medium"
                style={{ color: colors.text }}
              >
                {field.label}
              </Text>

              <View className="flex-row flex-wrap gap-2">
                {field.options?.map((option) => {
                  const active = value === option;

                  return (
                    <Pressable
                      key={option}
                      onPress={() => onChange(field.key, option)}
                      className="rounded-full px-4 py-2"
                      style={{
                        backgroundColor: active ? colors.brand : colors.surface,
                        borderWidth: active ? 0 : 1,
                        borderColor: error ? colors.danger : colors.border,
                      }}
                    >
                      <Text
                        className="text-sm"
                        style={{ color: active ? "#FFFFFF" : colors.text }}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {error ? (
                <Text className="mt-2 text-sm" style={{ color: colors.danger }}>
                  {error}
                </Text>
              ) : null}
            </View>
          );
        }

        return (
          <DynamicTextField
            key={field.key}
            field={field}
            value={value}
            error={error}
            onChange={onChange}
            colors={colors}
          />
        );
      })}
    </View>
  );
}

function DynamicTextField({
  field,
  value,
  error,
  onChange,
  colors,
}: {
  field: DynamicField;
  value: FormValue;
  error?: string;
  onChange: (key: string, value: FormValue) => void;
  colors: any;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      <Text
        className="mb-2 text-[14px] font-medium"
        style={{ color: colors.text }}
      >
        {field.label}
      </Text>

      <View
        className={`rounded-2xl border px-4 ${
          field.type === "textarea" ? "min-h-[120px] py-4" : "min-h-[52px]"
        }`}
        style={{
          borderColor: error ? colors.danger : colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <View
          pointerEvents="none"
          className="absolute inset-0 rounded-2xl"
          style={{
            borderWidth: isFocused ? 2 : 0,
            borderColor: error ? colors.danger : FOCUS_RING_COLOR,
          }}
        />

        <TextInput
          value={value !== undefined && value !== null ? String(value) : ""}
          onChangeText={(text) =>
            onChange(
              field.key,
              field.type === "number" ? (text === "" ? "" : text) : text
            )
          }
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={field.label}
          placeholderTextColor={colors.muted}
          keyboardType={field.type === "number" ? "numeric" : "default"}
          multiline={field.type === "textarea"}
          textAlignVertical={field.type === "textarea" ? "top" : "center"}
          className="text-[15px]"
          style={{
            color: colors.text,
            minHeight: field.type === "textarea" ? 96 : 52,
          }}
        />
      </View>

      {error ? (
        <Text className="mt-2 text-sm" style={{ color: colors.danger }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}