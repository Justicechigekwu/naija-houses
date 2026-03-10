// 6. Add frontend validation too

// Backend validation is the real protection.
// But frontend validation improves UX.

// Inside ListingForm, before submit:

// const validateRequiredFields = () => {
//   const missing: string[] = [];

//   if (!formData.title.trim()) missing.push("Title");
//   if (!formData.description.trim()) missing.push("Description");
//   if (!formData.price.trim()) missing.push("Price");
//   if (!formData.location.trim()) missing.push("Location");
//   if (!formData.state.trim()) missing.push("State");
//   if (!formData.postedBy.trim()) missing.push("Posted By");
//   if (!formData.listingType.trim()) missing.push("Listing Type");

//   return missing;
// };

// Then inside handleSubmit:

// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   const missing = validateRequiredFields();

//   if (missing.length) {
//     alert(`Please complete: ${missing.join(", ")}`);
//     return;
//   }

//   const data = new FormData();

//   Object.entries(formData).forEach(([key, val]) => {
//     data.append(key, val != null ? String(val) : "");
//   });

//   data.append("attributes", JSON.stringify(attributes));

//   existingImages.forEach((img) => {
//     data.append("keepImages", img);
//   });

//   images.forEach((image) => {
//     data.append("images", image);
//   });

//   await onSubmit(data);
// };