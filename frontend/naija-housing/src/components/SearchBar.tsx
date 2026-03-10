
// "use client";

// import { useSearch } from "@/context/SearchContext";
// import { useRouter } from "next/navigation";

// export default function SearchBar() {
//   const { filters, setFilters } = useSearch();
//   const router = useRouter();

//   const handleSearch = () => {
//     if (!filters.state && !filters.location && !filters.type) {
//       alert("Please enter a search value");
//       return;
//     }

//     const params = new URLSearchParams();
//     if (filters.state) params.append("state", filters.state);
//     if (filters.location) params.append("location", filters.location);
//     if (filters.type) params.append("propertyType", filters.type);

//     router.push(`/search?${params.toString()}`);
//   };

//   return (
//     <div className="w-full rounded-full flex bg-transparent justify-center mt-6">
//       <div
//         className="
//           w-full max-w-4xl px-3 py-5 overflow-hidden
//           flex flex-col gap-3
//           sm:flex-row sm:gap-0 sm:items-center
//           rounded-2xl sm:rounded-full bg-white 
//         "
//       >

//         <div className="w-full sm:flex-1 flex h-14 items-center px-4 bg-white sm:bg-transparent rounded-xl sm:rounded-none">
//           <input
//             type="text"
//             placeholder="State"
//             value={filters.state || ""}
//             onChange={(e) => setFilters({ ...filters, state: e.target.value })}
//             className="w-full text-center outline-none text-medium placeholder:text-gray-900 bg-transparent"
//           />
//         </div>

//         <div className="w-full sm:flex-1 flex h-14 items-center px-4 bg-white sm:bg-transparent rounded-xl sm:rounded-none">
//           <input
//             type="text"
//             placeholder="Location"
//             value={filters.location || ""}
//             onChange={(e) => setFilters({ ...filters, location: e.target.value })}
//             className="w-full text-center outline-none text-medium placeholder:text-gray-900 bg-transparent"
//           />
//         </div>

//         <div className="w-full sm:flex-1 flex h-14 items-center px-4 bg-white sm:bg-transparent rounded-xl sm:rounded-none">
//           <select
//             value={filters.type || ""}
//             onChange={(e) => setFilters({ ...filters, type: e.target.value })}
//             className="w-full text-center text-medium bg-transparent outline-none"
//           >
//             <option value="">Type</option>
//             <option value="Apartment">Apartment</option>
//             <option value="Duplex">Duplex</option>
//             <option value="Selfcontain">Self Contain</option>
//             <option value="Bungalow">Bungalow</option>
//             <option value="Mansion">Mansion</option>
//           </select>
//         </div>

//         <button
//           onClick={handleSearch}
//           className="
//             w-full sm:w-auto
//             h-14 px-10
//             rounded-xl sm:rounded-full
//             text-white bg-[#8A715D] hover:bg-[#7A6352]
//             font-medium flex items-center justify-center
//           "
//         >
//           Search
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

import { useMemo } from "react";
import { useSearch } from "@/context/SearchContext";
import { useRouter } from "next/navigation";
import { CATEGORY_TREE } from "@/libs/listingFormConfig";

export default function SearchBar() {
  const { filters, setFilters } = useSearch();
  const router = useRouter();

  const subcategoryOptions = useMemo(() => {
    if (!filters.category || !CATEGORY_TREE[filters.category as keyof typeof CATEGORY_TREE]) {
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
    if (!filters.category && !filters.subcategory && !filters.search) {
      alert("Please enter a search value");
      return;
    }

    const params = new URLSearchParams();

    if (filters.category) params.append("category", filters.category);
    if (filters.subcategory) params.append("subcategory", filters.subcategory);
    if (filters.search) params.append("search", filters.search);

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
            onChange={(e) =>
              setFilters({
                ...filters,
                category: e.target.value,
                subcategory: "",
              })
            }
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
            onChange={(e) =>
              setFilters({ ...filters, subcategory: e.target.value })
            }
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