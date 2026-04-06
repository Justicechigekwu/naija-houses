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

//       showToast("Submitted! Waiting for confirmation, This usually take 5 mins to 2 hours to be reviewed", "success");
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
//       {loading && <div className="text-sm text-gray-600">Loading...</div>}
//       {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

//       {!loading && opts && (
//         <div className="space-y-5">
//           <div className="rounded-xl border border-gray-200 p-4">
//             <div className="flex items-start justify-between gap-4">
//               <div>
//                 <h2 className="text-base font-semibold text-gray-900">Publish Fee</h2>
//                 <p className="mt-1 text-base text-gray-600">
//                   ₦<span className="font-semibold">{price.toLocaleString()}</span> for{" "}
//                   {opts.paidDays} days.
//                 </p>
//               </div>

//               <span className="rounded-full bg-[#8A715D] px-3 py-1 text-xs font-medium text-white">
//                 Paid Plan
//               </span>
//             </div>
//           </div>

//           {opts?.activePayment?.isAccountActive && (
//             <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
//               <div className="font-medium">Make payment within 30 minutes</div>
//               <div className="mt-1">
//                 Do not save this account for future use. This account expires in{" "}
//                 <span className="font-semibold">{timeLeft}</span>.
//               </div>
//             </div>
//           )}

//           <div className="rounded-xl border border-gray-200 p-4">
//             <div className="flex items-center justify-between">
//               <h2 className="text-base font-semibold text-gray-900">Recommended method</h2>
//               <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white">
//                 {methods?.recommended === "BANK_TRANSFER" ? "Bank Transfer" : methods?.recommended}
//               </span>
//             </div>

//             {opts?.activePayment && !opts.activePayment.isAccountActive && (
//              <button
//                type="button"
//                onClick={() => router.push(`/listing-actions/${id}/payment`)}
//                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white"
//              >
//                Get New Payment Account
//              </button>
//            )}

//             {!bank ? (
//               <div className="mt-3 text-sm text-gray-600">No bank details available.</div>
//             ) : (
//               <div className="mt-4 space-y-3 text-sm">
//                 <div className="flex items-center justify-between gap-3">
//                   <div>
//                     <div className="text-xs text-gray-500">Bank</div>
//                     <div className="font-medium text-gray-900">{bank.bankName}</div>
//                   </div>
//                   <button
//                     type="button"
//                     className="rounded-lg border px-3 py-2 text-xs"
//                     onClick={() => copy(bank.bankName)}
//                   >
//                     Copy
//                   </button>
//                 </div>

//                 <div className="flex items-center justify-between gap-3">
//                   <div>
//                     <div className="text-xs text-gray-500">Account Name</div>
//                     <div className="font-medium text-gray-900">{bank.accountName}</div>
//                   </div>
//                   <button
//                     type="button"
//                     className="rounded-lg border px-3 py-2 text-xs"
//                     onClick={() => copy(bank.accountName)}
//                   >
//                     Copy
//                   </button>
//                 </div>

//                 <div className="flex items-center justify-between gap-3">
//                   <div>
//                     <div className="text-xs text-gray-500">Account Number</div>
//                     <div className="font-medium text-gray-900">{bank.accountNumber}</div>
//                   </div>
//                   <button
//                     type="button"
//                     className="rounded-lg border px-3 py-2 text-xs"
//                     onClick={() => copy(bank.accountNumber)}
//                   >
//                     Copy
//                   </button>
//                 </div>

//                 {paymentCode && (
//                   <div className="flex items-center justify-between gap-3">
//                     <div>
//                       <div className="text-xs text-gray-500">Narration / Reference</div>
//                       <div className="font-semibold text-gray-900">{paymentCode}</div>
//                       <div className="text-xs text-gray-500 mt-1">
//                         Put this in your bank transfer narration for fast payment verification.
//                       </div>
//                     </div>

//                     <button
//                       type="button"
//                       className="rounded-lg border px-3 py-2 text-xs"
//                       onClick={() => copy(paymentCode)}
//                     >
//                       Copy
//                     </button>
//                   </div>
//                 )}

//                 <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
//                   After you transfer, enter a reference optional and click <b>I have made payment</b>.
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="rounded-xl border border-gray-200 p-4 space-y-3">
//             <div>
//               <label className="block text-sm font-medium text-gray-900">
//                 Transfer reference optional
//               </label>
//               <input
//                 value={reference}
//                 onChange={(e) => setReference(e.target.value)}
//                 placeholder="e.g. bank narration / transaction ref"
//                 className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-900">Note optional</label>
//               <input
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//                 placeholder="Any extra info for admin"
//                 className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>

//             <button
//               disabled={submitting}
//               onClick={notify}
//               className="w-full rounded-lg bg-[#8A715D] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
//             >
//               {submitting ? "Submitting..." : "I have made payment"}
//             </button>

//             <button
//               type="button"
//               className="w-full rounded-lg border px-4 py-2.5 text-sm font-medium"
//               onClick={() => router.push(`/listings/${id}/payment`)}
//             >
//               Back to plan selection
//             </button>
//           </div>
//         </div>
//       )}
//     </PlanOptions>
//   );
// }



"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import api from "@/libs/api";
import PlanOptions from "@/components/PlanOptions";
import { useUI } from "@/hooks/useUi";
import { AxiosError } from "axios";

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
  } | null;
};

type PaymentMethodsRes = {
  recommended: "BANK_TRANSFER" | "PAYSTACK" | "FLUTTERWAVE" | "CARD";
  methods: { key: string; label: string }[];
};

export default function PaymentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useUI();
  const params = useSearchParams();
  const queryPaymentCode = params.get("code");

  const [opts, setOpts] = useState<PublishOptions | null>(null);
  const [methods, setMethods] = useState<PaymentMethodsRes | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState("");

  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");

  const bank = useMemo(() => {
    return opts?.bankDetails || null;
  }, [opts]);

  const paymentCode = queryPaymentCode || opts?.activePayment?.paymentCode || "";
  const price = opts?.price ?? 0;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
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
      }
    };

    if (id) load();
  }, [id]);

  useEffect(() => {
    if (!opts?.activePayment?.accountExpiresAt) return;

    const interval = setInterval(() => {
      const end = new Date(opts.activePayment!.accountExpiresAt).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
        return;
      }

      const mins = Math.floor(diff / 1000 / 60);
      const secs = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [opts?.activePayment?.accountExpiresAt]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied!", "success");
    } catch {
      showToast("Copy failed. Please copy manually.", "error");
    }
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

      await api.post("/payments/notify", {
        listingId: id,
        method: "BANK_TRANSFER",
        reference,
        note,
      });

      showToast(
        "Submitted! Waiting for confirmation, This usually take 5 mins to 2 hours to be reviewed",
        "success"
      );
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

  return (
    <PlanOptions
      title="Payment Details"
      subtitle="Bank transfer is recommended. After you pay, click “I have made payment”."
    >
      <div className="space-y-6">
        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600 shadow-sm">
            Loading...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {!loading && opts && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 shadow-sm">
              Your listing will go live immediately after payment is confirmed.
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Publish Fee</h2>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    ₦{price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    for {opts.paidDays} days listing
                  </p>
                </div>

                <span className="rounded-full bg-[#8A715D] px-3 py-1 text-xs font-medium text-white shadow-sm">
                  Paid Plan
                </span>
              </div>
            </div>

            {opts?.activePayment?.isAccountActive && (
              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900 shadow-sm">
                <div className="font-semibold">Make payment within 30 minutes</div>
                <div className="mt-1">
                  Do not save this account for future use. This account expires in{" "}
                  <span className="font-semibold">{timeLeft}</span>.
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-base font-semibold text-gray-900">
                  Recommended method
                </h2>
                <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white shadow-sm">
                  {methods?.recommended === "BANK_TRANSFER"
                    ? "Bank Transfer"
                    : methods?.recommended}
                </span>
              </div>

              {opts?.activePayment && !opts.activePayment.isAccountActive && (
                <button
                  type="button"
                  onClick={() => router.push(`/listing-actions/${id}/payment`)}
                  className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                >
                  Get New Payment Account
                </button>
              )}

              {!bank ? (
                <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                  No bank details available.
                </div>
              ) : (
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        Bank
                      </div>
                      <div className="mt-1 font-semibold text-gray-900">
                        {bank.bankName}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                      onClick={() => copy(bank.bankName)}
                    >
                      Copy
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
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
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                      onClick={() => copy(bank.accountName)}
                    >
                      Copy
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
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
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                      onClick={() => copy(bank.accountNumber)}
                    >
                      Copy
                    </button>
                  </div>

                  {paymentCode && (
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                      <div>
                        <div className="text-xs uppercase tracking-wide text-gray-500">
                          Narration / Reference
                        </div>
                        <div className="mt-1 font-bold text-gray-900">
                          {paymentCode}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          Put this in your bank transfer narration for fast payment
                          verification.
                        </div>
                      </div>

                      <button
                        type="button"
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                        onClick={() => copy(paymentCode)}
                      >
                        Copy
                      </button>
                    </div>
                  )}

                  <div className="rounded-xl bg-gray-50 p-4 text-xs leading-6 text-gray-600">
                    After you transfer, enter a reference optional and click{" "}
                    <b>I have made payment</b>.
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Transfer reference optional
                </label>
                <input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. bank narration / transaction ref"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#8A715D]"
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
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#8A715D]"
                />
              </div>

              <button
                disabled={submitting}
                onClick={notify}
                className="w-full rounded-xl bg-[#8A715D] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "I have made payment"}
              </button>

              <button
                type="button"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
                onClick={() => router.push(`/listings/${id}/payment`)}
              >
                Back to plan selection
              </button>
            </div>
          </div>
        )}
      </div>
    </PlanOptions>
  );
}