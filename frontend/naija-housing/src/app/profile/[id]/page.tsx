"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/libs/api";
import Link from "next/link";
import PublicProfileDetails from "@/components/PublicProfileDetails";
import PublicUserListings from "@/components/PublicUserListings";
import StarRating from "@/components/reviews/StarRating";
import { useAuth } from "@/context/AuthContext";

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const id = params?.id as string;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    if (user?.id && user.id === id) {
      router.replace("/profile");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/profile/public/${id}`);
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to fetch public profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, user?.id, router]);

  if (loading) {
    return <div className="min-h-screen p-6">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen p-6">User not found.</div>;
  }

  return (
    <div className="bg-[#EDEDED]z min-h-screen p-6">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:w-[30%] bg-white rounded-2xl shadow overflow-hidden self-start">
          <div className="p-6 flex flex-col items-center text-center border-b">
            <img
              src={profile.avatar || "/default-avatar.png"}
              alt={`${profile.firstName} ${profile.lastName}`}
              className="w-32 h-32 rounded-full border object-cover"
            />

            <div className="mt-4 w-full">
              <PublicProfileDetails user={profile} />
            </div>

            <div className="mt-6 w-full text-left">
              <Link
                href={`/profile/${profile.id}/reviews`}
                className="block px-4 py-3 border rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Ratings</span>
                  <span className="text-sm text-gray-600">
                    {profile.totalReviews || 0}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <StarRating value={profile.averageRating || 0} size={20} />
                  <span className="text-sm text-gray-500">
                    {(profile.averageRating || 0).toFixed(1)}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[70%] bg-white rounded-2xl shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Active listings</h2>
            <PublicUserListings userId={profile.id} />
          </div>
        </div>
      </div>
    </div>
  );
}



// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import api from "@/libs/api";
// import Link from "next/link";
// import PublicProfileDetails from "@/components/PublicProfileDetails";
// import PublicUserListings from "@/components/PublicUserListings";
// import StarRating from "@/components/reviews/StarRating";
// import { useAuth } from "@/context/AuthContext";
// import PageReadyLoader from "@/components/pages/PageReadyLoader";

// export default function PublicProfilePage() {
//   const params = useParams();
//   const router = useRouter();
//   const { user } = useAuth();

//   const id = params?.id as string;

//   const [profile, setProfile] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) {
//       setLoading(false);
//       return;
//     }

//     if (user?.id && user.id === id) {
//       router.replace("/profile");
//       return;
//     }

//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         const res = await api.get(`/profile/public/${id}`);
//         setProfile(res.data);
//       } catch (error) {
//         console.error("Failed to fetch public profile", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [id, user?.id, router]);

//   return (
//     <PageReadyLoader ready={!loading}>
//       {!profile ? (
//         <div className="min-h-screen p-6">User not found.</div>
//       ) : (
//         <div className="bg-[#EDEDED] min-h-screen p-6">
//           <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 items-start">
//             <div className="w-full lg:w-[30%] bg-white rounded-2xl shadow overflow-hidden self-start">
//               <div className="p-6 flex flex-col items-center text-center border-b">
//                 <img
//                   src={profile.avatar || "/default-avatar.png"}
//                   alt={`${profile.firstName} ${profile.lastName}`}
//                   className="w-32 h-32 rounded-full border object-cover"
//                 />

//                 <div className="mt-4 w-full">
//                   <PublicProfileDetails user={profile} />
//                 </div>

//                 <div className="mt-6 w-full text-left">
//                   <Link
//                     href={`/profile/${profile.id}/reviews`}
//                     className="block px-4 py-3 border rounded-lg hover:bg-gray-50 transition"
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className="font-medium">Ratings</span>
//                       <span className="text-sm text-gray-600">
//                         {profile.totalReviews || 0}
//                       </span>
//                     </div>

//                     <div className="mt-2 flex items-center gap-2">
//                       <StarRating value={profile.averageRating || 0} size={20} />
//                       <span className="text-sm text-gray-500">
//                         {(profile.averageRating || 0).toFixed(1)}
//                       </span>
//                     </div>
//                   </Link>
//                 </div>
//               </div>
//             </div>

//             <div className="w-full lg:w-[70%] bg-white rounded-2xl shadow overflow-hidden">
//               <div className="p-6">
//                 <h2 className="text-xl font-semibold mb-4">Active listings</h2>
//                 <PublicUserListings userId={profile.id} />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </PageReadyLoader>
//   );
// }