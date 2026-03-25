// "use client";

// import useAdminReports from "@/hooks/useAdminReports";
// import AdminReportCard from "./AdminReportCard";

// export default function AdminReportsList() {
//   const {
//     reports,
//     loading,
//     error,
//     updateStatus,
//     deleteListing,
//     deleteUser,
//     clearOneReport,
//     clearHandledReports,
//     clearAllReports,
//     deletingListingId,
//     deletingUserId,
//     clearingReportId,
//     clearingAll,
//   } = useAdminReports();

//   if (loading) {
//     return <div className="bg-white border rounded-xl p-4">Loading reports...</div>;
//   }

//   if (error) {
//     return <div className="bg-red-50 text-red-600 border rounded-xl p-4">{error}</div>;
//   }

//   if (!reports.length) {
//     return <div className="bg-white border rounded-xl p-4">No reports found.</div>;
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-wrap gap-3">
//         <button
//           onClick={clearHandledReports}
//           disabled={clearingAll}
//           className={`px-4 py-2 rounded border ${
//             clearingAll ? "bg-gray-100 text-gray-400" : "hover:bg-gray-50"
//           }`}
//         >
//           {clearingAll ? "Clearing..." : "Clear handled reports"}
//         </button>

//         <button
//           onClick={clearAllReports}
//           disabled={clearingAll}
//           className={`px-4 py-2 rounded border text-red-600 ${
//             clearingAll ? "bg-gray-100 text-gray-400" : "hover:bg-red-50"
//           }`}
//         >
//           {clearingAll ? "Clearing..." : "Clear all reports"}
//         </button>
//       </div>

//       {reports.map((report) => (
//         <AdminReportCard
//           key={report._id}
//           report={report}
//           onReview={() => updateStatus(report._id, "REVIEWED")}
//           onDismiss={() => updateStatus(report._id, "DISMISSED")}
//           onResolve={() => updateStatus(report._id, "RESOLVED")}
//           onDeleteListing={async () => {
//             if (!report.targetListing?._id) return;
//             const ok = confirm("Delete this listing?");
//             if (!ok) return;
//             await deleteListing(report.targetListing._id);
//           }}
//           onDeleteUser={async () => {
//             if (!report.targetUser?._id) return;
//             const ok = confirm("Delete this user and related listings?");
//             if (!ok) return;
//             await deleteUser(report.targetUser._id);
//           }}
//           onClear={async () => {
//             const ok = confirm("Clear this report?");
//             if (!ok) return;
//             await clearOneReport(report._id);
//           }}
//           deletingListing={deletingListingId === report.targetListing?._id}
//           deletingUser={deletingUserId === report.targetUser?._id}
//           clearing={clearingReportId === report._id}
//         />
//       ))}
//     </div>
//   );
// }




"use client";

import useAdminReports from "@/hooks/useAdminReports";
import AdminReportCard from "./AdminReportCard";
import { useUI } from "@/hooks/useUi";

export default function AdminReportsList() {
  const {
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
  } = useAdminReports();

  const { showConfirm, showToast } = useUI();

  if (loading) {
    return <div className="bg-white border rounded-xl p-4">Loading reports...</div>;
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 border rounded-xl p-4">{error}</div>;
  }

  if (!reports.length) {
    return <div className="bg-white border rounded-xl p-4">No reports found.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() =>
            showConfirm(
              {
                title: "Clear Handled Reports",
                message: "Are you sure you want to clear all handled reports?",
                confirmText: "Clear",
                cancelText: "Cancel",
                confirmVariant: "danger",
              },
              async () => {
                await clearHandledReports();
                showToast("Handled reports cleared", "success");
              }
            )
          }
          disabled={clearingAll}
          className={`px-4 py-2 rounded border ${
            clearingAll ? "bg-gray-100 text-gray-400" : "hover:bg-gray-50"
          }`}
        >
          {clearingAll ? "Clearing..." : "Clear handled reports"}
        </button>

        <button
          onClick={() =>
            showConfirm(
              {
                title: "Clear All Reports",
                message: "This will delete ALL reports permanently. Continue?",
                confirmText: "Clear All",
                cancelText: "Cancel",
                confirmVariant: "danger",
              },
              async () => {
                await clearAllReports();
                showToast("All reports cleared", "success");
              }
            )
          }
          disabled={clearingAll}
          className={`px-4 py-2 rounded border text-red-600 ${
            clearingAll ? "bg-gray-100 text-gray-400" : "hover:bg-red-50"
          }`}
        >
          {clearingAll ? "Clearing..." : "Clear all reports"}
        </button>
      </div>

      {reports.map((report) => {
        const targetListingId = report.targetListing?._id;
        const targetUserId = report.targetUser?._id;

        return (
          <AdminReportCard
            key={report._id}
            report={report}
            onReview={() => updateStatus(report._id, "REVIEWED")}
            onDismiss={() => updateStatus(report._id, "DISMISSED")}
            onResolve={() => updateStatus(report._id, "RESOLVED")}
            onDeleteListing={() => {
              if (!targetListingId) return;

              showConfirm(
                {
                  title: "Delete Listing",
                  message: "Are you sure you want to delete this listing?",
                  confirmText: "Delete",
                  cancelText: "Cancel",
                  confirmVariant: "danger",
                },
                async () => {
                  await deleteListing(targetListingId);
                  showToast("Listing deleted", "success");
                }
              );
            }}
            onDeleteUser={() => {
              if (!targetUserId) return;

              showConfirm(
                {
                  title: "Delete User",
                  message: "Delete this user and all related listings?",
                  confirmText: "Delete User",
                  cancelText: "Cancel",
                  confirmVariant: "danger",
                },
                async () => {
                  await deleteUser(targetUserId);
                  showToast("User deleted", "success");
                }
              );
            }}
            onClear={() => {
              showConfirm(
                {
                  title: "Clear Report",
                  message: "Are you sure you want to clear this report?",
                  confirmText: "Clear",
                  cancelText: "Cancel",
                },
                async () => {
                  await clearOneReport(report._id);
                  showToast("Report cleared", "success");
                }
              );
            }}
            deletingListing={deletingListingId === targetListingId}
            deletingUser={deletingUserId === targetUserId}
            clearing={clearingReportId === report._id}
          />
        );
      })}
    </div>
  );
}