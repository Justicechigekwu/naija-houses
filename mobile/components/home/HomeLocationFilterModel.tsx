import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { ChevronLeft, Search, X } from "lucide-react-native";
import { NIGERIA_LOCATIONS } from "@/libs/nigeriaLocation";
import { useTheme } from "@/hooks/useTheme";

type Props = {
  visible: boolean;
  selectedState: string;
  selectedCity: string;
  onClose: () => void;
  onApply: (payload: { state: string; city: string }) => void;
  onClear: () => void;
};

type GlobalLocationItem =
  | {
      type: "state";
      state: string;
      label: string;
    }
  | {
      type: "city";
      state: string;
      city: string;
      label: string;
    };

const NIGERIA_STATES = Object.keys(NIGERIA_LOCATIONS);

function getCitiesByState(state: string) {
  return NIGERIA_LOCATIONS[state] || [];
}

export default function HomeLocationFilterModal({
  visible,
  selectedState,
  selectedCity,
  onClose,
  onApply,
  onClear,
}: Props) {
  const { colors } = useTheme();
  const [search, setSearch] = useState("");
  const [tempState, setTempState] = useState(selectedState || "");
  const [tempCity, setTempCity] = useState(selectedCity || "");
  const [view, setView] = useState<"states" | "cities">(
    selectedState ? "cities" : "states"
  );

  useEffect(() => {
    if (visible) {
      setTempState(selectedState || "");
      setTempCity(selectedCity || "");
      setSearch("");
      setView(selectedState ? "cities" : "states");
    }
  }, [visible, selectedState, selectedCity]);

  const globalLocations = useMemo<GlobalLocationItem[]>(() => {
    const items: GlobalLocationItem[] = [];

    for (const state of NIGERIA_STATES) {
      items.push({
        type: "state",
        state,
        label: state,
      });

      const cities = getCitiesByState(state);

      for (const city of cities) {
        items.push({
          type: "city",
          state,
          city,
          label: `${city}, ${state}`,
        });
      }
    }

    return items;
  }, []);

  const filteredStates = useMemo(() => {
    if (!search.trim()) return NIGERIA_STATES;

    return NIGERIA_STATES.filter((state) =>
      state.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const filteredCities = useMemo(() => {
    if (!tempState) return [];

    const cities = getCitiesByState(tempState);

    if (!search.trim()) return cities;

    return cities.filter((city) =>
      city.toLowerCase().includes(search.toLowerCase())
    );
  }, [tempState, search]);

  const globalSearchResults = useMemo(() => {
    if (!search.trim()) return [];

    const value = search.trim().toLowerCase();

    return globalLocations.filter((item) =>
      item.label.toLowerCase().includes(value)
    );
  }, [search, globalLocations]);

  const handleApply = () => {
    onApply({
      state: tempState,
      city: tempCity,
    });
    onClose();
  };

  const handleClear = () => {
    setTempState("");
    setTempCity("");
    setSearch("");
    setView("states");
    onClear();
    onClose();
  };

  const handleSelectState = (state: string) => {
    setTempState(state);
    setTempCity("");
    setSearch("");
    setView("cities");
  };

  const handleSelectGlobalResult = (item: GlobalLocationItem) => {
    if (item.type === "state") {
      setTempState(item.state);
      setTempCity("");
      setSearch("");
      setView("cities");
      return;
    }

    setTempState(item.state);
    setTempCity(item.city);
    setSearch("");
    onApply({
      state: item.state,
      city: item.city,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1" style={{ backgroundColor: colors.surface }}>
        <View
          className="flex-row items-center justify-between border-b px-4 py-4"
          style={{ borderColor: colors.border }}
        >
          <Pressable onPress={onClose} className="h-10 w-10 items-center justify-center">
            <X size={20} color={colors.text} />
          </Pressable>

          <Text className="text-[17px] font-semibold" style={{ color: colors.text }}>
            Filter by location
          </Text>

          <View className="w-10" />
        </View>

        <View className="border-b px-4 py-3" style={{ borderColor: colors.border }}>
          <View
            className="flex-row items-center rounded-2xl border px-4"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <Search size={18} color={colors.muted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search state or city"
              placeholderTextColor={colors.muted}
              className="ml-3 flex-1 py-4 text-[15px]"
              style={{ color: colors.text }}
            />
          </View>
        </View>

        {search.trim() ? (
          <ScrollView className="flex-1 px-4 py-3" showsVerticalScrollIndicator={false}>
            {globalSearchResults.length ? (
              globalSearchResults.map((item) => (
                <Pressable
                  key={item.label}
                  onPress={() => handleSelectGlobalResult(item)}
                  className="border-b py-4"
                  style={{ borderColor: colors.border }}
                >
                  <Text className="text-[15px]" style={{ color: colors.text }}>
                    {item.label}
                  </Text>
                </Pressable>
              ))
            ) : (
              <Text className="py-4 text-center" style={{ color: colors.muted }}>
                No matching location found.
              </Text>
            )}
          </ScrollView>
        ) : (
          <>
            {view === "cities" ? (
              <View className="px-4 pt-3">
                <Pressable
                  onPress={() => {
                    setView("states");
                    setSearch("");
                  }}
                  className="mb-3 flex-row items-center"
                >
                  <ChevronLeft size={18} color={colors.text} />
                  <Text className="ml-1 text-[14px] font-medium" style={{ color: colors.text }}>
                    Back to states
                  </Text>
                </Pressable>
              </View>
            ) : null}

            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
              {view === "states"
                ? filteredStates.map((state) => (
                    <Pressable
                      key={state}
                      onPress={() => handleSelectState(state)}
                      className="border-b py-4"
                      style={{ borderColor: colors.border }}
                    >
                      <Text className="text-[15px]" style={{ color: colors.text }}>
                        {state}
                      </Text>
                    </Pressable>
                  ))
                : filteredCities.map((city) => (
                    <Pressable
                      key={`${tempState}-${city}`}
                      onPress={() => setTempCity(city)}
                      className="flex-row items-center justify-between border-b py-4"
                      style={{ borderColor: colors.border }}
                    >
                      <Text className="text-[15px]" style={{ color: colors.text }}>
                        {city}
                      </Text>
                      <View
                        className="h-5 w-5 rounded-full border"
                        style={{
                          borderColor:
                            tempCity === city ? colors.brand : colors.border,
                          backgroundColor:
                            tempCity === city ? colors.brand : colors.surface,
                        }}
                      />
                    </Pressable>
                  ))}
            </ScrollView>
          </>
        )}

        <View className="border-t px-4 py-4" style={{ borderColor: colors.border }}>
          <View className="flex-row gap-3">
            <Pressable
              onPress={handleClear}
              className="flex-1 items-center rounded-2xl border py-4"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <Text className="font-semibold" style={{ color: colors.text }}>
                Use device location
              </Text>
            </Pressable>

            <Pressable
              onPress={handleApply}
              disabled={!tempState}
              className="flex-1 items-center rounded-2xl py-4"
              style={{
                backgroundColor: tempState ? colors.brand : colors.border,
              }}
            >
              <Text className="font-semibold text-white">Apply</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}