"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import adminApi from "@/libs/adminApi";

export type AdminSupportRow = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  reason: string;
  message: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
  readAt?: string | null;
  repliedAt?: string | null;
  adminReplyNote?: string;
};

export default function useAdminSupportMessages() {
  const [messages, setMessages] = useState<AdminSupportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await adminApi.get("/admin/support");
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to load support messages");
      } else {
        setError("Failed to load support messages");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    supportId: string,
    status: "NEW" | "IN_PROGRESS" | "RESOLVED",
    adminReplyNote = ""
  ) => {
    const res = await adminApi.patch(`/admin/support/${supportId}`, {
      status,
      adminReplyNote,
    });

    setMessages((prev) =>
      prev.map((item) =>
        item._id === supportId ? { ...item, ...res.data.supportMessage } : item
      )
    );
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return {
    messages,
    loading,
    error,
    updateStatus,
    reload: loadMessages,
  };
}