// hooks/useAdminPaymentsSocket.ts
"use client";

import { useEffect } from "react";
import { connectSocket } from "@/libs/socket";

export type AdminPaymentsUpdatedPayload = {
  paymentId?: string;
  listingId?: string;
  userId?: string;
  paymentStatus?:
    | "INITIATED"
    | "PENDING_CONFIRMATION"
    | "CONFIRMED"
    | "REJECTED"
    | "EXPIRED";
  publishStatus?:
    | "DRAFT"
    | "AWAITING_PAYMENT"
    | "PENDING_CONFIRMATION"
    | "PUBLISHED"
    | "EXPIRED"
    | "REJECTED"
    | "REMOVED_BY_ADMIN"
    | "APPEAL_PENDING";
  rejectionType?: "PAYMENT" | "PROHIBITED" | string;
  type?:
    | "PAYMENT_SUBMITTED"
    | "PAYMENT_CONFIRMED"
    | "PAYMENT_REJECTED"
    | "PAYMENT_REJECTED_POLICY";
  updatedAt?: string;
};

export default function useAdminPaymentsSocket(
  onPaymentsUpdated?: (payload: AdminPaymentsUpdatedPayload) => void
) {
  useEffect(() => {
    const socket = connectSocket();

    const handlePaymentsUpdated = (payload: AdminPaymentsUpdatedPayload) => {
      onPaymentsUpdated?.(payload);
    };

    socket.on("admin:payments-updated", handlePaymentsUpdated);

    return () => {
      socket.off("admin:payments-updated", handlePaymentsUpdated);
    };
  }, [onPaymentsUpdated]);
}