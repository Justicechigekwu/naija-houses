"use client";

import { useMemo } from "react";
import { useSearch } from "@/context/SearchContext";
import { useRouter } from "next/navigation";
import { CATEGORY_TREE } from "@/libs/listingFormConfig";
import { trackAnalyticsEvent } from "@/libs/analytics";

export default function SearchBar() {
  const { filters, setFilters } = useSearch();
  const router = useRouter();

  const subcategoryOptions = useMemo(() => {
    if (
      !filters.category ||
      !CATEGORY_TREE[filters.category as keyof typeof CATEGORY_TREE]
    ) {
      return [];
    }

    const categoryConfig =
      CATEGORY_TREE[filters.category as keyof typeof CATEGORY_TREE];

    return Object.entries(categoryConfig.subcategories).map(([key, value]) => ({
      key,
      label: value.label,
    }));
  }, [filters.category]);

  const handleSearch = () => {
    const trimmedSearch = filters.search?.trim() || "";

    if (!filters.category && !filters.subcategory && !trimmedSearch) {
      alert("Please enter a search value");
      return;
    }

    if (filters.category) {
      trackAnalyticsEvent({
        eventType: "CATEGORY_VIEW",
        category: filters.category,
        meta: {
          source: "searchbar-submit",
        },
      });
    }

    if (filters.category && filters.subcategory) {
      trackAnalyticsEvent({
        eventType: "SUBCATEGORY_VIEW",
        category: filters.category,
        subcategory: filters.subcategory,
        meta: {
          source: "searchbar-submit",
        },
      });
    }

    if (trimmedSearch) {
      trackAnalyticsEvent({
        eventType: "SEARCH_VIEW",
        category: filters.category || null,
        subcategory: filters.subcategory || null,
        meta: {
          source: "searchbar-submit",
          query: trimmedSearch,
        },
      });
    }

    const params = new URLSearchParams();

    if (filters.category) params.append("category", filters.category);
    if (filters.subcategory) params.append("subcategory", filters.subcategory);
    if (trimmedSearch) params.append("search", trimmedSearch);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full rounded-full flex bg-transparent justify-center mt-6">
      <div
        className="
          w-full max-w-4xl px-3 py-5 overflow-hidden
          flex flex-col gap-3
          sm:flex-row sm:gap-0 sm:items-center
          rounded-2xl sm:rounded-full bg-white
        "
      >
        <div className="w-full sm:flex-1 flex h-14 items-center px-4 bg-white sm:bg-transparent rounded-xl sm:rounded-none">
          <select
            value={filters.category || ""}
            onChange={(e) => {
              const nextCategory = e.target.value;

              setFilters({
                ...filters,
                category: nextCategory,
                subcategory: "",
              });

              if (nextCategory) {
                trackAnalyticsEvent({
                  eventType: "CATEGORY_VIEW",
                  category: nextCategory,
                  meta: {
                    source: "searchbar-select",
                  },
                });
              }
            }}
            className="w-full text-center text-medium bg-transparent outline-none"
          >
            <option value="">Category</option>
            {Object.entries(CATEGORY_TREE).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:flex-1 flex h-14 items-center px-4 bg-white sm:bg-transparent rounded-xl sm:rounded-none">
          <select
            value={filters.subcategory || ""}
            onChange={(e) => {
              const nextSubcategory = e.target.value;

              setFilters({ ...filters, subcategory: nextSubcategory });

              if (filters.category && nextSubcategory) {
                trackAnalyticsEvent({
                  eventType: "SUBCATEGORY_VIEW",
                  category: filters.category,
                  subcategory: nextSubcategory,
                  meta: {
                    source: "searchbar-select",
                  },
                });
              }
            }}
            className="w-full text-center text-medium bg-transparent outline-none"
          >
            <option value="">Subcategory</option>
            {subcategoryOptions.map((sub) => (
              <option key={sub.key} value={sub.key}>
                {sub.label}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:flex-1 flex h-14 items-center px-4 bg-white sm:bg-transparent rounded-xl sm:rounded-none">
          <input
            type="text"
            placeholder="Type here!"
            value={filters.search || ""}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
            className="w-full text-center outline-none text-medium placeholder:text-gray-900 bg-transparent"
          />
        </div>

        <button
          onClick={handleSearch}
          className="
            w-full sm:w-auto
            h-14 px-10
            rounded-xl sm:rounded-full
            text-white bg-[#8A715D] hover:bg-[#7A6352]
            font-medium flex items-center justify-center
          "
        >
          Search
        </button>
      </div>
    </div>
  );
}