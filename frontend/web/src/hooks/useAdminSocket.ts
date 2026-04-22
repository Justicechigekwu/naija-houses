"use client";

import { useEffect } from "react";
import { connectSocket } from "@/libs/socket";

export type AdminRealtimePayload = {
  type?: string;
  updatedAt?: string;
  paymentId?: string;
  reportId?: string;
  listingId?: string;
  userId?: string;
  supportId?: string;
  status?: string;
  paymentStatus?: string;
  publishStatus?: string;
  appealStatus?: string;
};

type Props = {
  onPaymentsUpdated?: (payload: AdminRealtimePayload) => void;
  onReportsUpdated?: (payload: AdminRealtimePayload) => void;
  onAppealsUpdated?: (payload: AdminRealtimePayload) => void;
  onSupportUpdated?: (payload: AdminRealtimePayload) => void;
  onUsersUpdated?: (payload: AdminRealtimePayload) => void;
  onOverviewUpdated?: (payload: AdminRealtimePayload) => void;
  onBadgesUpdated?: (payload: Record<string, number | string>) => void;
  onUnauthorized?: () => void;
};

export default function useAdminSocket({
  onPaymentsUpdated,
  onReportsUpdated,
  onAppealsUpdated,
  onSupportUpdated,
  onUsersUpdated,
  onOverviewUpdated,
  onBadgesUpdated,
  onUnauthorized,
}: Props) {
  useEffect(() => {
    const socket = connectSocket();

    const handlePaymentsUpdated = (payload: AdminRealtimePayload) =>
      onPaymentsUpdated?.(payload);

    const handleReportsUpdated = (payload: AdminRealtimePayload) =>
      onReportsUpdated?.(payload);

    const handleAppealsUpdated = (payload: AdminRealtimePayload) =>
      onAppealsUpdated?.(payload);

    const handleSupportUpdated = (payload: AdminRealtimePayload) =>
      onSupportUpdated?.(payload);

    const handleUsersUpdated = (payload: AdminRealtimePayload) =>
      onUsersUpdated?.(payload);

    const handleOverviewUpdated = (payload: AdminRealtimePayload) =>
      onOverviewUpdated?.(payload);

    const handleBadgesUpdated = (payload: Record<string, number | string>) =>
      onBadgesUpdated?.(payload);

    const handleConnectError = (error: Error) => {
      if (
        error?.message?.includes("Unauthorized") ||
        error?.message?.includes("invalid token")
      ) {
        onUnauthorized?.();
      }
    };

    socket.on("admin:payments-updated", handlePaymentsUpdated);
    socket.on("admin:reports-updated", handleReportsUpdated);
    socket.on("admin:appeals-updated", handleAppealsUpdated);
    socket.on("admin:support-updated", handleSupportUpdated);
    socket.on("admin:users-updated", handleUsersUpdated);
    socket.on("admin:overview-updated", handleOverviewUpdated);
    socket.on("admin:badges-updated", handleBadgesUpdated);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("admin:payments-updated", handlePaymentsUpdated);
      socket.off("admin:reports-updated", handleReportsUpdated);
      socket.off("admin:appeals-updated", handleAppealsUpdated);
      socket.off("admin:support-updated", handleSupportUpdated);
      socket.off("admin:users-updated", handleUsersUpdated);
      socket.off("admin:overview-updated", handleOverviewUpdated);
      socket.off("admin:badges-updated", handleBadgesUpdated);
      socket.off("connect_error", handleConnectError);
    };
  }, [
    onPaymentsUpdated,
    onReportsUpdated,
    onAppealsUpdated,
    onSupportUpdated,
    onUsersUpdated,
    onOverviewUpdated,
    onBadgesUpdated,
    onUnauthorized,
  ]);
}