"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Mail, Send, MapPin, Phone, User, FileText } from "lucide-react";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalSection from "@/components/legal/LegalSection";
import api from "@/libs/api";
import { useUI } from "@/hooks/useUi";

type Props = {
  embedded?: boolean;
};

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  reason: string;
  message: string;
};

const INITIAL_STATE: FormState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  reason: "",
  message: "",
};

export default function ContactContent({ embedded = false }: Props) {
  const { showToast } = useUI();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const prefill = async () => {
      try {
        const res = await api.get("/auth/me");
        const user = res.data?.user;

        if (!cancelled && user) {
          setForm((prev) => ({
            ...prev,
            fullName:
              `${user.firstName || ""} ${user.lastName || ""}`.trim() || prev.fullName,
            email: user.email || prev.email,
            phone: user.phone || prev.phone,
            address: user.location || prev.address,
          }));
        }
      } catch {
        // guest user, ignore
      }
    };

    prefill();

    return () => {
      cancelled = true;
    };
  }, []);

  const setField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const res = await api.post("/support", form);

      showToast(
        res.data?.message || "Your support request has been sent successfully.",
        "success"
      );

      setForm((prev) => ({
        ...INITIAL_STATE,
        fullName: prev.fullName,
        email: prev.email,
        phone: prev.phone,
        address: prev.address,
      }));
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            showToast(
              error.response?.data?.message || "Failed to send support request",
              "error"
            );
          } else {
            showToast("Failed to send support request", "error");
          }
        } finally {
      setSubmitting(false);
    }
  };

  const supportEmail = "support@velora.com";
  const mailtoHref = `mailto:${supportEmail}?subject=${encodeURIComponent(
    "Velora Support Request"
  )}`;

  return (
    <LegalPageLayout
      embedded={embedded}
      title="Contact Velora Support"
      description="Need help with your account, listings, payments, reports, or appeals? Contact Velora support here."
    >
      <LegalSection title="1. Send a support form">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setField("fullName", e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-black"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-black"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone number
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setField("address", e.target.value)}
                    placeholder="Enter your address"
                    className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-black"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Reason
              </label>
              <div className="relative">
                <FileText className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={form.reason}
                  onChange={(e) => setField("reason", e.target.value)}
                  placeholder="Example: payment issue, account problem, listing issue"
                  className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-black"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Message / Description
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setField("message", e.target.value)}
                placeholder="Explain the problem clearly so support can help faster."
                rows={6}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {submitting ? "Sending..." : "Send support request"}
            </button>
          </form>
        </div>
      </LegalSection>

      <LegalSection title="2. Contact us directly by email">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-gray-700">
            You can also contact Velora directly through your device email app.
          </p>

          <a
            href={mailtoHref}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
          >
            <Mail className="h-4 w-4" />
            {supportEmail}
          </a>

          <p className="mt-3 text-sm text-gray-500">
            Clicking the email address opens your device mail app.
          </p>
        </div>
      </LegalSection>
    </LegalPageLayout>
  );
}