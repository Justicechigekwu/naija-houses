'use client'

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import api from "@/libs/api"

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

export default function ListingDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [listings, setListings] = useState<Listing | null>(null);
  const [userId, setUserId] = useState<string>("")

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect( () => {
    if (id) {
      api.get(`/listings/${id}`)
      .then((res) => setListings(res.data))
      .catch((err) => console.error('Error fetcing listing:', err));
    }
  }, [id]);

  if (!listings) return <p className="p-6">Loading effect soon</p>

  const isOwner = listings.owner === userId;

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage =  () => {
   if (listings.images) {
      setCurrentImageIndex((prev) => (prev! + 1) % listings.images.length);
    }
  };

  const prevImage = () => {
    if (listings.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? listings.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3x1 font-bold mb-4">{listings.title}</h1>

      {listings.images?.[0] && (
        <img
        src={`http://localhost:5000${listings.images[0]}`}
        alt={listings.title}
        className="w-full h-[400px] object-cover rounded mb-4 cursor-pointer"
        onClick={() => openModal(0)}
        />
      )}

      {listings.images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto">
          {listings.images.slice(1).map((image, index) => (
            <img
            key={index + 1}
            src={`http://localhost:5000${image}`}
            alt={`${listings.title} - ${index + 2}`}
            className="w-32 h-24 object-cover rounded cursor-pointer hover:opacity-80"
            onClick={() => openModal(index + 1)}
            />
          ))}
        </div>
      )}

      <p
      className="text-green-500 font-bold"
      ><strong></strong> ₦{(listings.price)?.toLocaleString() }</p>
      <p><strong>Type:</strong> {listings.listingType}</p>
      <p><span>Property Type</span> {listings.propertyType}</p>
      <p> <span className="text-sm">location:</span>{listings.location}, {listings.city}, {listings.state}</p>
      <p>Size {listings.size} sqm</p>
      <p>Bedrooms <span> </span>{listings.bedrooms}</p>
      <p>Bathrooms<span> </span> {listings.bathrooms}</p>
      <p><span>Parking Spaces</span> {listings.parkingSpaces}</p>
      <p><strong>Furnished:</strong> {listings.furnished ? "Yes" : "No"}</p>
      <p><strong>Status:</strong> {listings.status}</p>

      {isOwner && (
        <div className="mt-6 flex gap-4">
          <button
          onClick={ () => router.push(`/listings/edit/${listings._id}`)}
          className="bg-yellow-500 text-white px-4 py-2 rounded">
            Edit
          </button>
          <button
          onClick={async () => {
            if (confirm('Are you sure you want to delete this ad?')) {
              await api.delete(`listings/${listings._id}`);
              alert('Property deleted successfully');
              router.push('/');
            }
          }}
          className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      )}
      {isModalOpen && listings.images && (
            <div
              className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
              onClick={closeModal}
            >
              <div
                className="relative max-w-4xl max-h-[90vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()} 
              >
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 text-black font-bold shadow z-10"
                >
                  ×
                </button>
                <button
                  onClick={prevImage}
                  className="absolute left-2 bg-white bg-opacity-80 hover:bg-opacity-100 px-3 py-2 rounded-full shadow z-10"
                >
                  ‹
                </button>
                <img
                  src={`http://localhost:5000${listings.images[currentImageIndex]}`}
                  alt="Full size"
                  className="max-w-full max-h-[80vh] rounded"
                />
                <button
                  onClick={nextImage}
                  className="absolute right-2 bg-white bg-opacity-80 hover:bg-opacity-100 px-3 py-2 rounded-full shadow z-10"
                >
                  ›
                </button>
              </div>
            </div>
          )}
    </div>
  );
}