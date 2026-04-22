import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type BrowsingLocationMode = "device" | "manual";
export type ListingTypePreference = "Sale" | "Rent" | "Shortlet" | "";

type StoredPreference = {
  mode: BrowsingLocationMode;
  latitude: number | null;
  longitude: number | null;
  city: string;
  state: string;
  lastViewedListingType?: ListingTypePreference;
};

type EffectiveBrowsingLocation = {
  mode: BrowsingLocationMode;
  latitude: number | null;
  longitude: number | null;
  city: string;
  state: string;
  loading: boolean;
  error: string;
  permission: "granted" | "denied" | "undetermined" | "unknown";
  isManual: boolean;
  lastViewedListingType: ListingTypePreference;
};

type BrowsingLocationContextType = {
  browsingLocation: EffectiveBrowsingLocation;
  setManualLocation: (payload: {
    state: string;
    city?: string;
    latitude?: number | null;
    longitude?: number | null;
  }) => Promise<void>;
  resetToDeviceLocation: () => Promise<void>;
  setLastViewedListingType: (value: ListingTypePreference) => Promise<void>;
};

const STORAGE_KEY = "velora_browsing_location_v1";

const BrowsingLocationContext = createContext<
  BrowsingLocationContextType | undefined
>(undefined);

async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<{ city: string; state: string }> {
  try {
    const result = await Location.reverseGeocodeAsync({ latitude, longitude });
    const first = result?.[0];

    return {
      city:
        first?.city ||
        first?.district ||
        first?.subregion ||
        first?.name ||
        "",
      state: first?.region || "",
    };
  } catch {
    return { city: "", state: "" };
  }
}

export function BrowsingLocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preference, setPreference] = useState<StoredPreference>({
    mode: "device",
    latitude: null,
    longitude: null,
    city: "",
    state: "",
    lastViewedListingType: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [permission, setPermission] = useState<
    "granted" | "denied" | "undetermined" | "unknown"
  >("unknown");

  const savePreference = useCallback(async (next: StoredPreference) => {
    setPreference(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const loadDeviceLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const perm = await Location.requestForegroundPermissionsAsync();

      if (perm.status === "granted") {
        setPermission("granted");
      } else if (perm.status === "denied") {
        setPermission("denied");
      } else {
        setPermission("undetermined");
      }

      if (perm.status !== "granted") {
        setLoading(false);
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;
      const geo = await reverseGeocode(latitude, longitude);

      const next: StoredPreference = {
        mode: "device",
        latitude,
        longitude,
        city: geo.city,
        state: geo.state,
        lastViewedListingType: preference.lastViewedListingType || "",
      };

      await savePreference(next);
    } catch (err: any) {
      setError(err?.message || "Failed to get your location.");
    } finally {
      setLoading(false);
    }
  }, [preference.lastViewedListingType, savePreference]);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);

        if (raw) {
          const parsed = JSON.parse(raw) as StoredPreference;
          setPreference(parsed);

          if (parsed.mode === "manual") {
            setPermission("unknown");
            setLoading(false);
            return;
          }
        }

        await loadDeviceLocation();
      } catch {
        await loadDeviceLocation();
      }
    };

    hydrate();
  }, [loadDeviceLocation]);

  const setManualLocation = useCallback(
    async (payload: {
      state: string;
      city?: string;
      latitude?: number | null;
      longitude?: number | null;
    }) => {
      setPreference((prev) => {
        const next: StoredPreference = {
          mode: "manual",
          state: payload.state,
          city: payload.city || "",
          latitude: payload.latitude ?? null,
          longitude: payload.longitude ?? null,
          lastViewedListingType: prev.lastViewedListingType || "",
        };
  
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
  
      setLoading(false);
      setError("");
    },
    []
  );

  const resetToDeviceLocation = useCallback(async () => {
    await loadDeviceLocation();
  }, [loadDeviceLocation]);

  const setLastViewedListingType = useCallback(
    async (value: ListingTypePreference) => {
      setPreference((prev) => {
        const nextValue = value || "";
  
        if ((prev.lastViewedListingType || "") === nextValue) {
          return prev;
        }
  
        const next: StoredPreference = {
          ...prev,
          lastViewedListingType: nextValue,
        };
  
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    []
  );

  const browsingLocation = useMemo<EffectiveBrowsingLocation>(
    () => ({
      mode: preference.mode,
      latitude: preference.latitude,
      longitude: preference.longitude,
      city: preference.city,
      state: preference.state,
      loading,
      error,
      permission,
      isManual: preference.mode === "manual",
      lastViewedListingType: preference.lastViewedListingType || "",
    }),
    [preference, loading, error, permission]
  );

  return (
    <BrowsingLocationContext.Provider
      value={{
        browsingLocation,
        setManualLocation,
        resetToDeviceLocation,
        setLastViewedListingType,
      }}
    >
      {children}
    </BrowsingLocationContext.Provider>
  );
}

export function useBrowsingLocation() {
  const context = useContext(BrowsingLocationContext);

  if (!context) {
    throw new Error(
      "useBrowsingLocation must be used inside BrowsingLocationProvider"
    );
  }

  return context;
}