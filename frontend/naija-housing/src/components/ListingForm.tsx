"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import api from "@/libs/api";

interface ListingFormProps {
  initialData?: Partial<{
    title: string;
    listingType: string;
    propertyType: string;
    price: string;
    location: string;
    size: string | number;
    bedrooms: string | number;
    bathrooms: string | number;
    parkingSpaces: string | number;
    city: string;
    state: string;
    furnished: string;
    postedBy: string;
    images: string[];
  }>;
  onSubmit: (formData: FormData) => Promise<void>;
}

type FormShape = {
  title: string;
  listingType: string;
  propertyType: string;
  price: string;     
  location: string;
  size: string | number;
  bedrooms: string | number;
  bathrooms: string | number;
  parkingSpaces: string | number;
  city: string;
  state: string;
  furnished: string;
  postedBy: string;
};

export default function ListingForm({ initialData, onSubmit }: ListingFormProps) {
  const [step, setStep] = useState(1);
  const { id } = useParams();
  const router = useRouter();

const toAbs = (img: string) => {
  if (!img) return "";
  if (/^https?:\/\//i.test(img)) return img;
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const normalized = img.startsWith("/") ? img : `/${img}`;
  return `${base}${normalized}`;
};



  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/listings/${id}`);
        const data = res.data;
        setExistingImages(data.images || []);
      } catch (error) {
        console.error('Failed to fetch listings:', error)
      }
    };
    fetchListing();
  }, [id]);

  const [formData, setFormData] = useState<FormShape>({
    title: initialData?.title || "",
    listingType: initialData?.listingType || "",
    propertyType: initialData?.propertyType || "",
    price: initialData?.price || "",
    location: initialData?.location || "",
    size: initialData?.size ?? "",
    bedrooms: initialData?.bedrooms ?? "",
    bathrooms: initialData?.bathrooms ?? "",
    parkingSpaces: initialData?.parkingSpaces ?? "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    furnished: initialData?.furnished || "",
    postedBy: initialData?.postedBy || "",
  });

  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);

  const [images, setImages] = useState<File[]>([]);

  
  function formatPriceInput(value: string) {
    const match = value.match(/^([\d\s,\.]*)(.*)$/); 
    if (!match) return value;
    const rawNum = match[1].replace(/[^\d]/g, "");
    const tail = match[2] ?? "";
    const formattedNum = rawNum ? Number(rawNum).toLocaleString() : "";
    const trimmedTail = tail.replace(/^\s+/, ""); 
    return trimmedTail ? `${formattedNum} ${trimmedTail}`.trim() : formattedNum;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "price") {
      setFormData((prev) => ({ ...prev, price: formatPriceInput(value) }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      setImages((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const removeNewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (img: string) => {
    setExistingImages((prev) => prev.filter((i) => i !== img))
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    (Object.keys(formData) as Array<keyof FormShape>).forEach((key) => {
      const val = formData[key];
      data.append(String(key), val != null ? String(val) : "");
    });

    existingImages.forEach((img) => {
      data.append("keepImages", img);
    });

    images.forEach((image) => {
      data.append('images', image)
    });

    await onSubmit(data);
  };

  return (
    <div className="max-w-3xl border bg-[#F5F5F5] rounded shadow mx-auto p-6">
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xl text-gray-700 mb-2">Listing Type</label>
              <select
                name="listingType"
                value={formData.listingType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">Select Listing Type</option>
                <option value="Sale">Sale</option>
                <option value="Rent">Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-xl text-gray-700 mb-2">Posted By</label>
              <select
                name="postedBy"
                value={formData.postedBy}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">Select</option>
                <option value="Owner">Owner</option>
                <option value="Agent">Agent</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!formData.listingType || !formData.postedBy}
              className="w-full bg-green-600 text-white text-lg py-3 rounded-md hover:bg-green-700 transition disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-2xl text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter property title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 border border-gray-400 rounded-md text-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-2xl text-gray-700 mb-2">Property Type</label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 border border-gray-400 rounded-md text-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">Select Property Type</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Duplex">Duplex</option>
                <option value="Bungalow">Bungalow</option>
                <option value="Mansion">Mansion</option>
              </select>
            </div>

            <div>
              <label className="block text-2xl text-gray-700 mb-2">Price</label>
              <input
                type="text"
                name="price"
                placeholder="e.g. 5000 or 5000 per apartment"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 border border-gray-400 rounded-md text-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-2xl text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                placeholder="Enter location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 border border-gray-400 rounded-md text-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-2xl text-gray-700 mb-2">Size (sqm)</label>
                <input
                  type="number"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border border-gray-400 rounded-md text-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-2xl text-gray-700 mb-2">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border border-gray-400 rounded-md text-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-2xl text-gray-700 mb-2">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border border-gray-400 rounded-md text-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-2xl text-gray-700 mb-2">Parking Spaces</label>
                <input
                  placeholder="Optional"
                  type="number"
                  name="parkingSpaces"
                  value={formData.parkingSpaces}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border border-gray-400 rounded-md text-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-2xl text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border border-gray-400 rounded-md text-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-2xl text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 border border-gray-400 rounded-md text-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-2xl text-gray-700 mb-2">Furnished?</label>
              <select
                name="furnished"
                value={formData.furnished}
                onChange={handleChange}
                className="w-full px-4 py-4 border border-gray-400 rounded-md text-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">Choose option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label className="block text-2xl text-gray-700 mb-2">Upload Images</label>
              <input
                type="file"
                name="images"
                multiple
                onChange={handleImageChange}
                className="w-full px-4 py-4 border border-gray-400 rounded-md text-xl bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              />

              {existingImages.length > 0 && (
                <div>
                  <p className="text-xl text-gray-700 mb-2">Existing Images</p>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4">
                    {existingImages.map((img, i) => (
                      <div key={i} className="relative group">
                        <img
                        src={toAbs(img)}
                        alt={`existing-${i}`}
                        className="w-full h-32 object-cover rounded-md border"
                        />
                        <button
                        type="button"
                        onClick={() => removeExistingImage(img)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`preview-${index}`}
                        className="w-full h-32 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-gray-300 text-lg rounded-md hover:bg-gray-400 transition"
              >
                Back
              </button>

              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white text-lg rounded-md hover:bg-green-700 transition"
              >
                {initialData ? "Update Listing" : "Create Listing"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
