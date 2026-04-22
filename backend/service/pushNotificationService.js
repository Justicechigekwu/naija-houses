import { Expo } from "expo-server-sdk";
import userModel from "../models/userModel.js";

const expo = new Expo();

export const sendPushToUser = async ({
  userId,
  title,
  body,
  data = {},
}) => {
  const user = await userModel.findById(userId).select(
    "pushTokens pushNotificationsEnabled"
  );

  if (!user?.pushNotificationsEnabled) return;
  if (!user?.pushTokens?.length) return;

  const validTokens = user.pushTokens.filter((token) =>
    Expo.isExpoPushToken(token)
  );

  if (!validTokens.length) return;

  const messages = validTokens.map((token) => ({
    to: token,
    sound: "default",
    title,
    body,
    data,
  }));

  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    try {
      const tickets = await expo.sendPushNotificationsAsync(chunk);

      for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];
        const token = chunk[i]?.to;

        if (
          ticket.status === "error" &&
          ticket.details?.error === "DeviceNotRegistered"
        ) {
          await userModel.updateOne(
            { _id: userId },
            { $pull: { pushTokens: token } }
          );
        }
      }
    } catch (error) {
      console.error("Expo push send error:", error);
    }
  }
};