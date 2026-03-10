import CategoryPricing from "../models/categoryPricingModel.js";

export default async function getCategoryPricing(categoryKey, subcategoryKey = null) {
  const category = (categoryKey || "PROPERTY").toUpperCase();
  const subcategory = subcategoryKey ? subcategoryKey.toUpperCase() : null;

  if (subcategory) {
    const subcategoryPricing = await CategoryPricing.findOne({
      category,
      subcategory,
      isActive: true,
    });

    if (subcategoryPricing) return subcategoryPricing;
  }

  const categoryPricing = await CategoryPricing.findOne({
    category,
    subcategory: null,
    isActive: true,
  });

  if (categoryPricing) return categoryPricing;

  return await CategoryPricing.findOne({
    category: "PROPERTY",
    subcategory: null,
    isActive: true,
  });
}