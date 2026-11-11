export const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One size"];

export const CONDITIONS = [
  { value: "new_with_tags", label: "New with tags", hint: "Unworn, tags still attached" },
  { value: "like_new", label: "Like new", hint: "Worn once or twice, no flaws" },
  { value: "good", label: "Good", hint: "Gently used, minor signs of wear" },
  { value: "fair", label: "Fair", hint: "Visible wear or small flaws" },
];

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

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "popular", label: "Most popular" },
];

export const LISTING_LIMITS = { maxImages: 8, maxImageMB: 5 };