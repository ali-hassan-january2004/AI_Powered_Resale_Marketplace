import { Link } from "react-router-dom";
import { PATHS } from "../../app/routePaths";
import { formatPrice } from "../../utils/formatPrice";
import StatusBadge from "./StatusBadge";

export default function OrderCard({ order }) {
  const date = new Date(order.createdAt).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });

  return (
    <article className="rounded-xl border border-stone-200 bg-white p-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm text-stone-500">Order #{String(order._id).slice(-6).toUpperCase()} · {date}</p>
        </div>
        <StatusBadge status={order.status} />
      </header>

      <ul className="mt-3 space-y-2">
        {order.items?.map((it) => (
          <li key={it.listing} className="flex items-center gap-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-stone-100">
              {it.image && <img src={it.image} alt="" loading="lazy" className="h-full w-full object-cover" />}
            </div>
            <p className="line-clamp-1 flex-1 text-sm">{it.title}</p>
            <p className="text-sm font-medium">{formatPrice(it.priceAtPurchase)}</p>
          </li>
        ))}
      </ul>

      <footer className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
        <p className="text-sm">
          Total <span className="font-semibold">{formatPrice(order.totals?.total)}</span>
        </p>
        <Link to={PATHS.order(order._id)} className="text-sm font-medium text-emerald-700 hover:underline">
          View details
        </Link>
      </footer>
    </article>
  );
}