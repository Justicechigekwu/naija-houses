"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/libs/api";

export default function PublishPlanPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [options, setOptions] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/listings/${id}/publish-options`);
        setOptions(res.data);
      } catch (err: any) {
        alert(err?.response?.data?.message || "Failed to load publish options");
      }
    })();
  }, [id]);

  const choosePlan = async (plan: "TRIAL_14_DAYS" | "PAID_30_DAYS") => {
    try {
      const res = await api.post(`/listings/${id}/choose-plan`, { plan });
      alert(res?.data?.message || "Done");
      router.push("/pending"); 
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to choose plan";
      alert(msg);
    }
  };

  if (!options) return <div className="max-w-3xl mx-auto p-4">Loading...</div>;

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