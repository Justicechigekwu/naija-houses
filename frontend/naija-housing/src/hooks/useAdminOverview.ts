"use client";

import { useEffect, useState } from "react";
import adminApi from "@/libs/adminApi";

type Overview = {
  totalUsers: number;
  publishedListings: number;
  pendingPayments: number;
  visitorsLast7Days: number;
  openReports: number;
  pendingAppeals: number;
};

export default function useAdminOverview() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  const loadOverview = async () => {
    try {
      const res = await adminApi.get("/admin/overview");
      setData(res.data);
    } catch (error) {
      console.error("Failed to load overview", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  return { data, loading, reload: loadOverview };
}