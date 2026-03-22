export const normalizeLocationText = (value = "") =>
  String(value).trim().toLowerCase();

export const sameText = (a = "", b = "") =>
  normalizeLocationText(a) === normalizeLocationText(b);