"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  publishPlan: string;
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

export default function ListingPaymentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [opts, setOpts] = useState<PublishOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<null | "TRIAL_14_DAYS" | "PAID_30_DAYS">(null);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/listings/${id}/publish-options`);
        setOpts(res.data);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load payment options");
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id]);

  useEffect(() => {
    if (!opts?.activePayment?.accountExpiresAt) return;
  
    const interval = setInterval(() => {
      const end = new Date(opts.activePayment!.accountExpiresAt).getTime();
      const now = Date.now();
      const diff = end - now;
  
      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
        return;
      }
  
      const mins = Math.floor(diff / 1000 / 60);
      const secs = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);
    }, 1000);
  
    return () => clearInterval(interval);
  }, [opts?.activePayment?.accountExpiresAt]);

  const choosePlan = async (plan: "TRIAL_14_DAYS" | "PAID_30_DAYS") => {
    try {
      setSubmitting(plan);
      setError(null);

      const res = await api.post(`/listings/${id}/choose-plan`, { plan });

      if (plan === "PAID_30_DAYS") {
        const code = res.data?.payment?.paymentCode;
        router.push(`/listings/${id}/payment-details?code=${encodeURIComponent(code || "")}`);
        return;
      } 

      if (plan === "TRIAL_14_DAYS") {
        router.push(`/listings/${id}`);
        return;
      }

      const optsRes = await api.get(`/listings/${id}/publish-options`);
      setOpts(optsRes.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <PlanOptions
      title="Publish Listing"
      subtitle="Choose a plan to publish this listing. Trials are limited to first-time property publishers."
    >
      {loading && <div className="text-sm text-gray-600">Loading...</div>}
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {!loading && !error && !opts && (
        <div className="text-sm text-gray-600">No options found</div>
      )}

      {opts?.activePayment?.isAccountActive && (
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
          <div className="font-medium">Make payment within 30 minutes</div>
          <div className="mt-1">
            Do not save this account for future use. This account expires in{" "}
            <span className="font-semibold">{timeLeft}</span>.
          </div>
        </div>
      )}

      {opts?.activePayment && !opts.activePayment.isAccountActive && (
        <button
          type="button"
          onClick={() => router.push(`/listings/${id}/payment`)}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white"
        >
          Get New Payment Account
        </button>
      )}

      {opts && (
        <div className="space-y-5">
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900">14-day Free Trial</h2>
                <p className="mt-1 text-sm text-gray-600">
                   Expires after {opts.trialDays} days.
                </p>
              </div>

              <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
                Free
              </span>
            </div>

            <button
              disabled={!opts.canUseTrial || submitting !== null}
              onClick={() => choosePlan("TRIAL_14_DAYS")}
              className="mt-4 w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {opts.canUseTrial
                ? submitting === "TRIAL_14_DAYS"
                  ? "Applying..."
                  : "Use Free Trial"
                : "Trial already used"}
            </button>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Paid Publish (30 days)</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Pay <span className="font-semibold">₦{opts.price.toLocaleString()}</span> to
                  publish for {opts.paidDays} days.
                </p>
              </div>

              <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                Paid
              </span>
            </div>

            <button
              disabled={submitting !== null}
              onClick={() => choosePlan("PAID_30_DAYS")}
              className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {submitting === "PAID_30_DAYS" ? "Continuing..." : "Proceed to Payment"}
            </button>
          </div>
        </div>
      )}
    </PlanOptions>
  );
}