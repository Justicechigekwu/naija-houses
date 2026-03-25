"use client";

import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import useRequireAdminAuth from "@/hooks/useRequireAdminAuth";
import AdminUsersTable from "@/components/admin/AdminUsersTable";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminOverviewCards from "@/components/admin/AdminOverviewCards";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { adminLogout } = useAdminAuth();
  const { isCheckingAuth, isAuthenticated } = useRequireAdminAuth();

  if (isCheckingAuth) {
    return <div className="max-w-6xl mx-auto mt-8">Checking admin session...</div>;
  }

  if (!isAuthenticated) return null;

  return (
    <div>
      <AdminNavbar />

      <div className="max-w-6xl mx-auto mt-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

          <div className="flex gap-3 flex-wrap">
            <button
              className="border px-3 py-2 rounded"
              onClick={() => router.push("/admin/payments")}
            >
              Pending Payments
            </button>

            <button
              className="border px-3 py-2 rounded"
              onClick={() => router.push("/admin/reports")}
            >
              Reports
            </button>

            <button
              className="border px-3 py-2 rounded"
              onClick={() => router.push("/admin/appeals")}
            >
              Appeals
            </button>

            <button
              className="border px-3 py-2 rounded"
              onClick={() => router.push("/admin/performance")}
            >
              Performance
            </button>

            <button
              className="bg-black text-white px-3 py-2 rounded"
              onClick={() => {
                adminLogout();
                router.push("/admin/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <AdminOverviewCards />

        <div className="mt-6">
          <AdminUsersTable />
        </div>
      </div>
    </div>
  );
}