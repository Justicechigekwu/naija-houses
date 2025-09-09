'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/libs/api";
import RelatedListing from "@/components/RelatedListing";
import deleteListing from "@/controllers/Delete";
import { useAuth } from "@/context/AuthContext";

interface Listing {
  _id: string;
  title: string;
  listingType: string;
  propertyType: string;
  price: number;
  location: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  city: string;
  state: string;
  furnished: boolean;
  images: string[];
  status: string;
  owner: string;
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
        ownerId: listing?.owner
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
        .then((res) => setListing(res.data))
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

  const isOwner = user?.id === listing.owner;

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
          src={`http://localhost:5000${listing.images[currentImageIndex]}`}
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
            src={`http://localhost:5000${listing.images[0]}`}
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
                key={index + 1}
                src={`http://localhost:5000${img}`}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">{listing.title}</h1>
          <p className="text-green-600 font-bold text-lg">
            ₦{listing.price.toLocaleString()}
          </p>
          <p>
            <strong>Type:</strong> {listing.listingType}
          </p>
          <p>
            <strong>Property Type:</strong> {listing.propertyType}
          </p>
          <p>
            <strong>Location:</strong> {listing.location}, {listing.city},{" "}
            {listing.state}
          </p>
          <p>
            <strong>Size:</strong> {listing.size} sqm
          </p>
          <p>
            <strong>Bedrooms:</strong> {listing.bedrooms}
          </p>
          <p>
            <strong>Bathrooms:</strong> {listing.bathrooms}
          </p>
          <p>
            <strong>Parking Spaces:</strong> {listing.parkingSpaces}
          </p>
          <p>
            <strong>Furnished:</strong> {listing.furnished ? "Yes" : "No"}
          </p>
          <p>
            <strong>Status:</strong> {listing.status}
          </p>

          {isOwner && (
            // <div className="flex gap-4 mt-4">
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={() => router.push(`/listings/edit/${listing._id}`)}
                className="bg-yellow-500 sm:w-auto text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 sm:w-auto text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {!isOwner && (
          <div className="border rounded p-4 bg-gray-50">
            <p className="font-semibold mb-2">Message Owner</p>

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
        )}
      </div>
    </div>

    <RelatedListing listingId={listing._id} />
  </div>
  );
}
