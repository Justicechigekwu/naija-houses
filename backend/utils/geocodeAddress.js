import axios from "axios";

export const geocodeAddress = async ({ location = "", city = "", state = "" }) => {
  const query = [location, city, state, "Nigeria"].filter(Boolean).join(", ");

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


// Production note:
  // Replace this with Google Maps, Mapbox, or LocationIQ in production.
  // Nominatim is okay for development/small usage but not best for high traffic.