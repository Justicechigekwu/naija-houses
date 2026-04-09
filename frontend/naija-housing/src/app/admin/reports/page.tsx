"use client";

import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminReportsList from "@/components/admin/reports/AdminReportList";
import useRequireAdminAuth from "@/hooks/useRequireAdminAuth";

export default function AdminReportsPage() {
  const { isCheckingAuth, isAuthenticated } = useRequireAdminAuth();

  if (isCheckingAuth) {
    return <div className="p-6">Checking admin session...</div>;
  }

  if (!isAuthenticated) return null;

  return (
    <div className="bg-[#F5F5F5]">
      <AdminNavbar />
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <h1 className="text-2xl font-semibold mb-6">Reports</h1>
        <AdminReportsList />
      </div>
    </div>
  );
}