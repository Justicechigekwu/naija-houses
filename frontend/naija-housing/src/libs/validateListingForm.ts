type FormDataShape = Record<string, any>;
type AttributesShape = Record<string, any>;

export function validateListingForm(
  formData: FormDataShape,
  attributes: AttributesShape
) {
  const nextErrors: Record<string, string> = {};

  const requiredBaseFields = [
    { key: "title", label: "Title" },
    { key: "listingType", label: "Listing Type" },
    { key: "price", label: "Price" },
    { key: "location", label: "Location" },
    { key: "state", label: "State" },
    { key: "description", label: "Description" },
    { key: "postedBy", label: "Posted By" },
    { key: "category", label: "Category" },
    { key: "subcategory", label: "Subcategory" },
  ];

  requiredBaseFields.forEach(({ key, label }) => {
    const value = formData[key];
    if (value == null || String(value).trim() === "") {
      nextErrors[key] = `${label} is required`;
    }
  });

  const requiredDynamicKeysBySubcategory: Record<string, string[]> = {
    HOUSES_APARTMENTS: ["propertyType", "bedrooms", "bathrooms", "toilets"],
    LANDS_PLOTS: ["landType", "landSize", "unit"],
    CARS_TRUCKS: ["make", "model", "year", "condition", "fuelType", "transmission"],
    MOTORCYCLES: ["make", "model", "year", "condition"],
    BICYCLES: ["brand", "bicycleType", "condition"],
    TRAILERS: ["trailerType", "condition"],
    CAR_PARTS_ACCESSORIES: ["partType", "condition"],
    PHONES_TABLETS: ["deviceType", "brand", "model", "condition"],
    MOBILE_ACCESSORIES: ["accessoryType", "brand", "condition"],
    LAPTOPS: ["brand", "model", "condition", "processor", "ram", "storage"],
    TELEVISIONS: ["brand", "model", "condition", "screenSize"],
    HEADPHONES: ["brand", "model", "condition", "type"],
    ELECTRONICS_OTHER: ["deviceType", "condition"],
    FURNITURE: ["furnitureType", "material", "condition"],
    HOME_APPLIANCES: ["applianceType", "brand", "condition"],
    WATCHES: ["brand", "condition", "displayType"],
  };

  const requiredDynamicKeys =
    requiredDynamicKeysBySubcategory[formData.subcategory] || [];

  requiredDynamicKeys.forEach((key) => {
    const value = attributes[key];
    if (value == null || String(value).trim() === "") {
      nextErrors[`attributes.${key}`] = `${key} is required`;
    }
  });

  return nextErrors;
}