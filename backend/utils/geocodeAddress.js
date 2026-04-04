import axios from "axios";

export const geocodeAddress = async ({ city = "", state = "" }) => {
  const query = [city, state, "Nigeria"].filter(Boolean).join(", ");

  if (!query.trim()) return null;

  const response = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
      q: query,
      format: "jsonv2",
      limit: 1,
      countrycodes: "ng",
    },
    headers: {
      "User-Agent": "Velora/1.0",
    },
    timeout: 10000,
  });

  const first = response.data?.[0];
  if (!first) return null;

  const lat = Number(first.lat);
  const lng = Number(first.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return {
    type: "Point",
    coordinates: [lng, lat],
  };
};