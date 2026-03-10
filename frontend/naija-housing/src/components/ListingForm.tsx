// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { X } from "lucide-react";
// import { useParams } from "next/navigation";
// import api from "@/libs/api";
// import { CATEGORY_TREE } from "@/libs/listingFormConfig";
// import { validateListingForm } from "@/libs/validateListingForm";

// interface ListingFormProps {
//   initialData?: Partial<{
//     title: string;
//     listingType: string;
//     price: string;
//     location: string;
//     city: string;
//     state: string;
//     description: string;
//     postedBy: string;
//     category: string;
//     subcategory: string;
//     attributes: Record<string, any>;
//     images: string[];
//   }>;
//   isEditMode?: boolean;
//   onSubmit: (formData: FormData) => Promise<void>;
// } 

// type FormShape = {
//   title: string;
//   listingType: string;
//   price: string;
//   location: string;
//   city: string;
//   state: string;
//   description: string;
//   postedBy: string;
//   category: string;
//   subcategory: string;
// };

// export default function ListingForm({ initialData, isEditMode = false, onSubmit,  }: ListingFormProps) {
//   const [step, setStep] = useState(1);
//   const { id } = useParams();

//   const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
//   const [images, setImages] = useState<File[]>([]);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const [formData, setFormData] = useState<FormShape>({
//     title: initialData?.title || "",
//     listingType: initialData?.listingType || "",
//     price: initialData?.price || "",
//     location: initialData?.location || "",
//     city: initialData?.city || "",
//     state: initialData?.state || "",
//     description: initialData?.description || "",
//     postedBy: initialData?.postedBy || "",
//     category: initialData?.category || "PROPERTY",
//     subcategory: initialData?.subcategory || "HOUSES_APARTMENTS",
//   });

//   const [attributes, setAttributes] = useState<Record<string, any>>(initialData?.attributes || {});

//   const getFieldClass = (fieldName: string) =>
//     `w-full px-4 py-4 border rounded-md text-xl focus:ring-2 focus:outline-none ${
//       errors[fieldName]
//         ? "border-red-500 focus:ring-red-500"
//         : "border-gray-400 focus:ring-green-500"
//     }`;

//   const dynamicFieldClass = (fieldKey: string) =>
//     `w-full px-4 py-4 border rounded-md text-lg focus:ring-2 focus:outline-none ${
//       errors[`attributes.${fieldKey}`]
//         ? "border-red-500 focus:ring-red-500"
//         : "border-gray-400 focus:ring-green-500"
//     }`;

//   const toAbs = (img: string) => {
//     if (!img) return "";
//     if (/^https?:\/\//i.test(img)) return img;
//     const base =
//       process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:5000";
//     const normalized = img.startsWith("/") ? img : `/${img}`;
//     return `${base}${normalized}`;
//   };

//   useEffect(() => {
//     const fetchListing = async () => {
//       if (!id) return;
//       try {
//         const res = await api.get(`/listings/${id}`);
//         setExistingImages(res.data.images || []);
//       } catch (error) {
//         console.error("Failed to fetch listing images:", error);
//       }
//     };

//     fetchListing();
//   }, [id]);

//   const categoryConfig = useMemo(() => {
//     return CATEGORY_TREE[formData.category as keyof typeof CATEGORY_TREE];
//   }, [formData.category]);

//   const subcategoryOptions = useMemo(() => {
//     if (!categoryConfig) return [];
//     return Object.entries(categoryConfig.subcategories).map(([key, value]) => ({
//       key,
//       label: value.label,
//     }));
//   }, [categoryConfig]);

//   const fieldConfig = useMemo(() => {
//     if (!categoryConfig) return [];
//     const sub = categoryConfig.subcategories[
//       formData.subcategory as keyof typeof categoryConfig.subcategories
//     ];
//     return sub?.fields || [];
//   }, [categoryConfig, formData.subcategory]);

//   const listingTypeOptions = useMemo(() => {
//     if (formData.subcategory === "HOUSES_APARTMENTS") {
//       return ["Sale", "Rent", "Shortlet"];
//     }
//     return ["Sale"];
//   }, [formData.subcategory]);

//   function formatPriceInput(value: string) {
//     const match = value.match(/^([\d\s,\.]*)(.*)$/);
//     if (!match) return value;
//     const rawNum = match[1].replace(/[^\d]/g, "");
//     const tail = match[2] ?? "";
//     const formattedNum = rawNum ? Number(rawNum).toLocaleString() : "";
//     const trimmedTail = tail.replace(/^\s+/, "");
//     return trimmedTail ? `${formattedNum} ${trimmedTail}`.trim() : formattedNum;
//   }

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;

//     setErrors((prev) => {
//       const next = { ...prev };
//       delete next[name];
//       return next;
//     })

//     if (name === "price") {
//       setFormData((prev) => ({ ...prev, price: formatPriceInput(value) }));
//       return;
//     }

//     if (name === "category") {
//       const nextCategory = value;
//       const nextCategoryConfig = CATEGORY_TREE[nextCategory as keyof typeof CATEGORY_TREE];
//       const firstSubcategory = Object.keys(nextCategoryConfig.subcategories)[0] || "";

//       setFormData((prev) => ({
//         ...prev,
//         category: nextCategory,
//         subcategory: firstSubcategory,
//         listingType: firstSubcategory === "HOUSES_APARTMENTS" ? prev.listingType : "Sale",
//       }));
//       setAttributes({});
//       return;
//     }

//     if (name === "subcategory") {
//       setFormData((prev) => ({
//         ...prev,
//         subcategory: value,
//         listingType: value === "HOUSES_APARTMENTS" ? prev.listingType : "Sale",
//       }));
//       setAttributes({});
//       return;
//     }

//     if (name === "listingType") {
//       setFormData((prev) => ({ ...prev, listingType: value }));
//       return;
//     }

//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAttributeChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;

//     setErrors((prev) => {
//       const next = { ...prev };
//       delete next[`attributes.${name}`];
//       return next;
//     });

//     setAttributes((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { files } = e.target;
//     if (files && files.length > 0) {
//       setImages((prev) => [...prev, ...Array.from(files)]);
//     }
//   };

//   const removeNewImage = (index: number) => {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   const removeExistingImage = (img: string) => {
//     setExistingImages((prev) => prev.filter((i) => i !== img));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const nextErrors = validateListingForm(formData, attributes);
//     setErrors(nextErrors);
      
//     if (Object.keys(nextErrors).length > 0) {
//       const firstErrorKey = Object.keys(nextErrors)[0];
//       const el = document.querySelector(
//         `[name="${firstErrorKey.replace("attributes.", "")}"]`
//       );
//       if (el instanceof HTMLElement) el.focus();
//       return;
//     }

//     console.log("FORM DATA BEFORE SUBMIT", formData);
//     console.log("ATTRIBUTES BEFORE SUBMIT", attributes);

//     const data = new FormData();

//     Object.entries(formData).forEach(([key, val]) => {
//       data.append(key, val != null ? String(val) : "");
//     });

//     data.append("attributes", JSON.stringify(attributes));

//     existingImages.forEach((img) => {
//       data.append("keepImages", img);
//     });

//     images.forEach((image) => {
//       data.append("images", image);
//     });

//     await onSubmit(data);
//   };

//   const renderDynamicField = (field: {
//     key: string;
//     label: string;
//     type: string;
//     options?: string[];
//   }) => {
//     if (field.type === "select") {
//       return (
//         <select
//           name={field.key}
//           value={attributes[field.key] || ""}
//           onChange={handleAttributeChange}
//           className="w-full px-4 py-4 border border-gray-400 rounded-md text-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
//         >
//           <option value="">Select {field.label}</option>
//           {field.options?.map((option) => (
//             <option key={option} value={option}>
//               {option}
//             </option>
//           ))}
//         </select>
//       );
//     }

//     if (field.type === "textarea") {
//       return (
//         <textarea
//           name={field.key}
//           value={attributes[field.key] || ""}
//           onChange={handleAttributeChange}
//           placeholder={`Enter ${field.label}`}
//           rows={4}
//           className="w-full px-4 py-4 border border-gray-400 rounded-md text-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
//         />
//       );
//     }

//     return (
//       <input
//         type={field.type}
//         name={field.key}
//         value={attributes[field.key] || ""}
//         onChange={handleAttributeChange}
//         placeholder={`Enter ${field.label}`}
//         className="w-full px-4 py-4 border border-gray-400 rounded-md text-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
//       />
//     );
//   };

//   return (
//     <div className="max-w-4xl border bg-[#F5F5F5] rounded shadow mx-auto p-6">
//       <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
//         {step === 1 && (
//           <div className="space-y-6">
//             <div>
//               <label className="block text-xl text-gray-700 mb-2">Category</label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
//               >
//                 {Object.entries(CATEGORY_TREE).map(([key, value]) => (
//                   <option key={key} value={key}>
//                     {value.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-xl text-gray-700 mb-2">Subcategory</label>
//               <select
//                 name="subcategory"
//                 value={formData.subcategory}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
//               >
//                 {subcategoryOptions.map((sub) => (
//                   <option key={sub.key} value={sub.key}>
//                     {sub.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-xl text-gray-700 mb-2">Listing Type</label>
//               <select
//                 name="listingType"
//                 value={formData.listingType}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
//               >
//                 <option value="">Select Listing Type</option>
//                 {listingTypeOptions.map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-xl text-gray-700 mb-2">Posted By</label>
//               <select
//                 name="postedBy"
//                 value={formData.postedBy}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
//               >
//                 <option value="">Select</option>
//                 <option value="Owner">Owner</option>
//                 <option value="Agent">Agent</option>
//                 <option value="Dealer">Dealer</option>
//                 <option value="Seller">Seller</option>
//               </select>
//             </div>

//             <button
//               type="button"
//               onClick={() => setStep(2)}
//               disabled={!formData.listingType || !formData.postedBy || !formData.category || !formData.subcategory}
//               className="w-full bg-green-600 text-white text-lg py-3 rounded-md hover:bg-green-700 transition disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         )}

//         {step === 2 && (
//           <div className="space-y-6">

//             <button
//               type="button"
//               onClick={() => setStep(1)}
//               className="px-6 py-3 bg-gray-300 text-lg rounded-md hover:bg-gray-400 transition"
//             >
//               Back
//             </button>

//             <div>
//               <label className="block text-2xl text-gray-700 mb-2">Title</label>
//               <input
//                 type="text"
//                 name="title"
//                 placeholder="Enter listing title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 className="w-full px-4 py-4 border border-gray-400 rounded-md text-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
//               />
//             </div>

//             <div>
//               <label className="block text-2xl text-gray-700 mb-2">Price</label>
//               <input
//                 type="text"
//                 name="price"
//                 placeholder="Enter price"
//                 value={formData.price}
//                 onChange={handleChange}
//                 className="w-full px-4 py-4 border border-gray-400 rounded-md text-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
//               />
//             </div>

//             <div>
//               <label className="block text-2xl text-gray-700 mb-2">Location</label>
//               <input
//                 type="text"
//                 name="location"
//                 placeholder="Enter location"
//                 value={formData.location}
//                 onChange={handleChange}
//                 className="w-full px-4 py-4 border border-gray-400 rounded-md text-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-2xl text-gray-700 mb-2">City</label>
//                 <input
//                   type="text"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   className="w-full px-4 py-4 border border-gray-400 rounded-md text-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-2xl text-gray-700 mb-2">State</label>
//                 <input
//                   type="text"
//                   name="state"
//                   value={formData.state}
//                   onChange={handleChange}
//                   className="w-full px-4 py-4 border border-gray-400 rounded-md text-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-2xl text-gray-700 mb-2">Description</label>
//               <textarea
//                 name="description"
//                 placeholder="Describe your listing"
//                 value={formData.description}
//                 onChange={handleChange}
//                 rows={5}
//                 className="w-full px-4 py-4 border border-gray-400 rounded-md text-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
//               />
//             </div>

//             <div className="space-y-6">
//               <h2 className="text-2xl font-semibold text-gray-800">
//                 {subcategoryOptions.find((s) => s.key === formData.subcategory)?.label} Details
//               </h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {fieldConfig.map((field) => (
//                   <div key={field.key}>
//                     <label className="block text-lg text-gray-700 mb-2">{field.label}</label>
//                     {renderDynamicField(field)}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label className="block text-2xl text-gray-700 mb-2">Upload Images</label>
//               <input
//                 type="file"
//                 name="images"
//                 multiple
//                 onChange={handleImageChange}
//                 className="w-full px-4 py-4 border border-gray-400 rounded-md text-xl bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
//               />

//               {existingImages.length > 0 && (
//                 <div>
//                   <p className="text-xl text-gray-700 mb-2">Existing Images</p>
//                   <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
//                     {existingImages.map((img, i) => (
//                       <div key={i} className="relative group">
//                         <img
//                           src={toAbs(img)}
//                           alt={`existing-${i}`}
//                           className="w-full h-32 object-cover rounded-md border"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeExistingImage(img)}
//                           className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100"
//                         >
//                           <X size={16} />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {images.length > 0 && (
//                 <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
//                   {images.map((img, index) => (
//                     <div key={index} className="relative group">
//                       <img
//                         src={URL.createObjectURL(img)}
//                         alt={`preview-${index}`}
//                         className="w-full h-32 object-cover rounded-md border"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeNewImage(index)}
//                         className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100"
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//               {Object.keys(errors).length > 0 && (
//                 <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
//                   <p className="font-semibold mb-2">Please fix the erros</p>
//                   <ul className="list-disc pl-5 space-y-1 text-sm">
//                     {Object.entries(errors).map(([key, value]) => (
//                       <li key={key}>{value}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//             <div className="flex justify-between">
//               <button
//                 type="button"
//                 onClick={() => setStep(1)}
//                 className="px-6 py-3 bg-gray-300 text-lg rounded-md hover:bg-gray-400 transition"
//               >
//                 Back
//               </button>

//               <button
//                 type="submit"
//                 className="px-6 py-3 bg-green-600 text-white text-lg rounded-md hover:bg-green-700 transition"
//               >
//                 {/* {initialData ? "Update Listing" : "Create Listing"} */}
//                 {isEditMode ? "Update Listing" : "Create Listing"}
//               </button>
//             </div>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// }



"use client";

import { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { useParams } from "next/navigation";
import api from "@/libs/api";
import { CATEGORY_TREE } from "@/libs/listingFormConfig";
import { validateListingForm } from "@/libs/validateListingForm";

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
    images: string[];
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
  const { id } = useParams();

  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormShape>({
    title: initialData?.title || "",
    listingType: initialData?.listingType || "",
    price: initialData?.price || "",
    location: initialData?.location || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    description: initialData?.description || "",
    postedBy: initialData?.postedBy || "",
    category: initialData?.category || "PROPERTY",
    subcategory: initialData?.subcategory || "HOUSES_APARTMENTS",
  });

  const [attributes, setAttributes] = useState<Record<string, any>>(initialData?.attributes || {});

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

  const toAbs = (img: string) => {
    if (!img) return "";
    if (/^https?:\/\//i.test(img)) return img;
    const base =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:5000";
    const normalized = img.startsWith("/") ? img : `/${img}`;
    return `${base}${normalized}`;
  };

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        const res = await api.get(`/listings/${id}`);
        setExistingImages(res.data.images || []);
      } catch (error) {
        console.error("Failed to fetch listing images:", error);
      }
    };

    fetchListing();
  }, [id]);

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
    const sub = categoryConfig.subcategories[
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
      const nextCategoryConfig = CATEGORY_TREE[nextCategory as keyof typeof CATEGORY_TREE];
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
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (img: string) => {
    setExistingImages((prev) => prev.filter((i) => i !== img));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      data.append(key, val != null ? String(val) : "");
    });

    data.append("attributes", JSON.stringify(attributes));

    existingImages.forEach((img) => {
      data.append("keepImages", img);
    });

    images.forEach((image) => {
      data.append("images", image);
    });

    await onSubmit(data);
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
              disabled={!formData.listingType || !formData.postedBy || !formData.category || !formData.subcategory}
              className="w-full bg-green-600 text-white text-lg py-3 rounded-md hover:bg-green-700 transition disabled:opacity-50"
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
              className="px-6 py-3 bg-gray-300 text-lg rounded-md hover:bg-gray-400 transition"
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
                className="w-full px-4 py-4 border border-gray-400 rounded-md text-xl bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              />

              {existingImages.length > 0 && (
                <div>
                  <p className="text-xl text-gray-700 mb-2">Existing Images</p>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
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
                className="px-6 py-3 bg-gray-300 text-lg rounded-md hover:bg-gray-400 transition"
              >
                Back
              </button>

              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white text-lg rounded-md hover:bg-green-700 transition"
              >
                {isEditMode ? "Update Listing" : "Create Listing"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}