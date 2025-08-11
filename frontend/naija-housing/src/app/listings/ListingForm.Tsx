"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/libs/api";

export default function ListingForm({ isEdit = false }) {
  const router = useRouter();
  const params = useParams();
  const listingId = params?.id;

  const [formData, setFormData] = useState({
    title: "",
    listingType: "Sale",
    propertyType: "House",
    salePrice: 0,
    rentPrice: 0,
    location: "",
    size: 0,
    bedrooms: 0,
    bathrooms: 0,
    parkingSpaces: 0,
    city: "",
    state: "",
    furnished: false,
    status: "Available",
  });

  useEffect(() => {
    if (isEdit && listingId) {
      api.get(`/listings/${listingId}`).then((res) => {
        setFormData(res.data.listing);
      });
    }
  }, [isEdit, listingId]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (isEdit && listingId) {
        await api.put(`/listings/${listingId}`, formData);
        alert("Listing updated successfully!");
      } else {
        await api.post("/listings", formData);
        alert("Listing created successfully!");
      }
      router.push("/listings");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">

      <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
      <input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="border p-2 w-full" required />

      <select name="listingType" value={formData.listingType} onChange={handleChange} className="border p-2 w-full">
        <option value="Sale">Sale</option>
        <option value="Rent">Rent</option>
      </select>
      <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="border p-2 w-full">
        <option>House</option>
        <option>Apartment</option>
        <option>Duplex</option>
        <option>Bungalow</option>
      </select>
      <label htmlFor="number">Price</label>
      <input id="number"  type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} placeholder="Sale Price" className="border p-2 w-full" />

      <input type="number" name="rentPrice" value={formData.rentPrice} onChange={handleChange} placeholder="Rent Price" className="border p-2 w-full" />
      <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="border p-2 w-full" required />
      <input type="number" name="size" value={formData.size} onChange={handleChange} placeholder="Size in sq ft" className="border p-2 w-full" />
      <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} placeholder="Bedrooms" className="border p-2 w-full" required />
      <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} placeholder="Bathrooms" className="border p-2 w-full" required />
      <input type="number" name="parkingSpaces" value={formData.parkingSpaces} onChange={handleChange} placeholder="Parking Spaces" className="border p-2 w-full" />
      <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="border p-2 w-full" />
      <input name="state" value={formData.state} onChange={handleChange} placeholder="State" className="border p-2 w-full" />
      <label>
        <input type="checkbox" name="furnished" checked={formData.furnished} onChange={handleChange} /> Furnished
      </label>
      <select name="status" value={formData.status} onChange={handleChange} className="border p-2 w-full">
        <option>Available</option>
        <option>Sold</option>
        <option>Rented</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {isEdit ? "Update Listing" : "Create Listing"}
      </button>
    </form>
  );
}
