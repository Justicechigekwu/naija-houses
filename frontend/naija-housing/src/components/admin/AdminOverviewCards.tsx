
// "use client";

// import useAdminOverview from "@/hooks/useAdminOverview";

// export default function AdminOverviewCards() {
//   const { data, loading } = useAdminOverview();

//   if (loading) {
//     return <div className="mb-6">Loading overview...</div>;
//   }

//   if (!data) return null;

//   const cards = [
//     { title: "Total Users", value: data.totalUsers },
//     { title: "Published Listings", value: data.publishedListings },
//     { title: "Pending Payments", value: data.pendingPayments },
//     { title: "Visitors (7 Days)", value: data.visitorsLast7Days },
//     { title: "Open Reports", value: data.openReports },
//   ];

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
//       {cards.map((card, index) => (
//         <div
//           key={index}
//           className="bg-white border rounded-xl p-4 shadow-sm"
//         >
//           <p className="text-sm text-gray-500">{card.title}</p>
//           <h2 className="text-2xl font-semibold mt-1">{card.value}</h2>
//         </div>
//       ))}
//     </div>
//   );
// }



"use client";

import useAdminOverview from "@/hooks/useAdminOverview";

export default function AdminOverviewCards() {
  const { data, loading } = useAdminOverview();

  if (loading) {
    return <div className="mb-6">Loading overview...</div>;
  }

  if (!data) return null;

  const cards = [
    { title: "Total Users", value: data.totalUsers },
    { title: "Published Listings", value: data.publishedListings },
    { title: "Pending Payments", value: data.pendingPayments },
    { title: "Open Reports", value: data.openReports },
    { title: "Pending Appeals", value: data.pendingAppeals },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white border rounded-xl p-4 shadow-sm"
        >
          <p className="text-sm text-gray-500">{card.title}</p>
          <h2 className="text-2xl font-semibold mt-1">{card.value}</h2>
        </div>
      ))}
    </div>
  );
}