import { api } from "@/libs/api";

export type ReportTargetType = "USER" | "LISTING";

export async function submitReport(payload: {
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  message?: string;
}) {
  const { targetType, targetId, reason, message } = payload;

  const endpoint =
    targetType === "USER"
      ? `/reports/users/${targetId}`
      : `/reports/listings/${targetId}`;

  const response = await api.post(endpoint, {
    reason,
    message,
  });

  return response.data;
}