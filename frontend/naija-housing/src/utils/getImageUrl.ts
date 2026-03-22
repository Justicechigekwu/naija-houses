
export function getImageUrl(path?: string) {
  if (!path) return "/placeholder.jpg";
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:5000";
  return `${apiBase}${path}`;
}
