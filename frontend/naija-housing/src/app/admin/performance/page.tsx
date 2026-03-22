"use client";

import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminAnalyticsSection from "@/components/admin/AdminAnalyticsSection";
import useRequireAdminAuth from "@/hooks/useRequireAdminAuth";

export default function AdminPerformancePage() {
  const { isCheckingAuth, isAuthenticated } = useRequireAdminAuth();

  if (isCheckingAuth) {
    return <div className="p-6">Checking admin session...</div>;
  }

  if (!isAuthenticated) return null;

  return (
    <div>
      <AdminNavbar />

      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Performance</h1>
          <p className="text-sm text-gray-600 mt-1">
            View visitor trends, top categories, and top subcategories.
          </p>
        </div>

        <AdminAnalyticsSection />
      </div>
    </div>
  );
}