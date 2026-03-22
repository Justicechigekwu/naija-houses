"use client";

import { useState } from "react";
import api from "@/libs/api";

type SubmitReportPayload = {
  targetType: "USER" | "LISTING";
  targetId: string;
  reason: string;
  message?: string;
};

export default function useSubmitReport() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReport = async ({
    targetType,
    targetId,
    reason,
    message,
  }: SubmitReportPayload) => {
    try {
      setIsSubmitting(true);

      const endpoint =
        targetType === "USER"
          ? `/reports/users/${targetId}`
          : `/reports/listings/${targetId}`;

      const res = await api.post(endpoint, {
        reason,
        message,
      });

      return res.data;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitReport,
    isSubmitting,
  };
}