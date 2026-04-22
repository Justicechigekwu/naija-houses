"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getCookie, setCookie } from "@/libs/browserCookies";

export type DeviceLocation = {
  latitude: number | null;
  longitude: number | null;
  city: string;
  state: string;
  loading: boolean;
  error: string;
  permission: "granted" | "denied" | "prompt" | "unsupported" | "unknown";
};

export type BrowsingLocationMode = "device" | "manual";

export type BrowsingLocationPreference = {
  mode: BrowsingLocationMode;
  latitude: number | null;
  longitude: number | null;
  city: string;
  state: string;
  lastViewedListingType?: "Sale" | "Rent" | "Shortlet" | "";
};

type EffectiveBrowsingLocation = {
  mode: BrowsingLocationMode;
  latitude: number | null;
  longitude: number | null;
  city: string;
  state: string;
  loading: boolean;
  error: string;
  permission: DeviceLocation["permission"];
  lastViewedListingType?: "Sale" | "Rent" | "Shortlet" | "";
  isManual: boolean;
};

type BrowsingLocationContextType = {
  browsingLocation: EffectiveBrowsingLocation;
  deviceLocation: DeviceLocation;
  setManualLocation: (payload: {
    state: string;
    city?: string;
    latitude?: number | null;
    longitude?: number | null;
  }) => void;
  resetToDeviceLocation: () => void;
  setLastViewedListingType: (listingType: "Sale" | "Rent" | "Shortlet" | "") => void;
  cookieConsent: "accepted" | "necessary" | "";
  acceptCookies: () => void;
  acceptNecessaryOnly: () => void;
  hasConsentChoice: boolean;
};

const LOCATION_STORAGE_KEY = "userCurrentLocation_v1";
const LOCATION_PREF_COOKIE = "velora_location_pref";
const COOKIE_CONSENT_COOKIE = "velora_cookie_consent";

const BrowsingLocationContext = createContext<BrowsingLocationContextType | undefined>(
  undefined
);

function readStoredDeviceLocation() {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveStoredDeviceLocation(payload: {
  latitude: number | null;
  longitude: number | null;
  city: string;
  state: string;
}) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(payload));
}

function readPreferenceCookie(): BrowsingLocationPreference | null {
  try {
    const raw = getCookie(LOCATION_PREF_COOKIE);
    if (!raw) return null;
    return JSON.parse(raw) as BrowsingLocationPreference;
  } catch {
    return null;
  }
}

function savePreferenceCookie(pref: BrowsingLocationPreference) {
  const consent = getCookie(COOKIE_CONSENT_COOKIE);
  if (consent !== "accepted") return;

  setCookie(LOCATION_PREF_COOKIE, JSON.stringify(pref), {
    days: 365,
    path: "/",
    sameSite: "Lax",
  });
}

function saveConsentCookie(value: "accepted" | "necessary") {
  setCookie(COOKIE_CONSENT_COOKIE, value, {
    days: 365,
    path: "/",
    sameSite: "Lax",
  });
}

async function reverseGeocode(latitude: number, longitude: number) {
  let city = "";
  let state = "";

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      {
        headers: { Accept: "application/json" },
      }
    );

    if (res.ok) {
      const data = await res.json();
      city =
        data?.address?.city ||
        data?.address?.town ||
        data?.address?.village ||
        data?.address?.county ||
        "";
      state = data?.address?.state || "";
    }
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
  }

  return { city, state };
}

export function BrowsingLocationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cookieConsent, setCookieConsent] = useState<"accepted" | "necessary" | "">("");
  const [manualPreference, setManualPreference] = useState<BrowsingLocationPreference | null>(
    null
  );

  const [deviceLocation, setDeviceLocation] = useState<DeviceLocation>({
    latitude: null,
    longitude: null,
    city: "",
    state: "",
    loading: true,
    error: "",
    permission: "unknown",
  });

  useEffect(() => {
    const savedConsent = getCookie(COOKIE_CONSENT_COOKIE);
    if (savedConsent === "accepted" || savedConsent === "necessary") {
      setCookieConsent(savedConsent);
    }

    const savedPref = readPreferenceCookie();
    if (savedPref) {
      setManualPreference(savedPref);
    }
  }, []);

  useEffect(() => {
    const stored = readStoredDeviceLocation();

    if (stored) {
      setDeviceLocation({
        latitude: stored.latitude ?? null,
        longitude: stored.longitude ?? null,
        city: stored.city ?? "",
        state: stored.state ?? "",
        loading: false,
        error: "",
        permission: "granted",
      });
      return;
    }

    if (!navigator.geolocation) {
      setDeviceLocation({
        latitude: null,
        longitude: null,
        city: "",
        state: "",
        loading: false,
        error: "Geolocation is not supported on this device.",
        permission: "unsupported",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const { city, state } = await reverseGeocode(latitude, longitude);

        saveStoredDeviceLocation({
          latitude,
          longitude,
          city,
          state,
        });

        setDeviceLocation({
          latitude,
          longitude,
          city,
          state,
          loading: false,
          error: "",
          permission: "granted",
        });
      },
      (error) => {
        setDeviceLocation({
          latitude: null,
          longitude: null,
          city: "",
          state: "",
          loading: false,
          error: error.message || "Unable to get your location",
          permission: "denied",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 1000 * 60 * 30,
      }
    );
  }, []);

  const setManualLocation = useCallback(
    (payload: {
      state: string;
      city?: string;
      latitude?: number | null;
      longitude?: number | null;
    }) => {
      const next: BrowsingLocationPreference = {
        mode: "manual",
        state: payload.state,
        city: payload.city || "",
        latitude: payload.latitude ?? null,
        longitude: payload.longitude ?? null,
        lastViewedListingType: manualPreference?.lastViewedListingType || "",
      };

      setManualPreference(next);
      savePreferenceCookie(next);
    },
    [manualPreference?.lastViewedListingType]
  );

  const resetToDeviceLocation = useCallback(() => {
    const next: BrowsingLocationPreference = {
      mode: "device",
      state: deviceLocation.state || "",
      city: deviceLocation.city || "",
      latitude: deviceLocation.latitude,
      longitude: deviceLocation.longitude,
      lastViewedListingType: manualPreference?.lastViewedListingType || "",
    };

    setManualPreference(next);
    savePreferenceCookie(next);
  }, [
    deviceLocation.city,
    deviceLocation.state,
    deviceLocation.latitude,
    deviceLocation.longitude,
    manualPreference?.lastViewedListingType,
  ]);

  const setLastViewedListingType = useCallback(
    (listingType: "Sale" | "Rent" | "Shortlet" | "") => {
      setManualPreference((prev) => {
        const base: BrowsingLocationPreference = prev || {
          mode: "device",
          state: deviceLocation.state || "",
          city: deviceLocation.city || "",
          latitude: deviceLocation.latitude,
          longitude: deviceLocation.longitude,
          lastViewedListingType: "",
        };

        const next = {
          ...base,
          lastViewedListingType: listingType,
        };

        savePreferenceCookie(next);
        return next;
      });
    },
    [
      deviceLocation.city,
      deviceLocation.state,
      deviceLocation.latitude,
      deviceLocation.longitude,
    ]
  );

  const acceptCookies = useCallback(() => {
    saveConsentCookie("accepted");
    setCookieConsent("accepted");

    if (manualPreference) {
      savePreferenceCookie(manualPreference);
    }
  }, [manualPreference]);

  const acceptNecessaryOnly = useCallback(() => {
    saveConsentCookie("necessary");
    setCookieConsent("necessary");
  }, []);

  const browsingLocation = useMemo<EffectiveBrowsingLocation>(() => {
    const mode = manualPreference?.mode || "device";

    if (mode === "manual") {
      return {
        mode: "manual",
        latitude: manualPreference?.latitude ?? null,
        longitude: manualPreference?.longitude ?? null,
        city: manualPreference?.city || "",
        state: manualPreference?.state || "",
        loading: false,
        error: "",
        permission: "granted",
        lastViewedListingType: manualPreference?.lastViewedListingType || "",
        isManual: true,
      };
    }

    return {
      mode: "device",
      latitude: deviceLocation.latitude,
      longitude: deviceLocation.longitude,
      city: deviceLocation.city,
      state: deviceLocation.state,
      loading: deviceLocation.loading,
      error: deviceLocation.error,
      permission: deviceLocation.permission,
      lastViewedListingType: manualPreference?.lastViewedListingType || "",
      isManual: false,
    };
  }, [manualPreference, deviceLocation]);

  const value = useMemo(
    () => ({
      browsingLocation,
      deviceLocation,
      setManualLocation,
      resetToDeviceLocation,
      setLastViewedListingType,
      cookieConsent,
      acceptCookies,
      acceptNecessaryOnly,
      hasConsentChoice: !!cookieConsent,
    }),
    [
      browsingLocation,
      deviceLocation,
      setManualLocation,
      resetToDeviceLocation,
      setLastViewedListingType,
      cookieConsent,
      acceptCookies,
      acceptNecessaryOnly,
    ]
  );

  return (
    <BrowsingLocationContext.Provider value={value}>
      {children}
    </BrowsingLocationContext.Provider>
  );
}

export function useBrowsingLocation() {
  const context = useContext(BrowsingLocationContext);

  if (!context) {
    throw new Error("useBrowsingLocation must be used within BrowsingLocationProvider");
  }

  return context;
}