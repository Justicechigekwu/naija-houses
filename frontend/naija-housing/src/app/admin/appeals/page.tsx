"use client";

import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminAppealsList from "@/components/admin/appeal/AdminAppealsList";
import useRequireAdminAuth from "@/hooks/useRequireAdminAuth";

export default function AdminAppealsPage() {
  const { isCheckingAuth, isAuthenticated } = useRequireAdminAuth();

  if (isCheckingAuth) {
    return <div className="p-6">Checking admin session...</div>;
  }

  if (!isAuthenticated) return null;

  return (
    <div>
      <AdminNavbar />
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <h1 className="text-2xl font-semibold mb-6">Pending Appeals</h1>
        <AdminAppealsList />
      </div>
    </div>
  );
}