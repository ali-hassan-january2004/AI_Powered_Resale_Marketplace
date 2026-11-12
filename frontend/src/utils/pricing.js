export const SHIPPING_FEE = Number(import.meta.env.VITE_SHIPPING_FEE || 0);

// Client-side estimate for display. The backend computes the real totals at checkout.
export function calcTotals(items = []) {
  const subtotal = items.reduce((sum, i) => sum + (i.price || 0), 0);
  const shipping = items.length ? SHIPPING_FEE : 0;
  return { subtotal, shipping, total: subtotal + shipping };
}