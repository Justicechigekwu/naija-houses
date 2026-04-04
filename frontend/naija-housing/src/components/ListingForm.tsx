"use client";

import { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { CATEGORY_TREE } from "@/libs/listingFormConfig";
import { NIGERIA_STATES, getCitiesByState } from "@/libs/nigeriaLocations";
import { validateListingForm } from "@/libs/validateListingForm";
import { useUI } from "@/hooks/useUi";
import { Listing } from "@/types/listing";

type DynamicField = {
  key: string;
  label: string;
  type: string;
  options?: string[];
};

type SubcategoryConfig = {
  label: string;
  fields: DynamicField[];
};

interface ListingImage {
  url: string;
  public_id?: string;
}

interface ListingFormProps {
  initialData?: Listing | null;
  isEditMode?: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
}

type FormShape = {
  title: string;
  listingType: string;
  price: string;
  city: string;
  state: string;
  description: string;
  postedBy: string;
  category: string;
  subcategory: string;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_TOTAL_IMAGES = 20;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export default function ListingForm({
  initialData,
  isEditMode = false,
  onSubmit,
}: ListingFormProps) {
  const [step, setStep] = useState(1);

  const [existingImages, setExistingImages] = useState<ListingImage[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreedToListingPolicy, setAgreedToListingPolicy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [draggedExistingImageIndex, setDraggedExistingImageIndex] = useState<number | null>(null);
  const [draggedNewImageIndex, setDraggedNewImageIndex] = useState<number | null>(null);

  const { showToast } = useUI();

  const [formData, setFormData] = useState<FormShape>({
    title: "",
    listingType: "",
    price: "",
    city: "",
    state: "",
    description: "",
    postedBy: "",
    category: "PROPERTY",
    subcategory: "HOUSES_APARTMENTS",
  });

  const [attributes, setAttributes] = useState<Record<string, string>>({});

  const cityOptions = useMemo(() => {
    return getCitiesByState(formData.state);
  }, [formData.state]);

  useEffect(() => {
    if (!initialData) return;

    setFormData({
      title: initialData.title || "",
      listingType: initialData.listingType || "",
      price: initialData.price != null ? String(initialData.price) : "",
      city: initialData.city || "",
      state: initialData.state || "",
      description: initialData.description || "",
      postedBy: initialData.postedBy || "",
      category: initialData.category || "PROPERTY",
      subcategory: initialData.subcategory || "HOUSES_APARTMENTS",
    });

    setAttributes(initialData.attributes || {});
    setExistingImages(initialData.images || []);
  }, [initialData]);

  const getFieldClass = (fieldName: string) =>
    `w-full px-4 py-4 border rounded-md text-xl focus:ring-2 focus:outline-none ${
      errors[fieldName]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-400 focus:ring-[#8A715D]"
    }`;

  const dynamicFieldClass = (fieldKey: string) =>
    `w-full px-4 py-4 border rounded-md text-lg focus:ring-2 focus:outline-none ${
      errors[`attributes.${fieldKey}`]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-400 focus:ring-[#8A715D]"
    }`;

  const categoryConfig = useMemo(() => {
    return CATEGORY_TREE[formData.category as keyof typeof CATEGORY_TREE];
  }, [formData.category]);

  const subcategoryOptions = useMemo(() => {
    if (!categoryConfig) return [];
    return Object.entries(categoryConfig.subcategories).map(([key, value]) => ({
      key,
      label: value.label,
    }));
  }, [categoryConfig]);

  const fieldConfig = useMemo<DynamicField[]>(() => {
    if (!categoryConfig) return [];

    const sub = categoryConfig.subcategories[
      formData.subcategory as keyof typeof categoryConfig.subcategories
    ] as SubcategoryConfig | undefined;

    return sub?.fields ?? [];
  }, [categoryConfig, formData.subcategory]);

  const listingTypeOptions = useMemo(() => {
    if (formData.subcategory === "HOUSES_APARTMENTS") {
      return ["Sale", "Rent", "Shortlet"];
    }
    return ["Sale"];
  }, [formData.subcategory]);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });

    if (name === "price") {
      setFormData((prev) => ({ ...prev, price: formatPriceInput(value) }));
      return;
    }

    if (isEditMode && (name === "catagory" || name === "subcategory")) {
      return;
    }

    if (name === "category") {
      const nextCategory = value;
      const nextCategoryConfig =
        CATEGORY_TREE[nextCategory as keyof typeof CATEGORY_TREE];
      const firstSubcategory = Object.keys(nextCategoryConfig.subcategories)[0] || "";

      setFormData((prev) => ({
        ...prev,
        category: nextCategory,
        subcategory: firstSubcategory,
        listingType: firstSubcategory === "HOUSES_APARTMENTS" ? prev.listingType : "Sale",
      }));
      setAttributes({});
      return;
    }

    if (name === "subcategory") {
      setFormData((prev) => ({
        ...prev,
        subcategory: value,
        listingType: value === "HOUSES_APARTMENTS" ? prev.listingType : "Sale",
      }));
      setAttributes({});
      return;
    }

    if (name === "listingType") {
      setFormData((prev) => ({ ...prev, listingType: value }));
      return;
    }

    if (name === "state") {
      setFormData((prev) => ({
        ...prev,
        state: value,
        city: "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttributeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setErrors((prev) => {
      const next = { ...prev };
      delete next[`attributes.${name}`];
      return next;
    });

    setAttributes((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);
    const validFiles: File[] = [];

    for (const file of selectedFiles) {
      const isValidType = ALLOWED_IMAGE_TYPES.includes(file.type);
      const isValidSize = file.size <= MAX_IMAGE_SIZE;

      if (!isValidType) {
        showToast(
          `${file.name} is not allowed. Use JPG, JPEG, PNG or WEBP.`,
          "error"
        );
        continue;
      }

      if (!isValidSize) {
        showToast(`${file.name} is larger than 5MB.`, "error");
        continue;
      }

      validFiles.push(file);
    }

    const totalImagesAfterAdd =
      existingImages.length + images.length + validFiles.length;

    if (totalImagesAfterAdd > MAX_TOTAL_IMAGES) {
      showToast(`You can upload a maximum of ${MAX_TOTAL_IMAGES} images.`, "error");
      e.target.value = "";
      return;
    }

    if (validFiles.length > 0) {
      setImages((prev) => [...prev, ...validFiles]);
    }

    e.target.value = "";
  };

  const removeNewImage = (index: number) => {
    if (isSubmitting) return;
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (publicId: string) => {
    if (isSubmitting) return;
    if (!publicId) return;
    setExistingImages((prev) => prev.filter((img) => img.public_id !== publicId));
  };

  const handleExistingDragStart = (index: number) => {
    if (isSubmitting) return;
    setDraggedExistingImageIndex(index);
  };

  const handleExistingDrop = (index: number) => {
    if (isSubmitting) return;
    if (draggedExistingImageIndex === null || draggedExistingImageIndex === index) return;

    setExistingImages((prev) => {
      const updated = [...prev];
      const draggedItem = updated[draggedExistingImageIndex];

      if (!draggedItem) return prev;

      updated.splice(draggedExistingImageIndex, 1);
      updated.splice(index, 0, draggedItem);

      return updated;
    });

    setDraggedExistingImageIndex(null);
  };

  const handleNewDragStart = (index: number) => {
    if (isSubmitting) return;
    setDraggedNewImageIndex(index);
  };

  const handleNewDrop = (index: number) => {
    if (isSubmitting) return;
    if (draggedNewImageIndex === null || draggedNewImageIndex === index) return;

    setImages((prev) => {
      const updated = [...prev];
      const draggedItem = updated[draggedNewImageIndex];

      if (!draggedItem) return prev;

      updated.splice(draggedNewImageIndex, 1);
      updated.splice(index, 0, draggedItem);

      return updated;
    });

    setDraggedNewImageIndex(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setDraggedExistingImageIndex(null);
    setDraggedNewImageIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToListingPolicy) {
      showToast("You must agree to the listing rules before publishing.", "error");
      return;
    }

    if (isSubmitting) return;

    const nextErrors = validateListingForm(formData, attributes);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstErrorKey = Object.keys(nextErrors)[0];
      const el = document.querySelector(
        `[name="${firstErrorKey.replace("attributes.", "")}"]`
      );
      if (el instanceof HTMLElement) el.focus();
      return;
    }

    const data = new FormData();

    Object.entries(formData).forEach(([key, val]) => {
      if (key === "price") {
        const numericPrice = String(val).replace(/[^\d]/g, "");
        data.append("price", numericPrice);
      } else {
        data.append(key, val != null ? String(val) : "");
      }
    });

    data.append("attributes", JSON.stringify(attributes));

    existingImages.forEach((img) => {
      data.append("keepImages", JSON.stringify(img));
    });

    images.forEach((image) => {
      data.append("images", image);
    });

    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDynamicField = (field: {
    key: string;
    label: string;
    type: string;
    options?: string[];
  }) => {
    if (field.type === "select") {
      return (
        <select
          name={field.key}
          value={attributes[field.key] || ""}
          onChange={handleAttributeChange}
          disabled={isSubmitting}
          className={dynamicFieldClass(field.key)}
        >
          <option value="">Select {field.label}</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "textarea") {
      return (
        <textarea
          name={field.key}
          value={attributes[field.key] || ""}
          onChange={handleAttributeChange}
          placeholder={`Enter ${field.label}`}
          rows={4}
          disabled={isSubmitting}
          className={dynamicFieldClass(field.key)}
        />
      );
    }

    return (
      <input
        type={field.type}
        name={field.key}
        value={attributes[field.key] || ""}
        onChange={handleAttributeChange}
        placeholder={`Enter ${field.label}`}
        disabled={isSubmitting}
        className={dynamicFieldClass(field.key)}
      />
    );
  };

  return (
    <div className="max-w-4xl border bg-[#F5F5F5] rounded shadow mx-auto p-6">
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xl text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isSubmitting || isEditMode}
                className={`${getFieldClass("category")} ${isEditMode ? "cursor-not-allowed bg-gray-100" : ""}`}
              >
                {Object.entries(CATEGORY_TREE).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </div>

            {isEditMode && (
              <p className="text-sm text-gray-500 mt-1">
                You cannot edit category or subcategory after creating a listing.
              </p>
            )}

            <div>
              <label className="block text-xl text-gray-700 mb-2">Subcategory</label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                disabled={isSubmitting || isEditMode}
                className={`${getFieldClass("subcategory")} ${isEditMode ? "cursor-not-allowed bg-gray-100" : ""}`}
              >
                {subcategoryOptions.map((sub) => (
                  <option key={sub.key} value={sub.key}>
                    {sub.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xl text-gray-700 mb-2">Listing Type</label>
              <select
                name="listingType"
                value={formData.listingType}
                onChange={handleChange}
                disabled={isSubmitting}
                className={getFieldClass("listingType")}
              >
                <option value="">Select Listing Type</option>
                {listingTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xl text-gray-700 mb-2">Posted By</label>
              <select
                name="postedBy"
                value={formData.postedBy}
                onChange={handleChange}
                disabled={isSubmitting}
                className={getFieldClass("postedBy")}
              >
                <option value="">Select</option>
                <option value="Owner">Owner</option>
                <option value="Agent">Agent</option>
                <option value="Dealer">Dealer</option>
                <option value="Seller">Seller</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={
                isSubmitting ||
                !formData.listingType ||
                !formData.postedBy ||
                !formData.category ||
                !formData.subcategory
              }
              className="w-full bg-[#8A715D] text-white text-lg py-3 rounded-md hover:bg-[#7A6352] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-300 text-lg rounded-md hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            <div>
              <label className="block text-2xl text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter listing title"
                value={formData.title}
                onChange={handleChange}
                disabled={isSubmitting}
                className={getFieldClass("title")}
              />
            </div>

            <div>
              <label className="block text-2xl text-gray-700 mb-2">Price</label>
              <input
                type="text"
                name="price"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
                disabled={isSubmitting}
                className={getFieldClass("price")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-2xl text-gray-700 mb-2">State</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={getFieldClass("state")}
                >
                  <option value="">Select State</option>
                  {NIGERIA_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-2xl text-gray-700 mb-2">LGA</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={isSubmitting || !formData.state}
                  className={getFieldClass("city")}
                >
                  <option value="">
                    {formData.state ? "Select City / LGA" : "Select State First"}
                  </option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-2xl text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                placeholder="Describe your listing"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                disabled={isSubmitting}
                className={getFieldClass("description")}
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {subcategoryOptions.find((s) => s.key === formData.subcategory)?.label} Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fieldConfig.map((field) => (
                  <div key={field.key}>
                    <label className="block text-lg text-gray-700 mb-2">{field.label}</label>
                    {renderDynamicField(field)}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-2xl text-gray-700 mb-2">Upload Images</label>
              <input
                type="file"
                name="images"
                multiple
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={isSubmitting}
                className="w-full px-4 py-4 border border-gray-400 rounded-md text-xl bg-white focus:ring-2 focus:ring-[#8A715D] focus:outline-none disabled:opacity-60"
              />

              <p className="mt-2 text-sm text-gray-600">
                Max image size 5MB allowed. File types: JPG, PNG, JPEG and WEBP.
              </p>

              <p className="mt-1 text-sm text-red-500">
                Maximum of 20 images allowed.
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Drag any image to the front. The first image becomes the title image.
              </p>

              {existingImages.length > 0 && (
                <div>
                  <p className="text-xl text-gray-700 mb-2 mt-4">Existing Images</p>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((img, i) => (
                      <div
                        key={img.public_id || i}
                        draggable={!isSubmitting}
                        onDragStart={() => handleExistingDragStart(i)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleExistingDrop(i)}
                        onDragEnd={handleDragEnd}
                        className={`relative group cursor-move rounded-md border bg-white transition ${
                          draggedExistingImageIndex === i ? "opacity-50 scale-[0.98]" : ""
                        }`}
                      >
                        {i === 0 && (
                          <span className="absolute top-2 left-2 z-10 bg-green-600 text-white text-xs px-2 py-1 rounded">
                            Title Image
                          </span>
                        )}

                        <img
                          src={img.url}
                          alt={`existing-${i}`}
                          className="w-full h-32 object-cover rounded-md"
                        />

                        <button
                          type="button"
                          onClick={() => img.public_id && removeExistingImage(img.public_id)}
                          disabled={isSubmitting}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100 disabled:opacity-50"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {images.length > 0 && (
                <div className="mt-4">
                  <p className="text-xl text-gray-700 mb-2">Selected Images</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                      <div
                        key={`${img.name}-${index}`}
                        draggable={!isSubmitting}
                        onDragStart={() => handleNewDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleNewDrop(index)}
                        onDragEnd={handleDragEnd}
                        className={`relative group cursor-move rounded-md border bg-white transition ${
                          draggedNewImageIndex === index ? "opacity-50 scale-[0.98]" : ""
                        }`}
                      >
                        {existingImages.length === 0 && index === 0 && (
                          <span className="absolute top-2 left-2 z-10 bg-green-600 text-white text-xs px-2 py-1 rounded">
                            Title Image
                          </span>
                        )}

                        <img
                          src={URL.createObjectURL(img)}
                          alt={`preview-${index}`}
                          className="w-full h-32 object-cover rounded-md"
                        />

                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          disabled={isSubmitting}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100 disabled:opacity-50"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
                <p className="font-semibold mb-2">Please fix the errors</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {Object.entries(errors).map(([key, value]) => (
                    <li key={key}>{value}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-md border border-gray-300 bg-white p-4 text-sm">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={agreedToListingPolicy}
                  onChange={(e) => setAgreedToListingPolicy(e.target.checked)}
                  disabled={isSubmitting}
                  className="mt-1"
                />
                <span>
                  I confirm this listing is legal, accurate, and follows Velora’s{" "}
                  <a href="/community-guidelines" className="text-blue-600 underline">
                    Community Guidelines
                  </a>{" "}
                  and{" "}
                  <a href="/prohibited-items" className="text-blue-600 underline">
                    Prohibited Items Policy
                  </a>.
                </span>
              </label>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gray-300 text-lg rounded-md hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#8A715D] text-white text-lg rounded-md hover:bg-[#7A6352] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Listing"
                  : "Create Listing"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}