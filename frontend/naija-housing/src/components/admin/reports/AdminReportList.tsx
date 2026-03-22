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
//     deletingListingId,
//     deletingUserId,
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
//           deletingListing={deletingListingId === report.targetListing?._id}
//           deletingUser={deletingUserId === report.targetUser?._id}
//         />
//       ))}
//     </div>
//   );
// }


"use client";

import useAdminReports from "@/hooks/useAdminReports";
import AdminReportCard from "./AdminReportCard";

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
          onClick={clearHandledReports}
          disabled={clearingAll}
          className={`px-4 py-2 rounded border ${
            clearingAll ? "bg-gray-100 text-gray-400" : "hover:bg-gray-50"
          }`}
        >
          {clearingAll ? "Clearing..." : "Clear handled reports"}
        </button>

        <button
          onClick={clearAllReports}
          disabled={clearingAll}
          className={`px-4 py-2 rounded border text-red-600 ${
            clearingAll ? "bg-gray-100 text-gray-400" : "hover:bg-red-50"
          }`}
        >
          {clearingAll ? "Clearing..." : "Clear all reports"}
        </button>
      </div>

      {reports.map((report) => (
        <AdminReportCard
          key={report._id}
          report={report}
          onReview={() => updateStatus(report._id, "REVIEWED")}
          onDismiss={() => updateStatus(report._id, "DISMISSED")}
          onResolve={() => updateStatus(report._id, "RESOLVED")}
          onDeleteListing={async () => {
            if (!report.targetListing?._id) return;
            const ok = confirm("Delete this listing?");
            if (!ok) return;
            await deleteListing(report.targetListing._id);
          }}
          onDeleteUser={async () => {
            if (!report.targetUser?._id) return;
            const ok = confirm("Delete this user and related listings?");
            if (!ok) return;
            await deleteUser(report.targetUser._id);
          }}
          onClear={async () => {
            const ok = confirm("Clear this report?");
            if (!ok) return;
            await clearOneReport(report._id);
          }}
          deletingListing={deletingListingId === report.targetListing?._id}
          deletingUser={deletingUserId === report.targetUser?._id}
          clearing={clearingReportId === report._id}
        />
      ))}
    </div>
  );
}