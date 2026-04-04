"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import PageReadyLoader from "@/components/pages/PageReadyLoader";
import useHomeLocationFeed from "@/hooks/useHomeLocationFeed";
import ListingCard from "@/components/listings/ListingCard";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/footer/Footer";
import LocationFilter from "@/components/LocationFilter";
import { useBrowsingLocation } from "@/context/BrowsingLocationContext";
import CookieConsentBanner from "@/components/CookieConsentBanner";

export default function Home() {
  const router = useRouter();
  const { user, isHydrated } = useAuth();
  const { browsingLocation, setManualLocation, resetToDeviceLocation } =
    useBrowsingLocation();

  const { listings, similarListings, meta, loading, error } = useHomeLocationFeed();

  const handleAddListing = () => {
    if (!isHydrated) return;

    if (!user) {
      router.push(`/register?redirect=/listings/create`);
    } else {
      router.push("/listings/create");
    }
  };

  const sectionTitle = useMemo(() => {
    if (browsingLocation.isManual) {
      if (browsingLocation.city && browsingLocation.state) {
        return `Listings in ${browsingLocation.city}, ${browsingLocation.state}`;
      }

      if (browsingLocation.state) {
        return `Listings in ${browsingLocation.state}`;
      }
    }

    return browsingLocation.city || browsingLocation.state
      ? "Trending listings"
      : "Recommended for you";
  }, [
    browsingLocation.isManual,
    browsingLocation.city,
    browsingLocation.state,
  ]);

  const exactEndText = useMemo(() => {
    if (!meta?.exactLocationOnly) return "";

    if (meta.selectedCity && meta.selectedState) {
      return `That is all for ${meta.selectedCity}, ${meta.selectedState}.`;
    }

    if (meta.selectedState) {
      return `That is all for ${meta.selectedState}.`;
    }

    return "";
  }, [meta]);

  const pageReady = isHydrated && !browsingLocation.loading && !loading;

  return (
    <PageReadyLoader ready={pageReady}>
      <div>
        <div
          className="relative min-h-[600px] w-full flex items-center justify-center bg-cover bg-center object-contain"
          style={{ backgroundImage: "url('/image/background.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/50" />

          <div className="relative z-10 w-full sm:w-[85%] lg:w-[70%] mx-auto py-24 px-6 md:px-12">
            <div className="text-center mx-auto ">
              <h1 className="text-3xl sm:text-4xl text-center md:text-6xl xl:text-6xl text-white font-bold text-left">
                Trade smart. Live better.
              </h1>

              <p className="mt-6 text-lg md:text-xl text-center text-white max-w-3xl text-left">
                Buy, sell and rent properties, vehicles, electronics, phones and more across Nigeria on Velora.
              </p>
            </div>

            <div className="mt-10">
              <SearchBar />
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#F5F5F5]">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold">{sectionTitle}</h2>

            <LocationFilter
              selectedState={browsingLocation.isManual ? browsingLocation.state : ""}
              selectedCity={browsingLocation.isManual ? browsingLocation.city : ""}
              onApply={({ state, city }) => {
                setManualLocation({ state, city });
              }}
              onClear={() => {
                resetToDeviceLocation();
              }}
            />
          </div>

          {browsingLocation.isManual ? (
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <button
                onClick={resetToDeviceLocation}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                My location
              </button>

              <p className="text-sm text-gray-600">
                Showing only listings for your selected location.
              </p>
            </div>
          ) : null}

          {error ? (
            <p className="text-red-500">{error}</p>
          ) : listings.length > 0 ? (
            <>
              <div className="grid grid-cols-2 w-full sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </div>

              {exactEndText ? (
                <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center">
                  <p className="text-base font-semibold text-gray-900">
                    {exactEndText}
                  </p>

                </div>
              ) : null}

              {similarListings.length > 0 ? (
                <div className="mt-10">
                  <h3 className="mb-4 text-xl font-bold">
                    Similar listings from other cities
                    {meta?.selectedState ? ` in ${meta.selectedState}` : ""}
                  </h3>

                  <div className="grid grid-cols-2 w-full sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {similarListings.map((listing) => (
                      <ListingCard key={listing._id} listing={listing} />
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <p className="text-lg font-semibold text-gray-900">
                No listings found for this location
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Try another city or switch back to your current location.
              </p>

              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={resetToDeviceLocation}
                  className="rounded-lg bg-[#8A715D] px-4 py-2 text-sm font-medium text-white hover:bg-[#7A6352]"
                >
                  My location
                </button>

                <button
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                  onClick={handleAddListing}
                >
                  Add Listing
                </button>
              </div>
            </div>
          )}
        </div>

        <Footer />
        <CookieConsentBanner />
      </div>
    </PageReadyLoader>
  );
}