"use client";

import { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { CATEGORY_TREE } from "@/libs/listingFormConfig";
import { validateListingForm } from "@/libs/validateListingForm";

interface ListingImage {
  url: string;
  public_id: string;
}

interface ListingFormProps {
  initialData?: Partial<{
    title: string;
    listingType: string;
    price: string;
    location: string;
    city: string;
    state: string;
    description: string;
    postedBy: string;
    category: string;
    subcategory: string;
    attributes: Record<string, any>;
    images: ListingImage[];
  }>;
  isEditMode?: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
}

type FormShape = {
  title: string;
  listingType: string;
  price: string;
  location: string;
  city: string;
  state: string;
  description: string;
  postedBy: string;
  category: string;
  subcategory: string;
};

export default function ListingForm({
  initialData,
  isEditMode = false,
  onSubmit,
}: ListingFormProps) {
  const [step, setStep] = useState(1);

  const [existingImages, setExistingImages] = useState<ListingImage[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormShape>({
    title: "",
    listingType: "",
    price: "",
    location: "",
    city: "",
    state: "",
    description: "",
    postedBy: "",
    category: "PROPERTY",
    subcategory: "HOUSES_APARTMENTS",
  });

  const [attributes, setAttributes] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!initialData) return;

    setFormData({
      title: initialData.title || "",
      listingType: initialData.listingType || "",
      price: initialData.price || "",
      location: initialData.location || "",
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
        : "border-gray-400 focus:ring-green-500"
    }`;

  const dynamicFieldClass = (fieldKey: string) =>
    `w-full px-4 py-4 border rounded-md text-lg focus:ring-2 focus:outline-none ${
      errors[`attributes.${fieldKey}`]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-400 focus:ring-green-500"
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

  const fieldConfig = useMemo(() => {
    if (!categoryConfig) return [];
    const sub =
      categoryConfig.subcategories[
        formData.subcategory as keyof typeof categoryConfig.subcategories
      ];
    return sub?.fields || [];
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
    if (files && files.length > 0) {
      setImages((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const removeNewImage = (index: number) => {
    if (isSubmitting) return;
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (publicId: string) => {
    if (isSubmitting) return;
    setExistingImages((prev) =>
      prev.filter((img) => img.public_id !== publicId)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
                disabled={isSubmitting}
                className={getFieldClass("category")}
              >
                {Object.entries(CATEGORY_TREE).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xl text-gray-700 mb-2">Subcategory</label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                disabled={isSubmitting}
                className={getFieldClass("subcategory")}
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
              className="w-full bg-green-600 text-white text-lg py-3 rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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

            <div>
              <label className="block text-2xl text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                placeholder="Enter location"
                value={formData.location}
                onChange={handleChange}
                disabled={isSubmitting}
                className={getFieldClass("location")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-2xl text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={getFieldClass("city")}
                />
              </div>

              <div>
                <label className="block text-2xl text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={getFieldClass("state")}
                />
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
                onChange={handleImageChange}
                disabled={isSubmitting}
                className="w-full px-4 py-4 border border-gray-400 rounded-md text-xl bg-white focus:ring-2 focus:ring-green-500 focus:outline-none disabled:opacity-60"
              />

              {existingImages.length > 0 && (
                <div>
                  <p className="text-xl text-gray-700 mb-2">Existing Images</p>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((img, i) => (
                      <div key={img.public_id || i} className="relative group">
                        <img
                          src={img.url}
                          alt={`existing-${i}`}
                          className="w-full h-32 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(img.public_id)}
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
                        disabled={isSubmitting}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100 disabled:opacity-50"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
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
                className="px-6 py-3 bg-green-600 text-white text-lg rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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