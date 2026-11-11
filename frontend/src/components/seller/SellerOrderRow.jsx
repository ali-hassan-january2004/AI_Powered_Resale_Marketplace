import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatPrice } from "../../utils/formatPrice";
import StatusBadge from "../commerce/StatusBadge";
import OrderStatusUpdater from "./OrderStatusUpdater";

// onUpdateStatus(orderId, status, note) must return a promise
export default function SellerOrderRow({ order, onUpdateStatus }) {
  const [open, setOpen] = useState(false);
  const addr = order.shippingAddress;

  return (
    <article className="rounded-xl border border-stone-200 bg-white">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full flex-wrap items-center gap-3 p-4 text-left">
        <div className="min-w-0 flex-1 basis-40">
          <p className="text-sm font-medium">Order #{String(order._id).slice(-6).toUpperCase()}</p>
          <p className="text-xs text-stone-500">
            {order.buyer?.name || "Buyer"} · {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className="text-sm font-semibold">{formatPrice(order.totals?.total)}</span>
        <StatusBadge status={order.status} />
        <ChevronDown size={18} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="grid gap-4 border-t border-stone-100 p-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold">Items</p>
            <ul className="space-y-2">
              {order.items?.map((it) => (
                <li key={it.listing} className="flex items-center gap-3 text-sm">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-stone-100">
                    {it.image && <img src={it.image} alt="" loading="lazy" className="h-full w-full object-cover" />}
                  </div>
                  <span className="line-clamp-1 flex-1">{it.title}</span>
                  <span>{formatPrice(it.priceAtPurchase)}</span>
                </li>
              ))}
            </ul>
            {addr && (
              <div className="mt-4 text-sm">
                <p className="mb-1 font-semibold">Ship to</p>
                <p className="text-stone-600">{addr.line1}, {addr.city}, {addr.region} {addr.postalCode}, {addr.country}</p>
              </div>
            )}
            <p className="mt-3 text-xs text-stone-500">
              Payment: {order.paymentMethod === "cod" ? "Cash on delivery" : "Test card"} ({order.paymentStatus})
            </p>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Update status</p>
            <OrderStatusUpdater order={order} onUpdate={(status, note) => onUpdateStatus(order._id, status, note)} />
          </div>
        </div>
      )}
    </article>
  );
}