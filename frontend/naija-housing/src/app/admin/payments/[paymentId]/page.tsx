"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { FileText, X } from "lucide-react";
import adminApi from "@/libs/adminApi";
import { useUI } from "@/hooks/useUi";
import useAdminPaymentsSocket from "@/hooks/useAdminPaymentsSocket";

type ProofAttachment = {
  url: string;
  public_id: string;
  resource_type?: string;
  originalName?: string;
  uploadedAt?: string;
};

type PaymentDetails = {
  _id: string;
  amount?: number;
  status?: string;
  method?: string;
  reference?: string;
  note?: string;
  createdAt?: string;
  proofAttachments?: ProofAttachment[];
  user?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  listing?: {
    _id?: string;
    slug?: string;
    title?: string;
    category?: string;
    subcategory?: string;
    publishStatus?: string;
    price?: number;
    description?: string;
    location?: string;
    state?: string;
    city?: string;
    images?: { url?: string; public_id?: string }[];
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
  const [actionLoading, setActionLoading] = useState<
    "confirm" | "reject" | "policy" | ""
  >("");
  const [error, setError] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [policyReason, setPolicyReason] = useState("");
  const [violationPolicy, setViolationPolicy] = useState("PROHIBITED_ITEMS");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<ProofAttachment | null>(null);

  const loadPayment = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await adminApi.get(`/admin/payments/${paymentId}`);
      setPayment(res.data);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to load payment");
      } else {
        setError("Failed to load payment");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paymentId) loadPayment();
  }, [paymentId]);

  useAdminPaymentsSocket((payload) => {
    if (payload.paymentId === paymentId) {
      loadPayment();
    }
  });

  const openPreview = (item: ProofAttachment) => {
    setPreviewItem(item);
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
    setPreviewItem(null);
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
          await adminApi.post(`/admin/payments/${paymentId}/confirm`);
          showToast("Payment confirmed and listing published", "success");
          await loadPayment();
        } catch (err: unknown) {
          if (err instanceof AxiosError) {
            showToast(
              err.response?.data?.message || "Failed to confirm payment",
              "error"
            );
          } else {
            showToast("Failed to confirm payment", "error");
          }
        } finally {
          setActionLoading("");
        }
      }
    );
  };

  const handleRejectPayment = () => {
    showConfirm(
      {
        title: "Reject Payment",
        message: "Reject only the payment and send user back to retry payment?",
        confirmText: "Reject Payment",
        cancelText: "Cancel",
        confirmVariant: "danger",
      },
      async () => {
        try {
          setActionLoading("reject");
          await adminApi.post(`/admin/payments/${paymentId}/reject`, {
            reason: rejectReason,
          });
          showToast("Payment rejected", "success");
          await loadPayment();
        } catch (err: unknown) {
          if (err instanceof AxiosError) {
            showToast(
              err.response?.data?.message || "Failed to reject payment",
              "error"
            );
          } else {
            showToast("Failed to reject payment", "error");
          }
        } finally {
          setActionLoading("");
        }
      }
    );
  };

  const handleRejectForPolicy = () => {
    showConfirm(
      {
        title: "Reject for Policy Violation",
        message:
          "Reject the payment and move this listing into moderation / appeal flow?",
        confirmText: "Reject for Policy",
        cancelText: "Cancel",
        confirmVariant: "danger",
      },
      async () => {
        try {
          setActionLoading("policy");
          await adminApi.post(`/admin/payments/${paymentId}/reject-policy`, {
            reason: policyReason,
            violationPolicy,
          });
          showToast("Listing removed for policy violation", "success");
          await loadPayment();
        } catch (err: unknown) {
          if (err instanceof AxiosError) {
            showToast(
              err.response?.data?.message ||
                "Failed to reject for policy violation",
              "error"
            );
          } else {
            showToast("Failed to reject for policy violation", "error");
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
  const proofs = payment.proofAttachments || [];
  const firstImage = payment.listing?.images?.[0]?.url;
  const previewIsPdf =
    previewItem?.resource_type === "raw" ||
    previewItem?.url?.toLowerCase().includes(".pdf");

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 bg-[#F5F5F5] py-6">
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
            <p><strong>Status:</strong> {payment.status || "-"}</p>
            <p><strong>Method:</strong> {payment.method || "-"}</p>
            <p>
              <strong>Amount:</strong>{" "}
              {payment.amount != null ? `₦${Number(payment.amount).toLocaleString()}` : "-"}
            </p>
            <p><strong>Reference:</strong> {payment.reference || "-"}</p>
            <p><strong>Note:</strong> {payment.note || "-"}</p>
            <p>
              <strong>Created:</strong>{" "}
              {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "-"}
            </p>
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
          <h2 className="text-lg font-semibold mb-3">Payment Proof Attachments</h2>

          {proofs.length === 0 ? (
            <p className="text-sm text-gray-500">No proof attachment uploaded.</p>
          ) : (
            <div className="space-y-3">
              {proofs.map((item, index) => {
                const isPdf =
                  item.resource_type === "raw" ||
                  item.url?.toLowerCase().includes(".pdf");

                return (
                  <button
                    key={`${item.public_id}-${index}`}
                    type="button"
                    onClick={() => openPreview(item)}
                    className="w-full flex items-center gap-3 rounded-xl border p-3 hover:bg-gray-50 text-left"
                  >
                    {isPdf ? (
                      <div className="h-14 w-14 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                        <FileText className="h-6 w-6 text-red-500" />
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.originalName || `Proof ${index + 1}`}
                        className="h-14 w-14 rounded-lg object-cover shrink-0"
                      />
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {item.originalName || `Proof ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.uploadedAt
                          ? new Date(item.uploadedAt).toLocaleString()
                          : "Open attachment"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white border rounded-xl p-4 mt-6">
          <h2 className="text-lg font-semibold mb-3">Listing</h2>

          {firstImage && (
            <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src={firstImage}
                alt={payment.listing?.title || "Listing image"}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <p><strong>Title:</strong> {payment.listing?.title || "-"}</p>
          <p><strong>Status:</strong> {payment.listing?.publishStatus || "-"}</p>
          <p><strong>Category:</strong> {payment.listing?.category || "-"}</p>
          <p><strong>Subcategory:</strong> {payment.listing?.subcategory || "-"}</p>
          <p>
            <strong>Location:</strong> {payment.listing?.location || "-"}{" "}
            {payment.listing?.city || ""} {payment.listing?.state || ""}
          </p>
          <p><strong>Description:</strong> {payment.listing?.description || "-"}</p>

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

        <div className="bg-white border rounded-xl p-4 mt-6 space-y-4">
          <button
            className="w-full bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={handleConfirm}
            disabled={actionLoading === "confirm" || !isPending}
          >
            {actionLoading === "confirm" ? "Confirming..." : "Confirm Payment"}
          </button>

          <div className="border rounded-xl p-3">
            <p className="font-medium mb-2">Reject payment only</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 mb-3"
              placeholder="Optional reason for payment rejection..."
              disabled={!isPending || actionLoading !== ""}
            />
            <button
              className="w-full bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={handleRejectPayment}
              disabled={actionLoading === "reject" || !isPending}
            >
              {actionLoading === "reject" ? "Rejecting..." : "Reject Payment"}
            </button>
          </div>

          <div className="border rounded-xl p-3">
            <p className="font-medium mb-2">Reject for policy violation</p>

            <select
              value={violationPolicy}
              onChange={(e) => setViolationPolicy(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-3"
              disabled={!isPending || actionLoading !== ""}
            >
              <option value="PROHIBITED_ITEMS">Prohibited Items</option>
              <option value="COMMUNITY_GUIDELINES">Community Guidelines</option>
              <option value="TERMS">Terms</option>
              <option value="SAFETY">Safety</option>
              <option value="FRAUD">Fraud</option>
              <option value="OTHER">Other</option>
            </select>

            <textarea
              value={policyReason}
              onChange={(e) => setPolicyReason(e.target.value)}
              rows={4}
              className="w-full border rounded-lg px-3 py-2 mb-3"
              placeholder="Reason for policy violation..."
              disabled={!isPending || actionLoading !== ""}
            />

            <button
              className="w-full bg-black text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={handleRejectForPolicy}
              disabled={actionLoading === "policy" || !isPending}
            >
              {actionLoading === "policy"
                ? "Processing..."
                : "Reject for Policy Violation"}
            </button>
          </div>
        </div>
      </div>

      {previewOpen && previewItem && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={closePreview}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-sm text-gray-900">
                  {previewItem.originalName || "Attachment preview"}
                </p>
                <p className="text-xs text-gray-500">
                  {previewItem.uploadedAt
                    ? new Date(previewItem.uploadedAt).toLocaleString()
                    : ""}
                </p>
              </div>

              <button
                type="button"
                onClick={closePreview}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 bg-gray-50 flex items-center justify-center max-h-[calc(90vh-73px)] overflow-auto">
              {previewIsPdf ? (
                <iframe
                  src={previewItem.url}
                  title={previewItem.originalName || "PDF preview"}
                  className="w-full h-[75vh] rounded-lg bg-white"
                />
              ) : (
                <img
                  src={previewItem.url}
                  alt={previewItem.originalName || "Attachment preview"}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}