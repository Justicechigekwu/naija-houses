"use client";

import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import useRequireAdminAuth from "@/hooks/useRequireAdminAuth";
import AdminUsersTable from "@/components/admin/AdminUsersTable";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminOverviewCards from "@/components/admin/AdminOverviewCards";

import {
  LayoutDashboard,
  CreditCard,
  Flag,
  ShieldAlert,
  BarChart3,
  LifeBuoy,
  LogOut,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { adminLogout } = useAdminAuth();
  const { isCheckingAuth, isAuthenticated } = useRequireAdminAuth();

  if (isCheckingAuth) {
    return (
      <div className="mx-auto mt-10 max-w-6xl px-4">
        <div className="rounded-2xl border bg-white px-5 py-4 text-sm text-gray-600 shadow-sm">
          Checking admin session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      <AdminNavbar />

      <div className="mx-auto mt-8 max-w-7xl px-4 pb-10">
        {/* Header */}
        <div className="mb-6 rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <LayoutDashboard className="w-5 h-5 text-[#8A715D]" />
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8A715D]">
                  Admin Panel
                </p>
              </div>

              <h1 className="text-3xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Manage platform activity, users, payments and reports.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition shadow-sm"
                onClick={() => router.push("/admin/payments")}
              >
                <CreditCard className="w-4 h-4" />
                Pending Payments
              </button>

              <button
                className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition shadow-sm"
                onClick={() => router.push("/admin/reports")}
              >
                <Flag className="w-4 h-4" />
                Reports
              </button>

              <button
                className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition shadow-sm"
                onClick={() => router.push("/admin/appeals")}
              >
                <ShieldAlert className="w-4 h-4" />
                Appeals
              </button>

              <button
                className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition shadow-sm"
                onClick={() => router.push("/admin/support")}
              >
                <LifeBuoy className="w-4 h-4" />
                Support
              </button>

              <button
                className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition shadow-sm"
                onClick={() => router.push("/admin/performance")}
              >
                <BarChart3 className="w-4 h-4" />
                Performance
              </button>

              <button
                className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition shadow-sm"
                onClick={() => {
                  adminLogout();
                  router.push("/admin/login");
                }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <LayoutDashboard className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Platform Overview</h2>
          </div>

          <AdminOverviewCards />
        </div>

        {/* Users table */}
        <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Users & Listings</h2>
          </div>

          <AdminUsersTable />
        </div>
      </div>
    </div>
  );
}