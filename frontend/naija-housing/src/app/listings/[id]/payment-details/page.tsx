"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import api from "@/libs/api";
import PlanOptions from "@/components/PlanOptions";

type PublishOptions = {
  listingId: string;
  category: string;
  subcategory?: string;
  canUseTrial: boolean;
  trialDays: number;
  paidDays: number;
  price: number;
  publishStatus: string;
  publishPlan: "TRIAL_14_DAYS" | "PAID_30_DAYS" | null;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  } | null;
  activePayment: {
    id: string;
    paymentCode: string;
    status: string;
    amount: number;
    accountAssignedAt: string;
    accountExpiresAt: string;
    isAccountActive: boolean;
  } | null;
};

type PaymentMethodsRes = {
  recommended: "BANK_TRANSFER" | "PAYSTACK" | "FLUTTERWAVE" | "CARD";
  methods: { key: string; label: string }[];
};

export default function PaymentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const params = useSearchParams();
  const queryPaymentCode = params.get("code");

  const [opts, setOpts] = useState<PublishOptions | null>(null);
  const [methods, setMethods] = useState<PaymentMethodsRes | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");

  const bank = useMemo(() => {
    return opts?.bankDetails || null;
  }, [opts]);

  const paymentCode = queryPaymentCode || opts?.activePayment?.paymentCode || "";
  const price = opts?.price ?? 0;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [optsRes, methodsRes] = await Promise.all([
          api.get(`/listings/${id}/publish-options`),
          api.get(`/payments/methods`),
        ]);

        setOpts(optsRes.data);
        setMethods(methodsRes.data);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load payment details");
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch {
      alert("Copy failed. Please copy manually.");
    }
  };

  const notify = async () => {
    try {
      setSubmitting(true);
      setError(null);

      if (!opts) throw new Error("Missing listing payment options");

      if (opts.publishPlan !== "PAID_30_DAYS") {
        setError("This listing is not set to paid publishing.");
        return;
      }

      if (!["DRAFT", "REJECTED"].includes(opts.publishStatus)) {
        setError(`You can't submit payment while listing is ${opts.publishStatus}`);
        return;
      }

      if (!price || price <= 0) {
        setError("Publish price is missing. Please contact support/admin.");
        return;
      }

      await api.post("/payments/notify", {
        listingId: id,
        method: "BANK_TRANSFER",
        reference,
        note,
      });

      alert("Payment submitted! Waiting for admin confirmation.");
      router.push("/pending");
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to submit payment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PlanOptions
      title="Payment Details"
      subtitle="Bank transfer is recommended. After you pay, click “I have made payment”."
    >
      {loading && <div className="text-sm text-gray-600">Loading...</div>}
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {!loading && opts && (
        <div className="space-y-5">
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Publish Fee</h2>
                <p className="mt-1 text-sm text-gray-600">
                  ₦<span className="font-semibold">{price.toLocaleString()}</span> for{" "}
                  {opts.paidDays} days.
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Status: <span className="font-medium">{opts.publishStatus}</span>
                </p>
              </div>

              <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
                Paid Plan
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Recommended method</h2>
              <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white">
                {methods?.recommended === "BANK_TRANSFER" ? "Bank Transfer" : methods?.recommended}
              </span>
            </div>

            {!bank ? (
              <div className="mt-3 text-sm text-gray-600">No bank details available.</div>
            ) : (
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-gray-500">Bank</div>
                    <div className="font-medium text-gray-900">{bank.bankName}</div>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border px-3 py-2 text-xs"
                    onClick={() => copy(bank.bankName)}
                  >
                    Copy
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-gray-500">Account Name</div>
                    <div className="font-medium text-gray-900">{bank.accountName}</div>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border px-3 py-2 text-xs"
                    onClick={() => copy(bank.accountName)}
                  >
                    Copy
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-gray-500">Account Number</div>
                    <div className="font-medium text-gray-900">{bank.accountNumber}</div>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border px-3 py-2 text-xs"
                    onClick={() => copy(bank.accountNumber)}
                  >
                    Copy
                  </button>
                </div>

                {paymentCode && (
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-gray-500">Narration / Reference</div>
                      <div className="font-semibold text-gray-900">{paymentCode}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Put this in your bank transfer narration for fast payment verification.
                      </div>
                    </div>

                    <button
                      type="button"
                      className="rounded-lg border px-3 py-2 text-xs"
                      onClick={() => copy(paymentCode)}
                    >
                      Copy
                    </button>
                  </div>
                )}

                <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                  After you transfer, enter a reference optional and click <b>I have made payment</b>.
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Transfer reference optional
              </label>
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. bank narration / transaction ref"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">Note optional</label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any extra info for admin"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              disabled={submitting}
              onClick={notify}
              className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "I have made payment"}
            </button>

            <button
              type="button"
              className="w-full rounded-lg border px-4 py-2.5 text-sm font-medium"
              onClick={() => router.push(`/listings/${id}/payment`)}
            >
              Back to plan selection
            </button>
          </div>
        </div>
      )}
    </PlanOptions>
  );
}