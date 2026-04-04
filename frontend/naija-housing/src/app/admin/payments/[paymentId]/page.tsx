"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import adminApi from "@/libs/adminApi";
import { useUI } from "@/hooks/useUi";

type PaymentDetails = {
  _id: string;
  amount?: number;
  status?: string;
  method?: string;
  reference?: string;
  note?: string;
  createdAt?: string;
  user?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  listing?: {
    _id: string;
    title?: string;
    category?: string;
    subcategory?: string;
    publishStatus?: string;
    price?: number;
    description?: string;
    location?: string;
    state?: string;
    city?: string;
    owner?: {
      _id: string;
      firstName?: string;
      lastName?: string;
      email?: string;
    };
  };
};

export default function AdminPaymentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params?.paymentId as string;

  const { showToast, showConfirm } = useUI();

  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<"confirm" | "reject" | "">(
    ""
  );
  const [error, setError] = useState("");

  const loadPayment = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await adminApi.get(`/admin/payments/${paymentId}`);
      setPayment(res.data);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const message = err.response?.data?.message || "Failed to load payment";
        setError(message);
      } else {
        setError("Failed to load payment");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!paymentId) return;
    loadPayment();
  }, [paymentId]);

  const syncPaymentState = async (
    nextPaymentStatus: string,
    nextListingStatus?: string
  ) => {
    setPayment((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        status: nextPaymentStatus,
        listing: prev.listing
          ? {
              ...prev.listing,
              publishStatus:
                nextListingStatus ?? prev.listing.publishStatus ?? "-",
            }
          : prev.listing,
      };
    });

    await loadPayment();
  };

  const handleConfirm = () => {
    showConfirm(
      {
        title: "Confirm Payment",
        message: "Confirm this payment and publish listing?",
        confirmText: "Confirm",
        cancelText: "Cancel",
        confirmVariant: "primary",
      },
      async () => {
        try {
          setActionLoading("confirm");
          setError("");

          await adminApi.post(`/admin/payments/${paymentId}/confirm`);

          await syncPaymentState("CONFIRMED", "PUBLISHED");
          showToast("Payment confirmed & listing published", "success");
        } catch (err: unknown) {
          if (err instanceof AxiosError) {
            const message =
              err.response?.data?.message || "Failed to confirm payment";
            setError(message);
            showToast(message, "error");
          } else {
            setError("Failed to confirm payment");
            showToast("Failed to confirm payment", "error");
          }
        } finally {
          setActionLoading("");
        }
      }
    );
  };

  const handleReject = () => {
    showConfirm(
      {
        title: "Reject Payment",
        message: "Are you sure you want to reject this payment?",
        confirmText: "Reject",
        cancelText: "Cancel",
        confirmVariant: "danger",
      },
      async () => {
        try {
          setActionLoading("reject");
          setError("");

          await adminApi.post(`/admin/payments/${paymentId}/reject`);

          await syncPaymentState("REJECTED", "AWAITING_PAYMENT");
          showToast("Payment rejected", "success");
        } catch (err: unknown) {
          if (err instanceof AxiosError) {
            const message =
              err.response?.data?.message || "Failed to reject payment";
            setError(message);
            showToast(message, "error");
          } else {
            setError("Failed to reject payment");
            showToast("Failed to reject payment", "error");
          }
        } finally {
          setActionLoading("");
        }
      }
    );
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto px-4 py-6">Loading payment details...</div>;
  }

  if (!payment) {
    return <div className="max-w-5xl mx-auto px-4 py-6">Payment not found.</div>;
  }

  const isPending = payment.status === "PENDING_CONFIRMATION";

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <button
        className="border px-3 py-2 rounded mb-4"
        onClick={() => router.push("/admin/payments")}
      >
        Back
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3">Payment Details</h2>
          <p>
            <strong>Status:</strong> {payment.status || "-"}
          </p>
          <p>
            <strong>Method:</strong> {payment.method || "-"}
          </p>
          <p>
            <strong>Amount:</strong>{" "}
            {payment.amount != null ? `₦${Number(payment.amount).toLocaleString()}` : "-"}
          </p>
          <p>
            <strong>Reference:</strong> {payment.reference || "-"}
          </p>
          <p>
            <strong>Note:</strong> {payment.note || "-"}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "-"}
          </p>

          <div className="flex gap-3 mt-5">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={handleConfirm}
              disabled={actionLoading === "confirm" || !isPending}
            >
              {actionLoading === "confirm" ? "Confirming..." : "Confirm"}
            </button>

            <button
              className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={handleReject}
              disabled={actionLoading === "reject" || !isPending}
            >
              {actionLoading === "reject" ? "Rejecting..." : "Reject"}
            </button>
          </div>

          {!isPending && (
            <p className="text-sm text-gray-500 mt-3">
              This payment has already been processed.
            </p>
          )}
        </div>

        <div className="bg-white border rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3">User</h2>
          <p>
            {payment.user?.firstName} {payment.user?.lastName}
          </p>
          <p>{payment.user?.email || "-"}</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-4 mt-6">
        <h2 className="text-lg font-semibold mb-3">Listing</h2>
        <p>
          <strong>Title:</strong> {payment.listing?.title || "-"}
        </p>
        <p>
          <strong>Status:</strong> {payment.listing?.publishStatus || "-"}
        </p>
        <p>
          <strong>Category:</strong> {payment.listing?.category || "-"}
        </p>
        <p>
          <strong>Subcategory:</strong> {payment.listing?.subcategory || "-"}
        </p>
        <p>
          <strong>Location:</strong> {payment.listing?.location || "-"}{" "}
          {payment.listing?.city || ""} {payment.listing?.state || ""}
        </p>
        <p>
          <strong>Description:</strong> {payment.listing?.description || "-"}
        </p>

        {payment.listing?._id && (
          <button
            className="border px-4 py-2 rounded mt-4"
            onClick={() =>
              router.push(
                `/admin/listings/${payment.listing?._id}?paymentId=${payment._id}`
              )
            }
          >
            Open full listing details
          </button>
        )}
      </div>
    </div>
  );
}