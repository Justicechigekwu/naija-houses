export const slugifyUser = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

export const buildUserSlugBase = ({
  firstName = "",
  lastName = "",
}) => {
  return slugifyUser([firstName, lastName].filter(Boolean).join(" ")) || "user";
};

export const generateUniqueUserSlug = async (
  userModel,
  payload,
  excludeId = null
) => {
  const base = buildUserSlugBase(payload);
  let candidate = base;
  let count = 2;

  while (true) {
    const existing = await userModel.findOne({
      slug: candidate,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    }).select("_id");

    if (!existing) return candidate;

    candidate = `${base}-${count}`;
    count += 1;
  }
};