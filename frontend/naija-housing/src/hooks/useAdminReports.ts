"use client";

import { useEffect, useState, useCallback } from "react";
import adminApi from "@/libs/adminApi";
import { AxiosError } from "axios";
import useAdminSocket from "@/hooks/useAdminSocket";

export type AdminReportRow = {
  _id: string;
  targetType: "LISTING" | "USER";
  reason: string;
  status: string;
  message?: string;
  adminNote?: string;
  reportedBy?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  targetUser?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
  } | null;
  targetListing?: {
    _id?: string;
    title?: string;
    publishStatus?: string;
    appealStatus?: string;
    owner?: string;
  } | null;
};

export default function useAdminReports() {
  const [reports, setReports] = useState<AdminReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingListingId, setDeletingListingId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [clearingReportId, setClearingReportId] = useState<string | null>(null);
  const [clearingAll, setClearingAll] = useState(false);

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await adminApi.get("/admin/reports");
      setReports(res.data || []);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to load reports");
      } else {
        setError("Failed to load reports");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = async (
    reportId: string,
    status: "REVIEWED" | "DISMISSED" | "RESOLVED"
  ) => {
    try {
      const res = await adminApi.patch(`/admin/reports/${reportId}`, { status });

      setReports((prev) =>
        prev.map((report) =>
          report._id === reportId
            ? { ...report, status: res.data.report.status }
            : report
        )
      );
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        alert(err.response?.data?.message || "Failed to update report");
      } else {
        alert("Failed to update report");
      }
    }
  };

  const deleteListing = async (listingId: string) => {
    try {
      setDeletingListingId(listingId);

      await adminApi.delete(`/admin/listings/${listingId}`);

      setReports((prev) =>
        prev.map((report) => {
          if (report.targetListing?._id === listingId) {
            return {
              ...report,
              status: "RESOLVED",
              targetListing: {
                ...report.targetListing,
                publishStatus: "REMOVED_BY_ADMIN",
              },
              adminNote: "Listing deleted by admin",
            };
          }
          return report;
        })
      );
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        alert(err.response?.data?.message || "Failed to delete listing");
      } else {
        alert("Failed to delete listing");
      }
    } finally {
      setDeletingListingId(null);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setDeletingUserId(userId);

      await adminApi.delete(`/admin/users/${userId}`);

      setReports((prev) =>
        prev.map((report) => {
          if (report.targetUser?._id === userId) {
            return {
              ...report,
              status: "RESOLVED",
              targetUser: null,
            };
          }

          if (report.targetListing?.owner === userId) {
            return {
              ...report,
              status: "RESOLVED",
              targetListing: null,
            };
          }

          return report;
        })
      );
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        alert(err.response?.data?.message || "Failed to delete user");
      } else {
        alert("Failed to delete user");
      }
    } finally {
      setDeletingUserId(null);
    }
  };

  const clearOneReport = async (reportId: string) => {
    try {
      setClearingReportId(reportId);
      await adminApi.delete(`/admin/reports/${reportId}`);
      setReports((prev) => prev.filter((report) => report._id !== reportId));
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        alert(err.response?.data?.message || "Failed to clear report");
      } else {
        alert("Failed to clear report");
      }
    } finally {
      setClearingReportId(null);
    }
  };

  const clearHandledReports = async () => {
    try {
      setClearingAll(true);
      await adminApi.delete("/admin/reports");
      setReports((prev) =>
        prev.filter(
          (report) => !["RESOLVED", "DISMISSED"].includes(report.status)
        )
      );
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        alert(err.response?.data?.message || "Failed to clear handled reports");
      } else {
        alert("Failed to clear handled reports");
      }
    } finally {
      setClearingAll(false);
    }
  };

  const clearAllReports = async () => {
    try {
      setClearingAll(true);
      await adminApi.delete("/admin/reports?mode=all");
      setReports([]);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        alert(err.response?.data?.message || "Failed to clear all reports");
      } else {
        alert("Failed to clear all reports");
      }
    } finally {
      setClearingAll(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  useAdminSocket({
    onReportsUpdated: useCallback(() => {
      loadReports();
    }, [loadReports]),
  });

  return {
    reports,
    loading,
    error,
    updateStatus,
    deleteListing,
    deleteUser,
    clearOneReport,
    clearHandledReports,
    clearAllReports,
    deletingListingId,
    deletingUserId,
    clearingReportId,
    clearingAll,
    reload: loadReports,
  };
}