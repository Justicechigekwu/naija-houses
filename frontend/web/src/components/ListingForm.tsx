"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { GripVertical, ImagePlus, Move, X } from "lucide-react";
import { CATEGORY_TREE } from "@/libs/listingFormConfig";
import { NIGERIA_STATES, getCitiesByState } from "@/libs/nigeriaLocations";
import { validateListingForm } from "@/libs/validateListingForm";
import { useUI } from "@/hooks/useUi";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SearchableSelect from "@/components/SearchableSelect";
import type {
  Listing,
  ListingImage,
  DynamicField,
  SubcategoryConfig,
  ListingFormShape,
} from "@/types/listing";
import {
  categoryUsesListingType,
  categoryUsesPostedBy,
  getListingTypeOptions,
} from "@/libs/listingFieldRules";
import {
  saveListingFormDraft,
  loadListingFormDraft,
  clearListingFormDraft,
} from "@/libs/listingFormDrafts";

interface ListingFormProps {
  initialData?: Listing | null;
  isEditMode?: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_TOTAL_IMAGES = 20;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const POSTED_BY_OPTIONS = ["Owner", "Agent", "Dealer", "Seller"] as const;

function getFirstSubcategory(category?: string) {
  const categoryNode =
    CATEGORY_TREE[String(category || "").toUpperCase() as keyof typeof CATEGORY_TREE];

  if (!categoryNode?.subcategories) return "";

  return Object.keys(categoryNode.subcategories)[0] || "";
}

function reorderArray<T>(items: T[], fromIndex: number, toIndex: number) {
  const updated = [...items];
  const [movedItem] = updated.splice(fromIndex, 1);

  if (movedItem === undefined) return items;

  updated.splice(toIndex, 0, movedItem);
  return updated;
}

function buildEmptyForm(category = "PROPERTY"): ListingFormShape {
  return {
    title: "",
    listingType: categoryUsesListingType(category)
      ? category === "LAND"
        ? "Sale"
        : ""
      : "",
    price: "",
    city: "",
    state: "",
    description: "",
    postedBy: "",
    category,
    subcategory: getFirstSubcategory(category),
  };
}

export default function ListingForm({
  initialData,
  isEditMode = false,
  onSubmit,
}: ListingFormProps) {
  const { showToast, showConfirm } = useUI();
  const { user } = useAuth();
  const draftUserId = user?.id || user?._id || null;

  const categoryOptions = useMemo(() => {
    return Object.entries(CATEGORY_TREE).map(([key, value]) => ({
      value: key,
      label: value.label,
    }));
  }, []);

  const initialCategory = initialData?.category || "PROPERTY";
  const initialSubcategory =
    initialData?.subcategory || getFirstSubcategory(initialCategory);

  const [step, setStep] = useState(1);
  const [existingImages, setExistingImages] = useState<ListingImage[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreedToListingPolicy, setAgreedToListingPolicy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [draggedExistingImageIndex, setDraggedExistingImageIndex] = useState<number | null>(null);
  const [draggedNewImageIndex, setDraggedNewImageIndex] = useState<number | null>(null);

  const [selectedExistingImageIndex, setSelectedExistingImageIndex] = useState<number | null>(null);
  const [selectedNewImageIndex, setSelectedNewImageIndex] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<ListingFormShape>(() => ({
    ...buildEmptyForm(initialCategory),
    category: initialCategory,
    subcategory: initialSubcategory,
  }));

  const [attributes, setAttributes] = useState<Record<string, string>>({});

  const initialCreateFormSnapshot = useMemo(
    () =>
      JSON.stringify({
        formData: {
          ...buildEmptyForm(initialCategory),
          category: initialCategory,
          subcategory: initialSubcategory,
        },
        attributes: {},
      }),
    [initialCategory, initialSubcategory]
  );
  
  const currentCreateFormSnapshot = useMemo(
    () =>
      JSON.stringify({
        formData,
        attributes,
      }),
    [formData, attributes]
  );
  
  const isCreateMode = !isEditMode;
  const isDirty = isCreateMode && currentCreateFormSnapshot !== initialCreateFormSnapshot;
  
  const persistLocalDraft = useCallback(() => {
    if (!isCreateMode) return;
    if (!isDirty) return;
  
    saveListingFormDraft(
      {
        formData,
        attributes,
        savedAt: new Date().toISOString(),
      },
      draftUserId
    );
  }, [isCreateMode, isDirty, formData, attributes, draftUserId]);
  
  const clearLocalDraft = useCallback(() => {
    clearListingFormDraft(draftUserId);
  }, [draftUserId]);

  useEffect(() => {
    if (!initialData) return;

    const nextCategory = initialData.category || "PROPERTY";
    const nextSubcategory =
      initialData.subcategory || getFirstSubcategory(nextCategory);

    setFormData({
      title: initialData.title || "",
      listingType: initialData.listingType || "",
      price: initialData.price != null ? String(initialData.price) : "",
      city: initialData.city || "",
      state: initialData.state || "",
      description: initialData.description || "",
      postedBy: initialData.postedBy || "",
      category: nextCategory,
      subcategory: nextSubcategory,
    });

    setAttributes(
      initialData.attributes
        ? Object.fromEntries(
            Object.entries(initialData.attributes).map(([key, value]) => [
              key,
              Array.isArray(value) ? value.join(", ") : String(value ?? ""),
            ])
          )
        : {}
    );

    setExistingImages(initialData.images || []);
  }, [initialData]);

  useEffect(() => {
    if (!isCreateMode) return;
  
    const savedDraft = loadListingFormDraft(draftUserId);
    if (!savedDraft?.formData) return;
  
    const hasMeaningfulData =
      Object.values(savedDraft.formData || {}).some(
        (value) => String(value || "").trim() !== ""
      ) || Object.keys(savedDraft.attributes || {}).length > 0;
  
    if (!hasMeaningfulData) {
      clearListingFormDraft(draftUserId);
      return;
    }
  
    showConfirm(
      {
        title: "Restore saved form draft?",
        message:
          "You have an unsaved listing form draft. Do you want to restore it?",
        confirmText: "Restore",
        cancelText: "Discard",
        confirmVariant: "primary",
      },
      () => {
        setFormData(savedDraft.formData);
        setAttributes(savedDraft.attributes || {});
        setStep(1);
  
        showToast(
          "Saved form draft restored. Please reselect any images before creating the listing.",
          "success"
        );
      },
      () => {
        clearListingFormDraft(draftUserId);
      }
    );
  }, [isCreateMode, draftUserId, showToast, showConfirm]);

  useEffect(() => {
    if (!isCreateMode) return;
  
    if (!isDirty) {
      clearListingFormDraft(draftUserId);
      return;
    }
  
    const timeout = window.setTimeout(() => {
      persistLocalDraft();
    }, 500);
  
    return () => window.clearTimeout(timeout);
  }, [
    isCreateMode,
    isDirty,
    formData,
    attributes,
    draftUserId,
    persistLocalDraft,
  ]);

  useEffect(() => {
    if (!isCreateMode || !isDirty) return;
  
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isCreateMode, isDirty]);

  const categoryConfig = useMemo(() => {
    return CATEGORY_TREE[formData.category as keyof typeof CATEGORY_TREE];
  }, [formData.category]);

  const subcategoryOptions = useMemo(() => {
    if (!categoryConfig?.subcategories) return [];

    return Object.entries(categoryConfig.subcategories).map(([key, value]) => ({
      key,
      label: value.label,
    }));
  }, [categoryConfig]);

  const fieldConfig = useMemo<DynamicField[]>(() => {
    if (!categoryConfig?.subcategories) return [];

    const sub = categoryConfig.subcategories[
      formData.subcategory as keyof typeof categoryConfig.subcategories
    ] as SubcategoryConfig | undefined;

    return sub?.fields ?? [];
  }, [categoryConfig, formData.subcategory]);

  const cityOptions = useMemo(() => {
    return getCitiesByState(formData.state);
  }, [formData.state]);

  const showListingType = useMemo(
    () => categoryUsesListingType(formData.category),
    [formData.category]
  );

  const showPostedBy = useMemo(
    () => categoryUsesPostedBy(formData.category),
    [formData.category]
  );

  const listingTypeOptions = useMemo(() => {
    return getListingTypeOptions(formData.category);
  }, [formData.category]);

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

  function formatPriceInput(value: string) {
    const match = value.match(/^([\d\s,\.]*)(.*)$/);
    if (!match) return value;

    const rawNum = match[1].replace(/[^\d]/g, "");
    const tail = match[2] ?? "";
    const formattedNum = rawNum ? Number(rawNum).toLocaleString() : "";
    const trimmedTail = tail.replace(/^\s+/, "");

    return trimmedTail ? `${formattedNum} ${trimmedTail}`.trim() : formattedNum;
  }

  const clearFieldError = (key: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const clearImageError = () => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next.images;
      return next;
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    clearFieldError(name);

    if (name === "price") {
      setFormData((prev) => ({ ...prev, price: formatPriceInput(value) }));
      return;
    }

    if (isEditMode && (name === "category" || name === "subcategory")) {
      return;
    }

    if (name === "category") {
      const nextCategory = value;
      const firstSubcategory = getFirstSubcategory(nextCategory);

      setFormData((prev) => ({
        ...prev,
        category: nextCategory,
        subcategory: firstSubcategory,
        listingType: categoryUsesListingType(nextCategory)
          ? nextCategory === "LAND"
            ? "Sale"
            : ""
          : "",
        postedBy: categoryUsesPostedBy(nextCategory) ? prev.postedBy : "",
      }));

      setAttributes({});
      return;
    }

    if (name === "subcategory") {
      setFormData((prev) => ({
        ...prev,
        subcategory: value,
        listingType: categoryUsesListingType(prev.category)
          ? prev.category === "LAND"
            ? "Sale"
            : prev.listingType
          : "",
      }));

      setAttributes({});
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

    clearFieldError(`attributes.${name}`);

    setAttributes((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearImageError();

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

    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);

      if (existingImages.length + next.length > 0) {
        clearImageError();
      }

      return next;
    });

    setSelectedNewImageIndex((prev) => {
      if (prev === null) return null;
      if (prev === index) return null;
      if (prev > index) return prev - 1;
      return prev;
    });
  };

  const removeExistingImage = (publicId?: string) => {
    if (isSubmitting || !publicId) return;

    const removedIndex = existingImages.findIndex((img) => img.public_id === publicId);

    setExistingImages((prev) => {
      const next = prev.filter((img) => img.public_id !== publicId);

      if (next.length + images.length > 0) {
        clearImageError();
      }

      return next;
    });

    setSelectedExistingImageIndex((prev) => {
      if (prev === null || removedIndex === -1) return prev;
      if (prev === removedIndex) return null;
      if (prev > removedIndex) return prev - 1;
      return prev;
    });
  };

  const handleExistingDragStart = (index: number) => {
    if (isSubmitting) return;
    setDraggedExistingImageIndex(index);
  };

  const handleExistingDrop = (index: number) => {
    if (isSubmitting) return;
    if (draggedExistingImageIndex === null || draggedExistingImageIndex === index) return;

    setExistingImages((prev) => reorderArray(prev, draggedExistingImageIndex, index));
    setDraggedExistingImageIndex(null);
  };

  const handleNewDragStart = (index: number) => {
    if (isSubmitting) return;
    setDraggedNewImageIndex(index);
  };

  const handleNewDrop = (index: number) => {
    if (isSubmitting) return;
    if (draggedNewImageIndex === null || draggedNewImageIndex === index) return;

    setImages((prev) => reorderArray(prev, draggedNewImageIndex, index));
    setDraggedNewImageIndex(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setDraggedExistingImageIndex(null);
    setDraggedNewImageIndex(null);
  };

  const handleExistingMobileReorder = (index: number) => {
    if (isSubmitting) return;

    if (selectedExistingImageIndex === null) {
      setSelectedExistingImageIndex(index);
      setSelectedNewImageIndex(null);
      showToast("Image selected. Tap another image to move it there.", "success");
      return;
    }

    if (selectedExistingImageIndex === index) {
      setSelectedExistingImageIndex(null);
      return;
    }

    setExistingImages((prev) => reorderArray(prev, selectedExistingImageIndex, index));
    setSelectedExistingImageIndex(null);
    showToast("Image order updated.", "success");
  };

  const handleNewMobileReorder = (index: number) => {
    if (isSubmitting) return;

    if (selectedNewImageIndex === null) {
      setSelectedNewImageIndex(index);
      setSelectedExistingImageIndex(null);
      showToast("Image selected. Tap another image to move it there.", "success");
      return;
    }

    if (selectedNewImageIndex === index) {
      setSelectedNewImageIndex(null);
      return;
    }

    setImages((prev) => reorderArray(prev, selectedNewImageIndex, index));
    setSelectedNewImageIndex(null);
    showToast("Image order updated.", "success");
  };

  const canGoNext =
    !!formData.category &&
    !!formData.subcategory &&
    (!showListingType || !!formData.listingType) &&
    (!showPostedBy || !!formData.postedBy);

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
      const focusName = firstErrorKey.replace("attributes.", "");
      const el = document.querySelector(`[name="${focusName}"]`);
      if (el instanceof HTMLElement) el.focus();
      return;
    }

    const totalImages = existingImages.length + images.length;

    if (totalImages === 0) {
      setErrors((prev) => ({
        ...prev,
        images: "At least one image is required",
      }));
      showToast("Please upload at least one image.", "error");
      return;
    }

    const data = new FormData();

    Object.entries(formData).forEach(([key, val]) => {
      if (key === "listingType" && !showListingType) return;
      if (key === "postedBy" && !showPostedBy) return;

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
    
      if (!isEditMode) {
        clearLocalDraft();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    if (isSubmitting) return;
  
    showConfirm(
      {
        title: "Clear form?",
        message:
          "Clear everything you have entered in this form? This will also remove the saved local draft.",
        confirmText: "Clear form",
        cancelText: "Cancel",
        confirmVariant: "danger",
      },
      () => {
        const resetCategory = "PROPERTY";
  
        setFormData(buildEmptyForm(resetCategory));
        setAttributes({});
        setImages([]);
        setErrors({});
        setStep(1);
        setAgreedToListingPolicy(false);
        clearLocalDraft();
  
        showToast("Form cleared", "success");
      }
    );
  };

  const renderDynamicField = (field: DynamicField) => {
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
      {!isEditMode && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleClearForm}
            disabled={isSubmitting}
            className="rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
          >
            Clear form
          </button>
        </div>
      )}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xl text-gray-700 mb-2">Category</label>
              <SearchableSelect
                value={formData.category}
                onChange={(value) => {
                  if (isEditMode) return;
              
                  clearFieldError("category");
              
                  const firstSubcategory = getFirstSubcategory(value);
              
                  setFormData((prev) => ({
                    ...prev,
                    category: value,
                    subcategory: firstSubcategory,
                    listingType: categoryUsesListingType(value)
                      ? value === "LAND"
                        ? "Sale"
                        : ""
                      : "",
                    postedBy: categoryUsesPostedBy(value) ? prev.postedBy : "",
                  }));
              
                  setAttributes({});
                }}
                options={categoryOptions}
                placeholder="Select category"
                error={!!errors.category}
                disabled={isSubmitting || isEditMode}
              />
            </div>

            {isEditMode && (
              <p className="text-sm text-gray-500 mt-1">
                You cannot edit category or subcategory after creating a listing.
              </p>
            )}

            <div>
              <label className="block text-xl text-gray-700 mb-2">Subcategory</label>
              <SearchableSelect
                value={formData.subcategory}
                onChange={(value) => {
                  if (isEditMode) return;
              
                  clearFieldError("subcategory");
              
                  setFormData((prev) => ({
                    ...prev,
                    subcategory: value,
                    listingType: categoryUsesListingType(prev.category)
                      ? prev.category === "LAND"
                        ? "Sale"
                        : prev.listingType
                      : "",
                  }));
              
                  setAttributes({});
                }}
                options={subcategoryOptions.map((sub) => ({
                  value: sub.key,
                  label: sub.label,
                }))}
                placeholder="Select subcategory"
                error={!!errors.subcategory}
                disabled={isSubmitting || isEditMode}
              />
            </div>

            {showListingType && (
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
            )}

            {showPostedBy && (
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
                  {POSTED_BY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={isSubmitting || !canGoNext}
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
                <SearchableSelect
                  value={formData.state}
                  onChange={(value) => {
                    clearFieldError("state");
                
                    setFormData((prev) => ({
                      ...prev,
                      state: value,
                      city: "",
                    }));
                  }}
                  options={NIGERIA_STATES.map((state) => ({
                    value: state,
                    label: state,
                  }))}
                  placeholder="Select state"
                  error={!!errors.state}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-2xl text-gray-700 mb-2">LGA</label>
                <SearchableSelect
                  value={formData.city}
                  onChange={(value) => {
                    clearFieldError("city");
                
                    setFormData((prev) => ({
                      ...prev,
                      city: value,
                    }));
                  }}
                  options={cityOptions.map((city) => ({
                    value: city,
                    label: city,
                  }))}
                  placeholder="Select city"
                  error={!!errors.city}
                  disabled={isSubmitting || !formData.state}
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

            {fieldConfig.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Additional Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fieldConfig.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <label className="block text-lg text-gray-700">
                        {field.label}
                      </label>
                      {renderDynamicField(field)}
                      {errors[`attributes.${field.key}`] && (
                        <p className="text-sm text-red-500">
                          {errors[`attributes.${field.key}`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ImagePlus className="h-5 w-5 text-gray-700" />
                <h2 className="text-2xl font-semibold text-gray-800">Images</h2>
              </div>

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleImageChange}
                disabled={isSubmitting}
                className="block w-full text-sm text-gray-700"
              />

              <p className="text-sm text-gray-500">
                Upload at least 1 image and up to {MAX_TOTAL_IMAGES} images. JPG, JPEG,
                PNG, WEBP only.
              </p>

              {errors.images && (
                <p className="text-sm text-red-500">{errors.images}</p>
              )}

              {existingImages.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">
                    Existing Images
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((img, index) => (
                      <div
                        key={img.public_id || img.url}
                        draggable={!isSubmitting}
                        onDragStart={() => handleExistingDragStart(index)}
                        onDrop={() => handleExistingDrop(index)}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                        onClick={() => handleExistingMobileReorder(index)}
                        className={`relative rounded-lg overflow-hidden border bg-white cursor-pointer select-none ${
                          selectedExistingImageIndex === index
                            ? "ring-2 ring-[#8A715D] border-[#8A715D]"
                            : "border-gray-200"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />

                        <div className="absolute left-2 top-2 rounded-full bg-white/90 p-1 shadow">
                          <GripVertical className="h-4 w-4 text-gray-700" />
                        </div>

                        {selectedExistingImageIndex === index && (
                          <div className="absolute inset-x-0 bottom-0 bg-[#8A715D] px-2 py-1 text-center text-xs font-medium text-white">
                            Selected
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeExistingImage(img.public_id);
                          }}
                          disabled={isSubmitting}
                          className="absolute top-2 right-2 rounded-full bg-white/90 p-1 shadow"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {images.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">
                    New Images
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                      <div
                        key={`${img.name}-${index}`}
                        draggable={!isSubmitting}
                        onDragStart={() => handleNewDragStart(index)}
                        onDrop={() => handleNewDrop(index)}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                        onClick={() => handleNewMobileReorder(index)}
                        className={`relative rounded-lg overflow-hidden border bg-white cursor-pointer select-none ${
                          selectedNewImageIndex === index
                            ? "ring-2 ring-[#8A715D] border-[#8A715D]"
                            : "border-gray-200"
                        }`}
                      >
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`New ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />

                        <div className="absolute left-2 top-2 rounded-full bg-white/90 p-1 shadow">
                          <GripVertical className="h-4 w-4 text-gray-700" />
                        </div>

                        {selectedNewImageIndex === index && (
                          <div className="absolute inset-x-0 bottom-0 bg-[#8A715D] px-2 py-1 text-center text-xs font-medium text-white">
                            Selected
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNewImage(index);
                          }}
                          disabled={isSubmitting}
                          className="absolute top-2 right-2 rounded-full bg-white/90 p-1 shadow"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-gray-300 bg-white p-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreedToListingPolicy}
                  onChange={(e) => setAgreedToListingPolicy(e.target.checked)}
                  disabled={isSubmitting}
                  className="mt-1"
                />
                <span className="text-sm text-gray-700">
                  I agree that this listing follows Velora marketplace rules and does
                  not contain prohibited, misleading, or fraudulent content.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#8A715D] text-white text-lg py-3 rounded-md hover:bg-[#7A6352] transition disabled:opacity-50 disabled:cursor-not-allowed"
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
        )}
      </form>
    </div>
  );
}