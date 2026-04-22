import { api } from "@/libs/api";

export async function registerPushToken(token: string) {
  const response = await api.post(
    "/notifications/push-token",
    { token },
    {
      headers: {
        "x-client-type": "mobile",
      },
    }
  );

  return response.data;
}

export async function unregisterPushToken(token: string) {
  const response = await api.delete("/notifications/push-token", {
    data: { token },
    headers: {
      "x-client-type": "mobile",
    },
  });

  return response.data;
}