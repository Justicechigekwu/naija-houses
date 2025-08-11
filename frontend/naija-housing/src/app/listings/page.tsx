"use client";

import { useState } from "react";
import axios from "axios";

export default function CreateListingPage() {
  const [formData, setFormData] = useState({
    title: "",
    listingType: "Sale",
    propertyType: "House",
    salePrice: "",
    rentPrice: "",
    location: "",
    size: "",
    bedrooms: "",
    bathrooms: "",
    parkingSpaces: "",
    city: "",
    state: "",
    furnished: false,
    images: [] as string[],
  });

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
   ) => {
    const { name, value, type, } = e.target;

    setFormData({
      ...formData,
      [name]: 
      type === "checkbox"
       ? (e.target as HTMLInputElement).checked 
       : value,
    });
  };


  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()],
      }));
      setImageUrl("");
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token"); 

      const res = await axios.post(
        "http://localhost:5000/api/listings",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Listing created successfully!");
      console.log(res.data);
      setFormData({
        title: "",
        listingType: "Sale",
        propertyType: "House",
        salePrice: "",
        rentPrice: "",
        location: "",
        size: "",
        bedrooms: "",
        bathrooms: "",
        parkingSpaces: "",
        city: "",
        state: "",
        furnished: false,
        images: [],
      });
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create New Listing</h1>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="title"
          placeholder="Listing Title"
          value={formData.title}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />

        <select name="listingType" value={formData.listingType} onChange={handleChange} className="border p-2 w-full">
          <option value="Sale">Sale</option>
          <option value="Rent">Rent</option>
        </select>

        <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="border p-2 w-full">
          <option value="House">House</option>
          <option value="Apartment">Apartment</option>
          <option value="Duplex">Duplex</option>
          <option value="Bungalow">Bungalow</option>
        </select>

        {formData.listingType === "Sale" && (
          <input
            type="number"
            name="salePrice"
            placeholder="Sale Price"
            value={formData.salePrice}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        )}

        {formData.listingType === "Rent" && (
          <input
            type="number"
            name="rentPrice"
            placeholder="Rent Price"
            value={formData.rentPrice}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        )}

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />

        <input
          type="number"
          name="size"
          placeholder="Size (sq ft)"
          value={formData.size}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          type="number"
          name="bedrooms"
          placeholder="Bedrooms"
          value={formData.bedrooms}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />

        <input
          type="number"
          name="bathrooms"
          placeholder="Bathrooms"
          value={formData.bathrooms}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />

        <input
          type="number"
          name="parkingSpaces"
          placeholder="Parking Spaces"
          value={formData.parkingSpaces}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="furnished"
            checked={formData.furnished}
            onChange={handleChange}
          />
          <span>Furnished</span>
        </label>

        <div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="border p-2 flex-1"
            />
            <button type="button" onClick={handleAddImage} className="bg-blue-500 text-white px-4 py-2 rounded">
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.images.map((img, idx) => (
              <img key={idx} src={img} alt="Listing" className="w-20 h-20 object-cover border" />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Creating..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
}
