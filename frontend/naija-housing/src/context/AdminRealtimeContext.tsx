"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import useAdminSocket from "@/hooks/useAdminSocket";
import { useUI } from "@/hooks/useUi";
import { useAdminAuth } from "@/context/AdminAuthContext";
import adminApi from "@/libs/adminApi";

type AdminBadges = {
  dashboard: number;
  payments: number;
  reports: number;
  appeals: number;
  support: number;
  users: number;
  performance: number;
};

type AdminRealtimeContextType = {
  badges: AdminBadges;
  setBadges: React.Dispatch<React.SetStateAction<AdminBadges>>;
};

const AdminRealtimeContext = createContext<AdminRealtimeContextType | undefined>(
  undefined
);

export function AdminRealtimeProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { showToast } = useUI();
  const { adminLogout, admin, isHydrated } = useAdminAuth();

  const [badges, setBadges] = useState<AdminBadges>({
    dashboard: 0,
    payments: 0,
    reports: 0,
    appeals: 0,
    support: 0,
    users: 0,
    performance: 0,
  });

  const hydrateBadges = useCallback(async () => {
    try {
      const [overviewRes, supportRes] = await Promise.all([
        adminApi.get("/admin/overview"),
        adminApi.get("/admin/support"),
      ]);

      const overview = overviewRes.data || {};
      const supportRows = Array.isArray(supportRes.data) ? supportRes.data : [];
      const openSupport = supportRows.filter(
        (item: { status?: string }) =>
          item.status === "NEW" || item.status === "IN_PROGRESS"
      ).length;

      setBadges({
        dashboard:
          Number(overview.pendingPayments || 0) +
          Number(overview.openReports || 0) +
          Number(overview.pendingAppeals || 0) +
          openSupport,
        payments: Number(overview.pendingPayments || 0),
        reports: Number(overview.openReports || 0),
        appeals: Number(overview.pendingAppeals || 0),
        support: openSupport,
        users: Number(overview.totalUsers || 0),
        performance: 0,
      });
    } catch (error) {
      console.error("Failed to hydrate admin badges", error);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated || !admin) return;
    hydrateBadges();
  }, [admin, isHydrated, hydrateBadges]);

  const handleUnauthorized = useCallback(async () => {
    showToast("Session expired. Please log in again.", "error");
    await adminLogout();
    router.replace("/admin/login?expired=1");
  }, [adminLogout, router, showToast]);

  useAdminSocket({
    onBadgesUpdated: (payload) => {
      setBadges({
        dashboard: Number(payload.dashboard || 0),
        payments: Number(payload.payments || 0),
        reports: Number(payload.reports || 0),
        appeals: Number(payload.appeals || 0),
        support: Number(payload.support || 0),
        users: Number(payload.users || 0),
        performance: Number(payload.performance || 0),
      });
    },
    onUnauthorized: handleUnauthorized,
  });

  const value = useMemo(() => ({ badges, setBadges }), [badges]);

  return (
    <AdminRealtimeContext.Provider value={value}>
      {children}
    </AdminRealtimeContext.Provider>
  );
}

export function useAdminRealtime() {
  const ctx = useContext(AdminRealtimeContext);
  if (!ctx) {
    throw new Error("useAdminRealtime must be used within AdminRealtimeProvider");
  }
  return ctx;
}