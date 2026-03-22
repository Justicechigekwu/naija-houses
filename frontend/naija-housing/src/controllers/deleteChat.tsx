"use client";

import api from "@/libs/api";
import { AxiosError } from "axios";

export default async function deleteChat(chatId: string) {
  try {
    const res = await api.delete(`/chats/${chatId}`);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data?.message || "Failed to delete chat");
    } else if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
}