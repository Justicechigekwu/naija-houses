
export function getImageUrl(path?: string) {
  if (!path) return "/placeholder.jpg";
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:5000";
  return `${apiBase}${path}`;
}







// import { getImageUrl } from "@/utils/getImageUrl";

// <img
//   src={getImageUrl(listings.images?.[0])}
//   alt={listings.title}
//   className="w-full h-48 object-cover"
// />


//   <img
//       src={getImageUrl(listing.images?.[0])}
//       alt={listing.title}
//       className="w-full h-48 object-cover"
//     />
