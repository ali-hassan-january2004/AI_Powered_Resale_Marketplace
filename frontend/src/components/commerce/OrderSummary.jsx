import { formatPrice } from "../../utils/formatPrice";

// totals: { subtotal, shipping, platformFee?, total }
export default function OrderSummary({ totals = {}, itemCount, children }) {
  const { subtotal = 0, shipping = 0, total = subtotal + shipping } = totals;

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <h2 className="text-lg font-semibold">Order summary</h2>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-stone-600">Items{itemCount != null ? ` (${itemCount})` : ""}</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-stone-600">Shipping</dt>
          <dd>{shipping ? formatPrice(shipping) : "Free"}</dd>
        </div>
        <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}