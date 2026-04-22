import { useBrowsingLocation } from "@/context/BrowsingLocationContext";

export default function useUserLocation() {
  const { browsingLocation } = useBrowsingLocation();

  return {
    latitude: browsingLocation.latitude,
    longitude: browsingLocation.longitude,
    city: browsingLocation.city,
    state: browsingLocation.state,
    loading: browsingLocation.loading,
    error: browsingLocation.error,
    permission: browsingLocation.permission,
    mode: browsingLocation.mode,
    isManual: browsingLocation.isManual,
    lastViewedListingType: browsingLocation.lastViewedListingType,
  };
}