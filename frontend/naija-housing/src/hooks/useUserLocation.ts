// "use client";

// import { useEffect, useState } from "react";

// export type UserLocation = {
//   latitude: number | null;
//   longitude: number | null;
//   city: string;
//   state: string;
//   loading: boolean;
//   error: string;
//   permission: "granted" | "denied" | "prompt" | "unsupported" | "unknown";
// };

// const STORAGE_KEY = "userCurrentLocation_v1";

// export default function useUserLocation() {
//   const [location, setLocation] = useState<UserLocation>({
//     latitude: null,
//     longitude: null,
//     city: "",
//     state: "",
//     loading: true,
//     error: "",
//     permission: "unknown",
//   });

//   useEffect(() => {
//     const stored =
//       typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;

//     if (stored) {
//       try {
//         const parsed = JSON.parse(stored);
//         setLocation({
//           latitude: parsed.latitude ?? null,
//           longitude: parsed.longitude ?? null,
//           city: parsed.city ?? "",
//           state: parsed.state ?? "",
//           loading: false,
//           error: "",
//           permission: "granted",
//         });
//         return;
//       } catch {
//         localStorage.removeItem(STORAGE_KEY);
//       }
//     }

//     if (!navigator.geolocation) {
//       setLocation((prev) => ({
//         ...prev,
//         loading: false,
//         permission: "unsupported",
//         error: "Geolocation is not supported on this device.",
//       }));
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const latitude = position.coords.latitude;
//         const longitude = position.coords.longitude;

//         let city = "";
//         let state = "";

//         try {
//           const res = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
//             {
//               headers: {
//                 Accept: "application/json",
//               },
//             }
//           );

//           if (res.ok) {
//             const data = await res.json();
//             city =
//               data?.address?.city ||
//               data?.address?.town ||
//               data?.address?.village ||
//               "";
//             state = data?.address?.state || "";
//           }
//         } catch (error) {
//           console.error("Reverse geocoding failed", error);
//         }

//         const payload = { latitude, longitude, city, state };
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

//         setLocation({
//           latitude,
//           longitude,
//           city,
//           state,
//           loading: false,
//           error: "",
//           permission: "granted",
//         });
//       },
//       (error) => {
//         setLocation((prev) => ({
//           ...prev,
//           loading: false,
//           permission: "denied",
//           error: error.message || "Unable to get your location",
//         }));
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 12000,
//         maximumAge: 1000 * 60 * 30,
//       }
//     );
//   }, []);

//   return location;
// }








"use client";

import { useEffect, useState } from "react";

export type UserLocation = {
  latitude: number | null;
  longitude: number | null;
  city: string;
  state: string;
  loading: boolean;
  error: string;
  permission: "granted" | "denied" | "prompt" | "unsupported" | "unknown";
};

const STORAGE_KEY = "userCurrentLocation_v1";

export default function useUserLocation() {
  const [location, setLocation] = useState<UserLocation>({
    latitude: null,
    longitude: null,
    city: "",
    state: "",
    loading: true,
    error: "",
    permission: "unknown",
  });

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLocation({
          latitude: parsed.latitude ?? null,
          longitude: parsed.longitude ?? null,
          city: parsed.city ?? "",
          state: parsed.state ?? "",
          loading: false,
          error: "",
          permission: "granted",
        });
        return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        loading: false,
        permission: "unsupported",
        error: "Geolocation is not supported on this device.",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        let city = "";
        let state = "";

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (res.ok) {
            const data = await res.json();
            city =
              data?.address?.city ||
              data?.address?.town ||
              data?.address?.village ||
              "";
            state = data?.address?.state || "";
          }
        } catch (error) {
          console.error("Reverse geocoding failed", error);
        }

        const payload = { latitude, longitude, city, state };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

        setLocation({
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
        setLocation((prev) => ({
          ...prev,
          loading: false,
          permission: "denied",
          error: error.message || "Unable to get your location",
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 1000 * 60 * 30,
      }
    );
  }, []);

  return location;
}