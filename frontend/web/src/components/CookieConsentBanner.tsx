"use client";

import { useBrowsingLocation } from "@/context/BrowsingLocationContext";

export default function CookieConsentBanner() {
  const {
    hasConsentChoice,
    acceptCookies,
    acceptNecessaryOnly,
  } = useBrowsingLocation();

  if (hasConsentChoice) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] border-t bg-white shadow-2xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <h3 className="text-base font-semibold text-gray-900">
              We use cookies
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Velora uses necessary cookies for sign-in and security, and optional
              preference cookies to remember your browsing location and listing
              preferences.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={acceptNecessaryOnly}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Necessary only
            </button>

            <button
              onClick={acceptCookies}
              className="rounded-lg bg-[#8A715D] px-4 py-2 text-sm font-medium text-white hover:bg-[#7A6352]"
            >
              Accept preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}