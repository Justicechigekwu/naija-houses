export const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

export const buildListingSlugBase = ({
  title = "",
  city = "",
  state = "",
}) => {
  const joined = [title, city, state].filter(Boolean).join(" ");
  return slugify(joined) || "listing";
};

export const generateUniqueListingSlug = async (
  Listing,
  payload,
  excludeId = null
) => {
  const base = buildListingSlugBase(payload);
  let candidate = base;
  let count = 2;

  while (true) {
    const existing = await Listing.findOne({
      slug: candidate,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    }).select("_id");

    if (!existing) return candidate;

    candidate = `${base}-${count}`;
    count += 1;
  }
};