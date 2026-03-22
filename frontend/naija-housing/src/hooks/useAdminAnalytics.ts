"use client";

import { useEffect, useState } from "react";
import adminApi from "@/libs/adminApi";

type DayPoint = {
  day: string;
  count: number;
};

type CategoryPoint = {
  category?: string;
  subcategory?: string;
  interactions: number;
};

type AnalyticsResponse = {
  visitors7: DayPoint[];
  visitors30: DayPoint[];
  topCategories: CategoryPoint[];
  topSubcategories: CategoryPoint[];
};

export default function useAdminAnalytics() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await adminApi.get("/analytics/admin/overview");
      setData(res.data);
    } catch (error: any) {
      setError(error?.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return { data, loading, error, reload: loadAnalytics };
}