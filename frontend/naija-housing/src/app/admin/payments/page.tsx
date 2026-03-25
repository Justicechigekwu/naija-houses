"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import adminApi from "@/libs/adminApi";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { AxiosError } from "axios";
import { useUI } from "@/hooks/useUi";

type PaymentRow = {
  _id: string;
  paymentCode?: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  accountExpiresAt?: string;
  assignedBank?: {
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
  };
  user?: { firstName?: string; lastName?: string; email?: string };
  listing?: { title?: string; publishStatus?: string; createdAt?: string };
};

export default function AdminPaymentsPage() {
  const router = useRouter();
  const { admin, isHydrated } = useAdminAuth();
  const { showToast, showConfirm } = useUI();

  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await adminApi.get("/admin/payments/pending");
      setRows(res.data);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        setErr(e.response?.data?.message || "Failed to load payments");
        showToast(e.response?.data?.message || "Failed to load payments", "error");
      } else {
        setErr("Failed to load payments");
        showToast("Failed to load payments", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isHydrated) return;

    if (!admin) {
      router.replace("/admin/login");
      return;
    }

    load();
  }, [admin, isHydrated, router]);

  const confirmPayment = (paymentId: string) => {
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
          await adminApi.post(`/admin/payments/${paymentId}/confirm`);
          showToast("Payment confirmed & listing published", "success");
          await load();
        } catch (e) {
          showToast("Failed to confirm payment", "error");
        }
      }
    );
  };

  const reject = (paymentId: string) => {
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
          await adminApi.post(`/admin/payments/${paymentId}/reject`);
          showToast("Payment rejected", "success");
          await load();
        } catch (e) {
          showToast("Failed to reject payment", "error");
        }
      }
    );
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard", "success");
    } catch {
      showToast("Copy failed", "error");
    }
  };

  if (!isHydrated) {
    return <div className="max-w-6xl mx-auto mt-8">Checking admin session...</div>;
  }

  if (!admin) return null;

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Pending Payments</h1>
        <button
          className="border px-3 py-2 rounded"
          onClick={() => router.push("/admin/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

      {err && <div className="p-3 mb-3 rounded bg-red-50 text-red-700 text-sm">{err}</div>}
      {loading && <div className="text-sm text-gray-600">Loading...</div>}

      {!loading && (
        <div className="bg-white border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">User(S)</th>
                <th className="text-left p-3">Listings</th>
                <th className="text-left p-3">Assigned Bank</th>
                <th className="text-left p-3">Expires</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Payment Code</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3">
                    <div className="font-medium">
                      {p.user?.firstName} {p.user?.lastName}
                    </div>
                    <div className="text-gray-600">{p.user?.email}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-medium">{p.listing?.title || "-"}</div>
                    <div className="text-gray-600">{p.listing?.publishStatus}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-medium">{p.assignedBank?.bankName || "-"}</div>
                    <div className="text-gray-600">{p.assignedBank?.accountName || "-"}</div>
                    <div className="text-gray-600">{p.assignedBank?.accountNumber || "-"}</div>
                  </td>

                  <td className="p-3">
                    {p.accountExpiresAt ? new Date(p.accountExpiresAt).toLocaleString() : "-"}
                  </td>

                  <td className="p-3">₦{Number(p.amount).toLocaleString()}</td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{p.paymentCode || "-"}</span>
                      {p.paymentCode && (
                        <button
                          className="border px-2 py-1 rounded text-xs"
                          onClick={() => copy(p.paymentCode!)}
                        >
                          Copy
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        className="bg-green-600 text-white px-3 py-2 rounded"
                        onClick={() => confirmPayment(p._id)}
                      >
                        Confirm
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-2 rounded"
                        onClick={() => reject(p._id)}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td className="p-3" colSpan={7}>
                    No pending payments.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}