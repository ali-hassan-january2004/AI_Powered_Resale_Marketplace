const CURRENCY = import.meta.env.VITE_CURRENCY || "USD";

export const formatPrice = (value = 0) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(value);