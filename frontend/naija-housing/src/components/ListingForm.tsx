"use client";
import { useState } from "react";

interface ListingFormProps {
  initialData?: any;
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function ListingForm({ initialData, onSubmit }: ListingFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    listingType: initialData?.listingType || "",
    propertyType: initialData?.propertyType || "",
    salePrice: initialData?.salePrice || "",
    rentPrice: initialData?.rentPrice || "",
    location: initialData?.location || "",
    size: initialData?.size || "",
    bedrooms: initialData?.bedrooms || "",
    bathrooms: initialData?.bathrooms || "",
    parkingSpaces: initialData?.parkingSpaces || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    furnished: initialData?.furnished || "",
    status: initialData?.status || "",
  });

  const [images, setImages] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    // Append text fields
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key as keyof typeof formData]);
    });

    // Append images
    images.forEach((image) => {
      data.append("images", image);
    });

    await onSubmit(data);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />

        <select name="listingType" value={formData.listingType} onChange={handleChange} required>
          <option value="">Select Listing Type</option>
          <option value="Sale">Sale</option>
          <option value="Rent">Rent</option>
        </select>

        <input type="text" name="propertyType" placeholder="Property Type" value={formData.propertyType} onChange={handleChange} required />

        <input type="number" name="salePrice" placeholder="Sale Price" value={formData.salePrice} onChange={handleChange} />
        <input type="number" name="rentPrice" placeholder="Rent Price" value={formData.rentPrice} onChange={handleChange} />

        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <input type="number" name="size" placeholder="Size" value={formData.size} onChange={handleChange} />
        <input type="number" name="bedrooms" placeholder="Bedrooms" value={formData.bedrooms} onChange={handleChange} />
        <input type="number" name="bathrooms" placeholder="Bathrooms" value={formData.bathrooms} onChange={handleChange} />
        <input type="number" name="parkingSpaces" placeholder="Parking Spaces" value={formData.parkingSpaces} onChange={handleChange} />

        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
        <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} />

        <select name="furnished" value={formData.furnished} onChange={handleChange}>
          <option value="">Furnished?</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="">Status</option>
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
          <option value="Rented">Rented</option>
        </select>

        <input type="file" name="images" multiple onChange={handleImageChange} />

        <button type="submit">{initialData ? "Update Listing" : "Create Listing"}</button>
      </form>
    </div>
  );
}
