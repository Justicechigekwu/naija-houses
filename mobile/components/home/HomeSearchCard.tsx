import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";

import { CATEGORY_TREE } from "@/libs/listingFormConfig";
import SearchableSelectMobile from "@/components/listings/SearchableSelectMobile";
import { useTheme } from "@/hooks/useTheme";

export default function HomeSearchCard() {
  const router = useRouter();
  const { colors } = useTheme();
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [search, setSearch] = useState("");

  const categoryOptions = useMemo(() => {
    return Object.entries(CATEGORY_TREE).map(([key, value]) => ({
      value: key,
      label: value.label,
    }));
  }, []);

  const subcategoryOptions = useMemo(() => {
    if (!category) return [];

    const categoryConfig =
      CATEGORY_TREE[category as keyof typeof CATEGORY_TREE];

    if (!categoryConfig?.subcategories) return [];

    return Object.entries(categoryConfig.subcategories).map(([key, value]) => ({
      value: key,
      label: value.label,
    }));
  }, [category]);

  const handleSearch = () => {
    const params: Record<string, string> = {};

    if (category) params.category = category;
    if (subcategory) params.subcategory = subcategory;
    if (search.trim()) params.search = search.trim();

    router.push({
      pathname: "/search",
      params,
    } as any);
  };

  return (
    <View className="rounded-[28px] p-4 bg-transparent">
      <SearchableSelectMobile
        value={category}
        onChange={(value) => {
          setCategory(value);
          setSubcategory("");
        }}
        options={categoryOptions}
        placeholder="Category"
      />

      <SearchableSelectMobile
        value={subcategory}
        onChange={setSubcategory}
        options={subcategoryOptions}
        placeholder="Subcategory"
        disabled={!category}
      />

      <View
        className="mb-4 min-h-[52px] flex-row items-center rounded-2xl border px-4"
        style={{ 
          borderColor: colors.border,
          backgroundColor: colors.surface,
         }}
      >
        <Search size={16} color={colors.muted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Type here!"
          placeholderTextColor={colors.muted}
          className="ml-2 flex-1 py-4 text-[15px]"
          style={{ color: colors.text }}
        />
      </View>

      <Pressable
        onPress={handleSearch}
        className="items-center rounded-2xl py-4"
        style={{ backgroundColor: colors.brand }}
      >
        <Text className="font-semibold text-white">Search</Text>
      </Pressable>
    </View>
  );
}