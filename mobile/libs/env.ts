const API_URL = process.env.EXPO_PUBLIC_API_URL;
const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const SUPPORT_EMAIL = process.env.EXPO_PUBLIC_SUPPORT_EMAIL;

if (!API_URL) {
  throw new Error("Missing EXPO_PUBLIC_API_URL");
}

if (!SOCKET_URL) {
  throw new Error("Missing EXPO_PUBLIC_SOCKET_URL");
}

if (!GOOGLE_WEB_CLIENT_ID) {
  throw new Error("Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID");
}

if (!SUPPORT_EMAIL) {
  throw new Error("Missing EXPO_PUBLIC_SUPPORT_EMAIL");
}

export const env = {
  apiUrl: API_URL,
  socketUrl: SOCKET_URL,
  googleWebClientId: GOOGLE_WEB_CLIENT_ID,
  supportEmail: SUPPORT_EMAIL,
} as const;