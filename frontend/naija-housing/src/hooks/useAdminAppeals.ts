// "use client";

// import { useEffect, useState } from "react";
// import adminApi from "@/libs/adminApi";
// import { AxiosError } from "axios";

// export type AdminAppealRow = {
//   _id: string;
//   title: string;
//   description?: string;
//   price?: number;
//   category?: string;
//   subcategory?: string;
//   publishStatus: string;
//   appealStatus: string;
//   adminRemovalReason?: string;
//   appealMessage?: string;
//   appealSubmittedAt?: string;
//   appealReviewedAt?: string;
//   appealReviewNote?: string;
//   owner?: {
//     _id?: string;
//     firstName?: string;
//     lastName?: string;
//     email?: string;
//     avatar?: string;
//   };
// };

// export default function useAdminAppeals() {
//   const [appeals, setAppeals] = useState<AdminAppealRow[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [processingId, setProcessingId] = useState<string | null>(null);

//   const loadAppeals = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const res = await adminApi.get("/admin/appeals");
//       setAppeals(Array.isArray(res.data) ? res.data : []);
//     } catch (err: unknown) {
//       if (err instanceof AxiosError) {
//         console.error("Load appeals error:", err.response?.data || err.message);
//         setError(err.response?.data?.message || "Failed to load appeals");
//       } else {
//         console.error("Load appeals error:", err);
//         setError("Failed to load appeals");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//     const approveAppeal = async (listingId: string) => {
//       try {
//         setProcessingId(listingId);
    
//         const res = await adminApi.patch(`/admin/appeals/${listingId}/approve`);
//         console.log("Approve appeal success:", res.data);
    
//         setAppeals((prev) => prev.filter((item) => item._id !== listingId));
//       } catch (err: unknown) {
//         if (err instanceof AxiosError) {
//           console.error("Approve appeal error:", err.response?.data || err.message);
//           alert(
//             typeof err.response?.data?.message === "string"
//               ? err.response.data.message
//               : "Failed to approve appeal"
//           );
//         } else {
//           console.error("Approve appeal error:", err);
//           alert("Failed to approve appeal");
//         }
//       } finally {
//         setProcessingId(null);
//       }
//     };

//   const rejectAppeal = async (listingId: string, reviewNote: string) => {
//     try {
//       setProcessingId(listingId);
//       await adminApi.patch(`/admin/appeals/${listingId}/reject`, { reviewNote });
//       setAppeals((prev) => prev.filter((item) => item._id !== listingId));
//     } catch (err: unknown) {
//       if (err instanceof AxiosError) {
//         alert(err.response?.data?.message || "Failed to reject appeal");
//       } else {
//         alert("Failed to reject appeal");
//       }
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   useEffect(() => {
//     loadAppeals();
//   }, []);

//   return {
//     appeals,
//     loading,
//     error,
//     processingId,
//     approveAppeal,
//     rejectAppeal,
//     reload: loadAppeals,
//   };
// }




"use client";

import { useEffect, useState } from "react";
import adminApi from "@/libs/adminApi";
import { AxiosError } from "axios";

export type AdminAppealRow = {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  category?: string;
  subcategory?: string;
  publishStatus: string;
  appealStatus: string;
  violationPolicy?: string;
  adminRemovalReason?: string;
  appealMessage?: string;
  appealSubmittedAt?: string;
  appealReviewedAt?: string;
  appealReviewNote?: string;
  owner?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
  };
};

export default function useAdminAppeals() {
  const [appeals, setAppeals] = useState<AdminAppealRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadAppeals = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await adminApi.get("/admin/appeals");
      setAppeals(Array.isArray(res.data) ? res.data : []);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error("Load appeals error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to load appeals");
      } else {
        console.error("Load appeals error:", err);
        setError("Failed to load appeals");
      }
    } finally {
      setLoading(false);
    }
  };

  const approveAppeal = async (listingId: string) => {
    try {
      setProcessingId(listingId);

      const res = await adminApi.patch(`/admin/appeals/${listingId}/approve`);
      console.log("Approve appeal success:", res.data);

      setAppeals((prev) => prev.filter((item) => item._id !== listingId));
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error("Approve appeal error:", err.response?.data || err.message);
        alert(
          typeof err.response?.data?.message === "string"
            ? err.response.data.message
            : "Failed to approve appeal"
        );
      } else {
        console.error("Approve appeal error:", err);
        alert("Failed to approve appeal");
      }
    } finally {
      setProcessingId(null);
    }
  };

  const rejectAppeal = async (listingId: string, reviewNote: string) => {
    try {
      setProcessingId(listingId);
      await adminApi.patch(`/admin/appeals/${listingId}/reject`, { reviewNote });
      setAppeals((prev) => prev.filter((item) => item._id !== listingId));
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        alert(err.response?.data?.message || "Failed to reject appeal");
      } else {
        alert("Failed to reject appeal");
      }
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    loadAppeals();
  }, []);

  return {
    appeals,
    loading,
    error,
    processingId,
    approveAppeal,
    rejectAppeal,
    reload: loadAppeals,
  };
}