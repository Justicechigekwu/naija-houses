import { useMemo, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";

import { useTheme } from "@/hooks/useTheme";
import HelpMenuCard from "@/components/help/HelpMenuCard";
import { HELP_ITEMS } from "@/features/help/items";

export default function HelpCenterScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return HELP_ITEMS;

    return HELP_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [search]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof HELP_ITEMS> = {} as any;

    filteredItems.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });

    return groups;
  }, [filteredItems]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="rounded-[28px] px-4 py-5"
          style={{ backgroundColor: colors.brand }}
        >
          <Text className="text-[24px] font-bold text-white">
            Help, Policies & About Velora
          </Text>
          <Text className="mt-2 text-[13px] leading-5 text-white/85">
            Find everything about Velora, including legal pages, marketplace
            rules, safety, support, and platform information.
          </Text>
        </View>

        <View
          className="mt-5 rounded-[24px] border px-4"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}
        >
          <View
            className="my-4 min-h-[52px] flex-row items-center rounded-2xl border px-4"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.background,
            }}
          >
            <Search size={16} color={colors.muted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search policies, help, about..."
              placeholderTextColor={colors.muted}
              className="ml-2 flex-1 py-4 text-[15px]"
              style={{ color: colors.text }}
            />
          </View>
        </View>

        <View className="mt-5">
          {Object.entries(groupedItems).map(([group, items]) => (
            <View key={group} className="mb-5">
              <Text
                className="mb-3 text-[12px] font-semibold uppercase tracking-wide"
                style={{ color: colors.muted }}
              >
                {group}
              </Text>

              {items.map((item) => (
                <HelpMenuCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                  onPress={() => router.push(item.route as any)}
                />
              ))}
            </View>
          ))}

          {filteredItems.length === 0 ? (
            <View
              className="rounded-[22px] border border-dashed p-4"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <Text className="text-[14px]" style={{ color: colors.muted }}>
                No result found for your search.
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}