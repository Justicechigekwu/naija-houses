"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import adminApi from "@/libs/adminApi";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useUI } from "@/hooks/useUi";
import useAdminPaymentsSocket from "@/hooks/useAdminPaymentsSocket";

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
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  listing?: {
    _id?: string;
    title?: string;
    publishStatus?: string;
    createdAt?: string;
    category?: string;
    subcategory?: string;
  };
};

export default function AdminPaymentsPage() {
  const router = useRouter();
  const { admin, isHydrated } = useAdminAuth();
  const { showToast } = useUI();

  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await adminApi.get("/admin/payments/pending");
      setRows(res.data || []);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        const message = e.response?.data?.message || "Failed to load payments";
        setErr(message);
        showToast(message, "error");
      } else {
        setErr("Failed to load payments");
        showToast("Failed to load payments", "error");
      }
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!isHydrated) return;

    if (!admin) {
      router.replace("/admin/login");
      return;
    }

    load();
  }, [admin, isHydrated, router, load]);

  useAdminPaymentsSocket(() => {
    load();
  });

  const openDetails = (paymentId: string) => {
    router.push(`/admin/payments/${paymentId}`);
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
    return <div className="max-w-6xl mx-auto mt-8 px-4">Checking admin session...</div>;
  }

  if (!admin) return null;

  return (
    <div className="max-w-6xl mx-auto bg-[#F5F5F5] mt-8 px-4 pb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Pending Payments</h1>
        <button
          className="border px-3 py-2 rounded"
          onClick={() => router.push("/admin/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

      {err && (
        <div className="p-3 mb-3 rounded bg-red-50 text-red-700 text-sm">
          {err}
        </div>
      )}

      {loading && <div className="text-sm text-gray-600">Loading...</div>}

      {!loading && (
        <div className="bg-white border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Listing</th>
                <th className="text-left p-3">Assigned Bank</th>
                <th className="text-left p-3">Expires</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Payment Code</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr
                  key={p._id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => openDetails(p._id)}
                >
                  <td className="p-3">
                    <div className="font-medium">
                      {p.user?.firstName} {p.user?.lastName}
                    </div>
                    <div className="text-gray-600">{p.user?.email}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-medium">{p.listing?.title || "-"}</div>
                    <div className="text-gray-600">{p.listing?.publishStatus || "-"}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-medium">{p.assignedBank?.bankName || "-"}</div>
                    <div className="text-gray-600">{p.assignedBank?.accountName || "-"}</div>
                    <div className="text-gray-600">{p.assignedBank?.accountNumber || "-"}</div>
                  </td>

                  <td className="p-3">
                    {p.accountExpiresAt
                      ? new Date(p.accountExpiresAt).toLocaleString()
                      : "-"}
                  </td>

                  <td className="p-3">₦{Number(p.amount || 0).toLocaleString()}</td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{p.paymentCode || "-"}</span>
                      {p.paymentCode && (
                        <button
                          type="button"
                          className="border px-2 py-1 rounded text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            copy(p.paymentCode!);
                          }}
                        >
                          Copy
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="p-3">
                    <button
                      type="button"
                      className="border px-3 py-2 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetails(p._id);
                      }}
                    >
                      View details
                    </button>
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