const ensureListingReadyForPublish = (listing) => {
  const missing = [];

  if (!listing.title) missing.push("title");
  if (!listing.description) missing.push("description");
  if (!listing.price) missing.push("price");
  if (!listing.location) missing.push("location");
  if (!listing.state) missing.push("state");
  if (!listing.postedBy) missing.push("postedBy");
  if (!listing.listingType) missing.push("listingType");
  if (!listing.category) missing.push("category");
  if (!listing.subcategory) missing.push("subcategory");

  // add category-specific checks if you want later:
  // if (listing.category === "PROPERTY" && !listing.propertyType) missing.push("propertyType");

  if (missing.length) {
    const err = new Error(`Complete required fields: ${missing.join(", ")}`);
    err.statusCode = 400;
    err.missingFields = missing;
    throw err;
  } 
};