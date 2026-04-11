"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/libs/api";
import PlanOptions from "@/components/PlanOptions";
import { AxiosError } from "axios";

type PublishOptions = {
  listingId: string;
  slug?: string;
  category: string;
  subcategory?: string;
  canUseTrial: boolean;
  trialDays: number;
  paidDays: number;
  price: number;
  publishStatus: string;
  publishPlan: string | null;
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

type ChoosePlanResponse = {
  message?: string;
  slug?: string;
  listing?: {
    _id: string;
    slug?: string;
  };
  payment?: {
    id?: string;
    paymentCode?: string;
    status?: string;
    amount?: number;
  };
};

export default function ListingPaymentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [opts, setOpts] = useState<PublishOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<null | "TRIAL_14_DAYS" | "PAID_30_DAYS">(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get<PublishOptions>(`/listings/${id}/publish-options`);
        setOpts(res.data);
      } catch (e: unknown) {
        if (e instanceof AxiosError) {
          setError(e.response?.data?.message || "Failed to load payment options");
        } else if (e instanceof Error) {
          setError(e.message || "Failed to load payment options");
        } else {
          setError("Failed to load payment options");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id]);

  const choosePlan = async (plan: "TRIAL_14_DAYS" | "PAID_30_DAYS") => {
    try {
      setSubmitting(plan);
      setError(null);

      const res = await api.post<ChoosePlanResponse>(`/listings/${id}/choose-plan`, {
        plan,
      });

      if (plan === "PAID_30_DAYS") {
        const code = res.data?.payment?.paymentCode || "";
        router.push(
          `/listing-actions/${id}/payment-details?code=${encodeURIComponent(code)}`
        );
        return;
      }

      if (plan === "TRIAL_14_DAYS") {
        const slug = res.data?.listing?.slug || res.data?.slug;

        if (!slug) {
          setError("Listing was published but slug was not returned.");
          return;
        }

        router.push(`/listings/${slug}`);
        return;
      }

      const optsRes = await api.get<PublishOptions>(`/listings/${id}/publish-options`);
      setOpts(optsRes.data);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        setError(e.response?.data?.message || "Something went wrong");
      } else if (e instanceof Error) {
        setError(e.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <PlanOptions
      title="Publish Listing"
      subtitle={
        opts
          ? `Choose a plan to publish this listing. Free trials are limited to first-time ${opts.subcategory || "category"} users.`
          : "Choose a plan to publish this listing."
      }
    >
      {loading && <div className="text-sm text-gray-600">Loading...</div>}

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && !opts && (
        <div className="text-sm text-gray-600">No options found</div>
      )}

      {opts && (
        <div className="space-y-5 ">
          <div className="rounded-xl border border-gray-200 p-4 bg-[#F5F5F5]">
            <div className="flex items-start justify-between gap-4">
              <div >
                <h2 className="text-base font-semibold text-gray-900">
                  14-days Free Plan
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Publish instantly for {opts.trialDays} days if trial is still available.
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
                  : "Try Free Plan"
                : "Trial already used"}
            </button>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 bg-[#F5F5F5]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Paid publish plan</p>
                <h3 className="text-base font-semibold text-gray-900">
                  ₦{opts.price.toLocaleString()}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Publish for {opts.paidDays} days.
                </p>
              </div>

              <span className="rounded-full bg-[#8A715D] px-3 py-1 text-xs font-medium text-white">
                Paid
              </span>
            </div>

            <button
              disabled={submitting !== null}
              onClick={() => choosePlan("PAID_30_DAYS")}
              className="mt-4 w-full rounded-lg bg-[#8A715D] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {submitting === "PAID_30_DAYS" ? "Continuing..." : "Proceed to Payment"}
            </button>
          </div>
        </div>
      )}
    </PlanOptions>
  );
}