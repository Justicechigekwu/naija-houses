// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useSearchParams, useParams, useRouter } from "next/navigation";
// import api from "@/libs/api";
// import PlanOptions from "@/components/PlanOptions";
// import { useUI } from "@/hooks/useUi";
// import { AxiosError } from "axios";

// type PublishOptions = {
//   listingId: string;
//   category: string;
//   subcategory?: string;
//   canUseTrial: boolean;
//   trialDays: number;
//   paidDays: number;
//   price: number;
//   publishStatus: string;
//   publishPlan: "TRIAL_14_DAYS" | "PAID_30_DAYS" | null;
//   bankDetails: {
//     bankName: string;
//     accountName: string;
//     accountNumber: string;
//   } | null;
//   activePayment: {
//     id: string;
//     paymentCode: string;
//     status: string;
//     amount: number;
//     accountAssignedAt: string;
//     accountExpiresAt: string;
//     isAccountActive: boolean;
//   } | null;
// };

// type PaymentMethodsRes = {
//   recommended: "BANK_TRANSFER" | "PAYSTACK" | "FLUTTERWAVE" | "CARD";
//   methods: { key: string; label: string }[];
// };

// export default function PaymentDetailsPage() {
//   const { id } = useParams<{ id: string }>();
//   const router = useRouter();
//   const { showToast } = useUI();
//   const params = useSearchParams();
//   const queryPaymentCode = params.get("code");

//   const [opts, setOpts] = useState<PublishOptions | null>(null);
//   const [methods, setMethods] = useState<PaymentMethodsRes | null>(null);

//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [timeLeft, setTimeLeft] = useState("");

//   const [reference, setReference] = useState("");
//   const [note, setNote] = useState("");

//   const bank = useMemo(() => {
//     return opts?.bankDetails || null;
//   }, [opts]);

//   const paymentCode = queryPaymentCode || opts?.activePayment?.paymentCode || "";
//   const price = opts?.price ?? 0;

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const [optsRes, methodsRes] = await Promise.all([
//           api.get(`/listings/${id}/publish-options`),
//           api.get(`/payments/methods`),
//         ]);

//         setOpts(optsRes.data);
//         setMethods(methodsRes.data);
//       } catch (e: unknown) {
//         if (e instanceof AxiosError) {
//           setError(e.response?.data?.message || "Failed to load payment details");
//         } else if (e instanceof Error) {
//           setError(e.message || "Failed to load payment details");
//         } else {
//           setError("Failed to load payment details");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) load();
//   }, [id]);

//   useEffect(() => {
//     if (!opts?.activePayment?.accountExpiresAt) return;

//     const interval = setInterval(() => {
//       const end = new Date(opts.activePayment!.accountExpiresAt).getTime();
//       const now = Date.now();
//       const diff = end - now;

//       if (diff <= 0) {
//         setTimeLeft("Expired");
//         clearInterval(interval);
//         return;
//       }

//       const mins = Math.floor(diff / 1000 / 60);
//       const secs = Math.floor((diff / 1000) % 60);
//       setTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [opts?.activePayment?.accountExpiresAt]);

//   const copy = async (text: string) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       showToast("Copied!", "success");
//     } catch {
//       showToast("Copy failed. Please copy manually.", "error");
//     }
//   };

//   const notify = async () => {
//     try {
//       setSubmitting(true);
//       setError(null);

//       if (!opts) throw new Error("Missing listing payment options");

//       if (opts.publishPlan !== "PAID_30_DAYS") {
//         setError("This listing is not set to paid publishing.");
//         return;
//       }

//       if (!["DRAFT", "REJECTED", "EXPIRED"].includes(opts.publishStatus)) {
//         setError(`You can't submit payment while listing is ${opts.publishStatus}`);
//         return;
//       }

//       if (!price || price <= 0) {
//         setError("Publish price is missing. Please contact support/admin.");
//         return;
//       }

//       await api.post("/payments/notify", {
//         listingId: id,
//         method: "BANK_TRANSFER",
//         reference,
//         note,
//       });

//       showToast(
//         "Submitted! Waiting for confirmation, This usually take 5 mins to 2 hours to be reviewed",
//         "success"
//       );
//       router.push("/pending");
//     } catch (e: unknown) {
//       if (e instanceof AxiosError) {
//         setError(e.response?.data?.message || e.message || "Failed to submit payment");
//       } else if (e instanceof Error) {
//         setError(e.message || "Failed to submit payment");
//       } else {
//         setError("Failed to submit payment");
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <PlanOptions
//       title="Payment Details"
//       subtitle="Bank transfer is recommended. After you pay, click “I have made payment”."
//     >
//       <div className="space-y-6">
//         {loading && (
//           <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600 shadow-sm">
//             Loading...
//           </div>
//         )}

//         {error && (
//           <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
//             {error}
//           </div>
//         )}

//         {!loading && opts && (
//           <div className="space-y-6">
//             <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 shadow-sm">
//               Your listing will go live immediately after payment is confirmed.
//             </div>

//             <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm transition hover:shadow-md">
//               <div className="flex items-start justify-between gap-4">
//                 <div>
//                   <h2 className="text-base font-semibold text-gray-900">Publish Fee</h2>
//                   <p className="mt-2 text-2xl font-bold text-gray-900">
//                     ₦{price.toLocaleString()}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     for {opts.paidDays} days listing
//                   </p>
//                 </div>

//                 <span className="rounded-full bg-[#8A715D] px-3 py-1 text-xs font-medium text-white shadow-sm">
//                   Paid Plan
//                 </span>
//               </div>
//             </div>

//             {opts?.activePayment?.isAccountActive && (
//               <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900 shadow-sm">
//                 <div className="font-semibold">Make payment within 30 minutes</div>
//                 <div className="mt-1">
//                   Do not save this account for future use. This account expires in{" "}
//                   <span className="font-semibold">{timeLeft}</span>.
//                 </div>
//               </div>
//             )}

//             <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
//               <div className="flex items-center justify-between gap-4">
//                 <h2 className="text-base font-semibold text-gray-900">
//                   Recommended method
//                 </h2>
//                 <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white shadow-sm">
//                   {methods?.recommended === "BANK_TRANSFER"
//                     ? "Bank Transfer"
//                     : methods?.recommended}
//                 </span>
//               </div>

//               {opts?.activePayment && !opts.activePayment.isAccountActive && (
//                 <button
//                   type="button"
//                   onClick={() => router.push(`/listing-actions/${id}/payment`)}
//                   className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
//                 >
//                   Get New Payment Account
//                 </button>
//               )}

//               {!bank ? (
//                 <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
//                   No bank details available.
//                 </div>
//               ) : (
//                 <div className="mt-5 space-y-3 text-sm">
//                   <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
//                     <div>
//                       <div className="text-xs uppercase tracking-wide text-gray-500">
//                         Bank
//                       </div>
//                       <div className="mt-1 font-semibold text-gray-900">
//                         {bank.bankName}
//                       </div>
//                     </div>
//                     <button
//                       type="button"
//                       className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
//                       onClick={() => copy(bank.bankName)}
//                     >
//                       Copy
//                     </button>
//                   </div>

//                   <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
//                     <div>
//                       <div className="text-xs uppercase tracking-wide text-gray-500">
//                         Account Name
//                       </div>
//                       <div className="mt-1 font-semibold text-gray-900">
//                         {bank.accountName}
//                       </div>
//                     </div>
//                     <button
//                       type="button"
//                       className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
//                       onClick={() => copy(bank.accountName)}
//                     >
//                       Copy
//                     </button>
//                   </div>

//                   <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
//                     <div>
//                       <div className="text-xs uppercase tracking-wide text-gray-500">
//                         Account Number
//                       </div>
//                       <div className="mt-1 font-semibold text-gray-900">
//                         {bank.accountNumber}
//                       </div>
//                     </div>
//                     <button
//                       type="button"
//                       className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
//                       onClick={() => copy(bank.accountNumber)}
//                     >
//                       Copy
//                     </button>
//                   </div>

//                   {paymentCode && (
//                     <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
//                       <div>
//                         <div className="text-xs uppercase tracking-wide text-gray-500">
//                           Narration / Reference
//                         </div>
//                         <div className="mt-1 font-bold text-gray-900">
//                           {paymentCode}
//                         </div>
//                         <div className="mt-1 text-xs text-gray-500">
//                           Put this in your bank transfer narration for fast payment
//                           verification.
//                         </div>
//                       </div>

//                       <button
//                         type="button"
//                         className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
//                         onClick={() => copy(paymentCode)}
//                       >
//                         Copy
//                       </button>
//                     </div>
//                   )}

//                   <div className="rounded-xl bg-gray-50 p-4 text-xs leading-6 text-gray-600">
//                     After you transfer, enter a reference optional and click{" "}
//                     <b>I have made payment</b>.
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
//               <div>
//                 <label className="block text-sm font-medium text-gray-900">
//                   Transfer reference optional
//                 </label>
//                 <input
//                   value={reference}
//                   onChange={(e) => setReference(e.target.value)}
//                   placeholder="e.g. bank narration / transaction ref"
//                   className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#8A715D]"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-900">
//                   Note optional
//                 </label>
//                 <input
//                   value={note}
//                   onChange={(e) => setNote(e.target.value)}
//                   placeholder="Any extra info for admin"
//                   className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#8A715D]"
//                 />
//               </div>

//               <button
//                 disabled={submitting}
//                 onClick={notify}
//                 className="w-full rounded-xl bg-[#8A715D] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
//               >
//                 {submitting ? "Submitting..." : "I have made payment"}
//               </button>

//               <button
//                 type="button"
//                 className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
//                 onClick={() => router.push(`/listings/${id}/payment`)}
//               >
//                 Back to plan selection
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </PlanOptions>
//   );
// }



// app/listing-actions/[id]/payment-details/page.tsx

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { Camera, FileText, Paperclip, X } from "lucide-react";
import api from "@/libs/api";
import PlanOptions from "@/components/PlanOptions";
import { useUI } from "@/hooks/useUi";
import { AxiosError } from "axios";

type ProofAttachment = {
  url: string;
  public_id: string;
  resource_type?: string;
  originalName?: string;
  uploadedAt?: string;
};

type PublishOptions = {
  listingId: string;
  category: string;
  subcategory?: string;
  canUseTrial: boolean;
  trialDays: number;
  paidDays: number;
  price: number;
  publishStatus: string;
  publishPlan: "TRIAL_14_DAYS" | "PAID_30_DAYS" | null;
  rejectionType?: "NONE" | "PAYMENT" | "PROHIBITED" | null;
  rejectionReason?: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  } | null;
  activePayment: {
    id: string;
    paymentCode: string;
    status: string;
    amount: number;
    accountAssignedAt: string;
    accountExpiresAt: string;
    isAccountActive: boolean;
    proofAttachments?: ProofAttachment[];
  } | null;
};

type PaymentMethodsRes = {
  recommended: "BANK_TRANSFER" | "PAYSTACK" | "FLUTTERWAVE" | "CARD";
  methods: { key: string; label: string }[];
};

const MAX_FILES = 3;
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export default function PaymentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useUI();
  const params = useSearchParams();
  const queryPaymentCode = params.get("code");

  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [opts, setOpts] = useState<PublishOptions | null>(null);
  const [methods, setMethods] = useState<PaymentMethodsRes | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshingAccount, setRefreshingAccount] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState("");

  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const [proofFiles, setProofFiles] = useState<File[]>([]);

  const bank = useMemo(() => opts?.bankDetails || null, [opts]);
  const paymentCode = queryPaymentCode || opts?.activePayment?.paymentCode || "";
  const price = opts?.price ?? 0;
  const existingProofs = opts?.activePayment?.proofAttachments || [];
  const isRejectedPaymentFlow =
    opts?.publishStatus === "REJECTED" && opts?.rejectionType === "PAYMENT";

  const loadPaymentDetails = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      } else {
        setRefreshingAccount(true);
      }

      setError(null);

      const [optsRes, methodsRes] = await Promise.all([
        api.get(`/listings/${id}/publish-options`),
        api.get(`/payments/methods`),
      ]);

      setOpts(optsRes.data);
      setMethods(methodsRes.data);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        setError(e.response?.data?.message || "Failed to load payment details");
      } else if (e instanceof Error) {
        setError(e.message || "Failed to load payment details");
      } else {
        setError("Failed to load payment details");
      }
    } finally {
      setLoading(false);
      setRefreshingAccount(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadPaymentDetails();
    }
  }, [id]);


  useEffect(() => {
    const activePayment = opts?.activePayment;
  
    if (!activePayment?.accountExpiresAt || !activePayment.isAccountActive) {
      setTimeLeft(activePayment?.status === "EXPIRED" ? "Expired" : "");
      return;
    }
  
    const interval = setInterval(() => {
      const end = new Date(activePayment.accountExpiresAt).getTime();
      const now = Date.now();
      const diff = end - now;
  
      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
  
        setTimeout(() => {
          loadPaymentDetails(true);
        }, 1200);
  
        return;
      }
  
      const mins = Math.floor(diff / 1000 / 60);
      const secs = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);
    }, 1000);
  
    return () => clearInterval(interval);
  }, [opts?.activePayment?.accountExpiresAt, opts?.activePayment?.isAccountActive]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied!", "success");
    } catch {
      showToast("Copy failed. Please copy manually.", "error");
    }
  };

  const handleFileSelection = (files: FileList | null) => {
    if (!files) return;

    const picked = Array.from(files);
    const nextFiles = [...proofFiles];

    for (const file of picked) {
      if (nextFiles.length >= MAX_FILES) {
        showToast(`You can upload a maximum of ${MAX_FILES} files.`, "error");
        break;
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        showToast("Only JPG, JPEG, PNG, WEBP images or PDF files are allowed.", "error");
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        showToast("Each file must be 8MB or less.", "error");
        continue;
      }

      nextFiles.push(file);
    }

    setProofFiles(nextFiles);
  };

  const removeProofFile = (index: number) => {
    setProofFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const notify = async () => {
    try {
      setSubmitting(true);
      setError(null);

      if (!opts) throw new Error("Missing listing payment options");

      if (opts.publishPlan !== "PAID_30_DAYS") {
        setError("This listing is not set to paid publishing.");
        return;
      }

      if (!["DRAFT", "REJECTED", "EXPIRED"].includes(opts.publishStatus)) {
        setError(`You can't submit payment while listing is ${opts.publishStatus}`);
        return;
      }

      if (!price || price <= 0) {
        setError("Publish price is missing. Please contact support/admin.");
        return;
      }

      const formData = new FormData();
      formData.append("listingId", id);
      formData.append("method", "BANK_TRANSFER");
      formData.append("reference", reference);
      formData.append("note", note);

      if (isRejectedPaymentFlow) {
        proofFiles.forEach((file) => {
          formData.append("proofAttachments", file);
        });
      }

      await api.post("/payments/notify", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showToast("Submitted! Waiting for admin confirmation.", "success");
      router.push("/pending");
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        setError(e.response?.data?.message || e.message || "Failed to submit payment");
      } else if (e instanceof Error) {
        setError(e.message || "Failed to submit payment");
      } else {
        setError("Failed to submit payment");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit =
    !!opts &&
    opts.publishPlan === "PAID_30_DAYS" &&
    ["DRAFT", "REJECTED", "EXPIRED"].includes(opts.publishStatus) &&
    !!opts.activePayment &&
    !!bank &&
    timeLeft !== "Expired";

  return (
    <PlanOptions
      title="Payment Details"
      subtitle="Bank transfer is recommended. After you pay, click “I have made payment”."
    >
      <div className="mx-auto max-w-lg space-y-5">
        {loading && (
          <div className="rounded-3xl border border-gray-200 bg-white p-5 text-sm text-gray-600 shadow-sm">
            Loading...
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {!loading &&
          opts?.publishStatus === "REJECTED" &&
          opts?.rejectionType === "PAYMENT" &&
          opts?.rejectionReason && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">
              <p className="text-sm font-semibold text-red-700 mb-1">
                Payment rejection reason
              </p>
              <p className="text-sm text-red-700">{opts.rejectionReason}</p>
            </div>
          )}

        {!loading && opts && (
          <>
            <div className="rounded-3xl border border-green-200 bg-green-50 p-5 shadow-sm">
              <p className="text-sm text-green-800">
                Your listing will go live immediately after payment is confirmed.
              </p>
            </div>

            {refreshingAccount && (
              <div className="rounded-3xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
                <p className="text-sm text-blue-700">
                  Previous payment account expired. Fetching a fresh payment account...
                </p>
              </div>
            )}

            <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-gray-500">
                    Amount to pay
                  </p>
                  <h2 className="mt-2 text-4xl font-bold text-gray-900">
                    ₦{price.toLocaleString()}
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Method: {methods?.recommended || "BANK_TRANSFER"}
                  </p>
                </div>

                <span className="rounded-full bg-[#f5efe9] px-3 py-1.5 text-xs font-semibold text-[#8A715D]">
                  {timeLeft || "Loading"}
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
              <p className="text-sm font-semibold text-yellow-900">
                Make payment within 30 minutes
              </p>
              <p className="mt-1 text-sm text-yellow-800">
                Do not save this account for future use. This account expires in{" "}
                <span className="font-semibold">{timeLeft || "Loading"}</span>.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-semibold text-gray-900">
                  Transfer Details
                </h3>
                <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white">
                  Bank Transfer
                </span>
              </div>

              {bank ? (
                <>
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        Bank Name
                      </div>
                      <div className="mt-1 font-semibold text-gray-900">
                        {bank.bankName}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                      onClick={() => copy(bank.bankName)}
                    >
                      Copy
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        Account Name
                      </div>
                      <div className="mt-1 font-semibold text-gray-900">
                        {bank.accountName}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                      onClick={() => copy(bank.accountName)}
                    >
                      Copy
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        Account Number
                      </div>
                      <div className="mt-1 font-semibold text-gray-900">
                        {bank.accountNumber}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                      onClick={() => copy(bank.accountNumber)}
                    >
                      Copy
                    </button>
                  </div>

                  {paymentCode && (
                    <div className="rounded-2xl border border-dashed border-[#d9c7ba] bg-[#fcf8f4] p-4">
                      <p className="text-xs uppercase tracking-wide text-[#8A715D]">
                        Payment Code
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <div className="font-bold text-gray-900 break-all">
                          {paymentCode}
                        </div>
                        <button
                          type="button"
                          className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                          onClick={() => copy(paymentCode)}
                        >
                          Copy
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Put this in your bank transfer narration for fast payment verification.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-500">
                  No bank details available yet.
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Transfer reference optional
                </label>
                <input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. bank narration / transaction ref"
                  className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#8A715D]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Note optional
                </label>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Any extra info for admin"
                  className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#8A715D]"
                />
              </div>

              {isRejectedPaymentFlow && (
                <div className="space-y-3">
                  <div>
                    <p className="block text-sm font-medium text-gray-900">
                      Proof of payment optional
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Upload screenshot, receipt, bank statement crop, transfer slip or PDF.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    <Camera className="h-4 w-4" />
                    Camera
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    <Paperclip className="h-4 w-4" />
                    Upload Files
                  </button>

                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleFileSelection(e.target.files)}
                  />

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileSelection(e.target.files)}
                  />

                  {proofFiles.length > 0 && (
                    <div className="space-y-2">
                      {proofFiles.map((file, index) => {
                        const isPdf = file.type === "application/pdf";

                        return (
                          <div
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {isPdf ? (
                                <FileText className="h-5 w-5 shrink-0 text-red-500" />
                              ) : (
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  className="h-12 w-12 rounded-xl object-cover"
                                />
                              )}

                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-gray-900">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeProofFile(index)}
                              className="rounded-xl p-2 text-gray-500 hover:bg-gray-200"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {existingProofs.length > 0 && (
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                      <p className="text-sm font-medium text-blue-800">
                        Existing uploaded proof
                      </p>

                      <div className="mt-3 space-y-2">
                        {existingProofs.map((item, index) => {
                          const isPdf =
                            item.resource_type === "raw" ||
                            item.url?.toLowerCase().includes(".pdf");

                          return (
                            <a
                              key={`${item.public_id}-${index}`}
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white p-3 hover:bg-blue-50"
                            >
                              {isPdf ? (
                                <FileText className="h-5 w-5 text-red-500" />
                              ) : (
                                <img
                                  src={item.url}
                                  alt={item.originalName || "Payment proof"}
                                  className="h-12 w-12 rounded-xl object-cover"
                                />
                              )}

                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-gray-900">
                                  {item.originalName || `Proof ${index + 1}`}
                                </p>
                                <p className="text-xs text-gray-500">Tap to open</p>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                disabled={submitting || !canSubmit}
                onClick={notify}
                className="w-full rounded-2xl bg-[#8A715D] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "I have made payment"}
              </button>

              {!isRejectedPaymentFlow && (
                <button
                  type="button"
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
                  onClick={() => router.push(`/listings/${id}/payment`)}
                >
                  Back to plan selection
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </PlanOptions>
  );
}