export const getVisitorId = () => {
  if (typeof window === "undefined") return "";

  let visitorId = localStorage.getItem("visitorId");

  if (!visitorId) {
    visitorId =
      crypto.randomUUID?.() ||
      `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem("visitorId", visitorId);
  }

  return visitorId;
};