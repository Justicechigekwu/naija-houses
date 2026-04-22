import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Search, X } from "lucide-react-native";

import useSearchSuggestions from "@/hooks/useSearchSuggestions";
import { useTheme } from "@/hooks/useTheme";

export default function MobileNavbarSearch() {
  const router = useRouter();
  const { colors } = useTheme();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<TextInput | null>(null);

  const { suggestions, loading } = useSearchSuggestions(query);

  useEffect(() => {
    if (!query.trim()) {
      setOpen(false);
      return;
    }

    setOpen(true);
  }, [query]);

  const handleSelect = (item: { _id: string; slug?: string }) => {
    setOpen(false);
    setQuery("");
    Keyboard.dismiss();

    if (item.slug) {
      router.push(`/listings/${item.slug}` as any);
      return;
    }

    router.push(`/listings/${item._id}` as any);
  };

  const handleClear = () => {
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <View className="z-50 px-2 pt-3">
      <View
        className="rounded-full border px-4 py-1"
        style={{
          borderColor: colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <View className="flex-row items-center">
          <Search size={16} color={colors.muted} />

          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            onFocus={() => {
              if (query.trim()) setOpen(true);
            }}
            placeholder="What are you looking for?"
            placeholderTextColor={colors.muted}
            className="ml-2 flex-1 text-[14px]"
            style={{ color: colors.text }}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />

          {query ? (
            <Pressable onPress={handleClear} hitSlop={10}>
              <X size={16} color={colors.muted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {open ? (
        <>
          <Pressable
            onPress={() => setOpen(false)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: -1000,
            }}
          />

          <View
            className="mt-2 overflow-hidden rounded-3xl"
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              maxHeight: 390,
            }}
          >
            <View
              className="border-b px-4 py-4"
              style={{ borderColor: colors.border }}
            >
              <Text
                className="text-lg font-semibold"
                style={{ color: colors.text }}
              >
                Search results
              </Text>
            </View>

            {loading ? (
              <View className="items-center py-8">
                <ActivityIndicator size="small" color={colors.brand} />
              </View>
            ) : suggestions.length === 0 ? (
              <View className="px-4 py-6">
                <Text style={{ color: colors.muted }}>
                  No results found. Perhaps double-check your spellings.
                </Text>
              </View>
            ) : (
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item._id}
                keyboardShouldPersistTaps="always"
                nestedScrollEnabled
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleSelect(item)}
                    className="flex-row items-center gap-3 px-4 py-4"
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    }}
                  >
                    <Image
                      source={{
                        uri:
                          item.images?.[0]?.url ||
                          "https://via.placeholder.com/100x100",
                      }}
                      style={{ width: 44, height: 44, borderRadius: 12 }}
                      contentFit="cover"
                    />

                    <View className="flex-1">
                      <Text
                        numberOfLines={1}
                        className="text-[14px] font-semibold"
                        style={{ color: colors.text }}
                      >
                        {item.title}
                      </Text>
                      <Text
                        numberOfLines={1}
                        className="text-[12px] font-semibold"
                        style={{ color: colors.muted }}
                      >
                        {item.description}
                      </Text>

                      <Text
                        numberOfLines={1}
                        className="mt-1 text-[12px]"
                        style={{ color: colors.muted }}
                      >
                        {[item.city, item.state].filter(Boolean).join(", ")}
                      </Text>
                    </View>
                  </Pressable>
                )}
              />
            )}
          </View>
        </>
      ) : null}
    </View>
  );
}