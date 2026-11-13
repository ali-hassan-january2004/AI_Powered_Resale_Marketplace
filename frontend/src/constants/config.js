export const APP_NAME = "Resale";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const CURRENCY = import.meta.env.VITE_CURRENCY || "USD";
export const SHIPPING_FEE = Number(import.meta.env.VITE_SHIPPING_FEE || 0);
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

export const PAGE_SIZE = 20; // SRS BRW-06

// SRS LST-02: 1 to 8 images, up to 5 MB each
export const LISTING_LIMITS = { maxImages: 8, maxImageMB: 5 };

export const COLORS = [
  { name: "black", hex: "#111111" },
  { name: "white", hex: "#ffffff" },
  { name: "grey", hex: "#9ca3af" },
  { name: "beige", hex: "#d6c3a3" },
  { name: "brown", hex: "#7c4a2d" },
  { name: "red", hex: "#dc2626" },
  { name: "pink", hex: "#f9a8d4" },
  { name: "orange", hex: "#f97316" },
  { name: "yellow", hex: "#facc15" },
  { name: "green", hex: "#16a34a" },
  { name: "blue", hex: "#2563eb" },
  { name: "purple", hex: "#9333ea" },
];