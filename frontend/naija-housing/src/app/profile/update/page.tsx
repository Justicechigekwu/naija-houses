"use client";

import ProfileForm from "@/components/ProfileForm";
// import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import { HelpCircle, Palette, Settings, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UpdateProfilePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#F5F5F5] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => router.push("/profile")}
          className="mb-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </button>

        <div className="mb-6 rounded-3xl bg-gradient-to-r from-[#8A715D] to-[#A58A73] px-6 py-8 text-white shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white/15 p-3">
              <Settings className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Update Profile
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">
                Manage your personal information, account security, appearance,
                and support options from one place.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <ProfileForm />
          </div>

          <aside className="space-y-4 self-start lg:sticky lg:top-24">
            <Link
              href="/help"
              className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-[#EEF5EF] p-2 text-[#2C6B3F]">
                  <HelpCircle className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Help Center
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Read FAQs, terms, privacy policy, refund policy, and other
                    important pages.
                  </p>
                </div>
              </div>
            </Link>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start gap-3">
                <div className="rounded-xl bg-gray-100 p-2 text-gray-700">
                  <Palette className="h-5 w-5" />
                </div>

                {/* <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Appearance
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Switch your theme to the mode you prefer while using Velora.
                  </p>
                </div> */}
              </div>

              {/* <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <ThemeToggle />
              </div> */}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}