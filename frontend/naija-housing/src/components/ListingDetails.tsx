'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/libs/api";
import { CATEGORY_TREE } from "@/libs/listingFormConfig";
import RelatedListing from "@/components/RelatedListing";
import deleteListing from "@/controllers/Delete";
import { useAuth } from "@/context/AuthContext";
import ReviewsList from "./reviews/ReviewList";
import FavoriteButton from "@/components/FavoriteButton";

interface Listing {
  _id: string;
  title: string;
  listingType: string;
  price: number;
  location: string;
  city: string;
  state: string;
  description: string;
  images: { url: string; public_id: string }[];
  publishStatus: string;
  category: keyof typeof CATEGORY_TREE;
  subcategory: string;
  attributes: Record<string, any>;
  owner: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  }
}

const quickMessage = [
   "Is this still available?",
   "What's the last price?",
   "Can I make a half payment?",
]

export default function ListingDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);

  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const sendMessage = async (text: string) => {
    if (!user) {
      setStatus('Please log in first');
      return;
    }
    if (!text.trim()) return;

    try {
      setSending(true);
      setStatus(null);

      const chatRes = await api.post('/chats/start', {
        listingId: listing?._id,
        ownerId: listing?.owner._id
      });
      const chatId = chatRes.data._id

      await api.post('/chats/message', {
        chatId,
        text,
      });
      setStatus('Message sent');
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message', error);
      setStatus('Failed to send')
    } finally {
      setSending(false)
    }
  };

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [maxThumbs, setMaxThumbs] = useState(6);
  
  useEffect(() => {
    if (id) {
      api.get(`/listings/${id}`)
      .then((res) => setListing(res.data.listing))
      .catch((err) => console.error("Error fetching listing:", err));
    }
  }, [id]);
  
  useEffect(() => {
    const handleResize = () => {
      setMaxThumbs(window.innerWidth < 640 ? 3 : 6);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!listing) return <p className="p-6">Loading...</p>;
  
  const categoryConfig = CATEGORY_TREE[listing.category as keyof typeof CATEGORY_TREE];
  const subcategoryConfig = categoryConfig?.subcategories?.[
    listing?.subcategory as keyof typeof categoryConfig.subcategories
  ];
  const dynamicFields = subcategoryConfig?.fields || [];

  const formAttributeValue = (value: any) => {
    if (value === undefined || value === null || value === "") return "_";
    if (Array.isArray(value)) return value.join(",");
    if (typeof value === "boolean") return value ? "yes" : "no";
    return String(value);
  };
  
  const isOwner = user?.id === listing.owner._id;
  
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this ad?")) {
      try {
        await deleteListing(listing._id);
        alert("Property deleted successfully");
        router.push("/profile");
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert(err.message);
        } else {
          alert("Something went wrong");
        }
      }
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
    {isModalOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50"
        onClick={() => setIsModalOpen(false)}
      >
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-white text-3xl"
        >
          ✕
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentImageIndex(
              (currentImageIndex - 1 + listing.images.length) %
                listing.images.length
            );
          }}
          className="absolute left-6 text-white text-4xl"
        >
          ‹
        </button>

        <img
          src={listing.images[currentImageIndex]?.url}
          alt={`Image ${currentImageIndex + 1}`}
          className="relative z-10 max-w-full max-h-screen"
          // className="rounded object-contain shadow-lg  w-auto h-auto max-w[90vw] max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentImageIndex(
              (currentImageIndex + 1) % listing.images.length
            );
          }}
          className="absolute right-6 text-white text-4xl"
        >
          ›
        </button>
      </div>
    )}

    <div className="bg-white shadow rounded-lg p-4 md:p-6">
      {listing.images?.[0] && (
        <div className="flex justify-center mb-4">
          <img
            src={listing.images[0]?.url}
            alt={listing.title}
            className="w-full md:w-[80%] max-h-[400px] object-cover rounded cursor-pointer shadow-md"
            onClick={() => {
              setCurrentImageIndex(0);
              setIsModalOpen(true);
            }}
          />
        </div>
      )}

      {listing.images.length > 1 && (
        <div className="flex justify-center mb-6">
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 w-full gap-3 md:w-[80%]">
            {listing.images.slice(1, maxThumbs).map((img, index) => (
              <img
                key={img.public_id}
                src={img.url}
                alt={`Thumb ${index + 1}`}
                className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 aspect-ratio"
                // className="w-full aspect-square object-cover rounded cursor-pointer hover:opacity-80"

                onClick={() => {
                  setCurrentImageIndex(index + 1);
                  setIsModalOpen(true);
                }}
              />
            ))}

            {listing.images.length > maxThumbs && (
              <div
                className="h-24 bg-gray-700 text-white flex items-center justify-center rounded cursor-pointer aspect-ratio"
                // className="aspect-square bg-gray-700 text-white flex items-center justify-center rounded cursor-pointer"
                onClick={() => {
                  setCurrentImageIndex(maxThumbs);
                  setIsModalOpen(true);
                }}
              >
                +{listing.images.length - (maxThumbs - 1)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> */}
      <div className="bg-white shadow rounded-lg p-4 md:p-6">

        <div className="flex justify-between">
          <div className="mb-6 divider">
            <h1 className="text-2xl md:text-3xl font-bold">{listing.title}</h1>
            <p className="text-green-600 font-bold text-lg">
              ₦{Number(listing.price).toLocaleString()}
            </p>
          </div>
        
          <div>
            {!isOwner && (
              <FavoriteButton
                listingId={listing._id}
                showText
                className="shrink-10"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 pb-6 border-b border-gray-200 border-t">

          <div className="space-y-3">
            <p className="text-base"><span className="block text-[10px] text-gray-500 uppercase">state</span> {listing.state}</p>
          </div>
        
            <p className="text-base">
               <span className="block text-[10px] text-gray-500 uppercase">city</span> {listing.city}
            </p>

            <p className="text-base">
               <span className="block text-[10px] text-gray-500 uppercase">location</span> {listing.location}
            </p>
        </div>

        <div  className="mt-6 border-6 pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
            {dynamicFields.map((field) => (
              <div key={field.key} className="text-base">
                <span className="block text-[10px] text-gray-500 uppercase">
                  {field.label}
                </span>
                <span>{formAttributeValue(listing.attributes?.[field.key])}</span>
              </div>
            ))}
          </div>
        </div>

        <div  className="pt-6 border-t">
          <p className="text-base">
            <span className="block text-[10px] text-gray-500 uppercase">Description</span>
             {listing.description}, 
          </p>
        </div>

        <div className="flex flex-col lg:flex-row w-full gap-6 items-start">
          <div className="w-full lg:w-1/2">
            {isOwner && (
              // <div className="flex gap-4 mt-4">
              <div className="flex flex-col base:flex-row gap-3 mt-4">
                <button
                  onClick={() => router.push(`/listings/edit/${listing._id}`)}
                  className="bg-yellow-500 base:w-auto text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 base:w-auto text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            )}
          
            {!isOwner && (
              <div className="w-full ">
                <div className="bg-white shadow rounded-lg p-4 md:p-6">
                  <p className="font-semibold mb-4 text-lg">Message Owner</p>
            
                  <div className="flex flex-wrap gap-2 mb-3">
                    {quickMessage.map((msg) => (
                      <button
                        key={msg}
                        onClick={() => sendMessage(msg)}
                        disabled={sending}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 text-sm"
                      >
                        {msg}
                      </button>
                    ))}
                  </div>
            
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 border rounded px-3 py-2"
                    />
                    <button
                      onClick={() => sendMessage(newMessage)}
                      disabled={sending}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      {sending ? "Sending..." : "Send"}
                    </button>
                  </div>
            
                  {status && (
                    <p className="mt-2 text-sm text-gray-600">{status}</p>
                  )}
                </div>
              </div>
            )}
          </div>  
          <div className="pt-6 w-full lg:w-1/2 ">
            <div
              onClick={() => router.push(`/profile/${listing.owner._id}`)}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80"
            >
              <img
                src={listing.owner.avatar || "/default-avatar.png"}
                alt={`${listing.owner?.firstName} ${listing.owner?.lastName}`}
                className="w-8 h-8 rounded-full object-cover border"
              />
            
              <span className="text-sm font-medium text-gray-800">
                {listing.owner.firstName} {listing.owner.lastName}
              </span>
            </div>
            <h2 className="text-lg font-semibold mb-4">
              Reviews
            </h2>
        
            {/* <ReviewsList ownerId={listing.owner._id} previewCount={1} owner={listing.owner} /> */}
            <ReviewsList ownerId={listing.owner._id} previewCount={3} />
          </div>
        </div>

      </div>
    </div>
    <RelatedListing listingId={listing._id} />
  </div>
  );
}