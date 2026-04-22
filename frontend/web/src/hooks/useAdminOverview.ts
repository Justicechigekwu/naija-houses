"use client";

import { useEffect, useState, useCallback } from "react";
import adminApi from "@/libs/adminApi";
import useAdminSocket from "@/hooks/useAdminSocket";

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

  const loadOverview = useCallback(async () => {
    try {
      const res = await adminApi.get("/admin/overview");
      setData(res.data);
    } catch (error) {
      console.error("Failed to load overview", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  useAdminSocket({
    onOverviewUpdated: useCallback(() => {
      loadOverview();
    }, [loadOverview]),
    onPaymentsUpdated: useCallback(() => {
      loadOverview();
    }, [loadOverview]),
    onReportsUpdated: useCallback(() => {
      loadOverview();
    }, [loadOverview]),
    onAppealsUpdated: useCallback(() => {
      loadOverview();
    }, [loadOverview]),
    onUsersUpdated: useCallback(() => {
      loadOverview();
    }, [loadOverview]),
    onSupportUpdated: useCallback(() => {
      loadOverview();
    }, [loadOverview]),
  });

  return { data, loading, reload: loadOverview };
}