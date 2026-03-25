"use client";

import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import PageReadyLoader from "@/components/pages/PageReadyLoader";
import useHomeLocationFeed from "@/hooks/useHomeLocationFeed";
import ListingCard from "@/components/listings/ListingCard";
import { useAuth } from "@/context/AuthContext";
import Footer from '@/components/footer/Footer';

export default function Home() {
  const router = useRouter();
  const { user, isHydrated } = useAuth();

  const { listings, loading, error, userLocation } = useHomeLocationFeed();

  const handleAddListing = () => {
    if (!isHydrated) return;

    if (!user) {
      router.push(`/register?redirect=/listings/create`);
    } else {
      router.push("/listings/create");
    }
  };

  const sectionTitle =
    userLocation.city || userLocation.state
      ? "Trending in your location"
      : "Recommended for you";

  const pageReady = !userLocation.loading && !loading && isHydrated;

  return (
    <PageReadyLoader ready={pageReady}>
      <div>
        <div
          className="
            relative
            min-h-[600px]
            w-full
            flex items-center justify-center
            bg-cover bg-center
            object-contain
          "
          style={{ backgroundImage: "url('/image/duplex.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/50"></div>

          <div className="relative z-10 w-full sm:w-[85%] lg:w-[70%] mx-auto py-24 px-6 md:px-12">
            <div className="text-center mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-6xl xl:text-6xl text-white font-bold text-left">
                Trade smart. Live better.
              </h1>

              <p className="mt-6 text-lg md:text-xl text-white max-w-3xl text-left">
                Our platform is a digitally integrated marketplace that helps users
                buy, sell, and rent seamlessly.
              </p>
            </div>

            <div className="mt-10">
              <SearchBar />
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#F5F5F5]">
          {!loading && !error && listings.length === 0 && (
            <div className="flex justify-between items-center mb-6">
              <button
                className="bg-[#8A715D] hover:bg-[#7A6352] text-white px-4 py-2 rounded"
                onClick={handleAddListing}
              >
                Add Listing
              </button>
            </div>
          )}

          {!loading && !error && listings.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{sectionTitle}</h2>
            </div>
          )}

          {error ? (
            <p className="text-red-500">{error}</p>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-2 w-full sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          ) : !error ? (
            <p>No listing available yet, be the first to post a property</p>
          ) : null}
        </div>
      </div>
      <Footer/>
    </PageReadyLoader>
  );
}