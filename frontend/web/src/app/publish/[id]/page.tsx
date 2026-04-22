"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import api from "@/libs/api";
import { useUI } from "@/hooks/useUi";

type ErrorResponse = {
  message?: string;
};

type PublishPlan = "TRIAL_14_DAYS" | "PAID_30_DAYS";

type PublishOptionsResponse = {
  trialAvailable?: boolean;
  trialDays?: number;
  paidDays?: number;
  publishPrice?: number;
  message?: string;
};

export default function PublishPlanPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useUI();
  const [options, setOptions] = useState<PublishOptionsResponse | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<PublishOptionsResponse>(
          `/listings/${id}/publish-options`
        );
        setOptions(res.data);
      } catch (err: unknown) {
        const error = err as AxiosError<ErrorResponse>;
        showToast(
          error.response?.data?.message || "Failed to load publish options",
          "error"
        );
      }
    })();
  }, [id, showToast]);

  const choosePlan = async (plan: PublishPlan) => {
    try {
      const res = await api.post<{ message?: string }>(
        `/listings/${id}/choose-plan`,
        { plan }
      );
      showToast(res?.data?.message || "Success", "error");
      router.push("/pending");
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>;
      const msg = error.response?.data?.message || "Failed to choose plan";
      showToast(msg);
    }
  };

  if (!options) return <div className="max-w-3xl mx-auto text-center bg-gradient-to-b from-[#EDEDED] via-white to-[#ededed] p-4">Trade Smart, Live Better.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Choose Publish Plan</h1>

      <button
        onClick={() => choosePlan("TRIAL_14_DAYS")}
        className="w-full px-4 py-3 bg-gray-900 text-white rounded"
      >
        Free Trial
      </button>

      <button
        onClick={() => choosePlan("PAID_30_DAYS")}
        className="w-full px-4 py-3 bg-green-600 text-white rounded"
      >
        Paid Plan
      </button>
    </div>
  );
}