import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { PATHS } from "../../app/routePaths";
import { formatPrice } from "../../utils/formatPrice";

// item: populated listing { _id, title, price, size, brand, status, images: [{url,isCover}] }
export default function CartItem({ item, onRemove, removing = false }) {
  const cover = item.images?.find((i) => i.isCover) || item.images?.[0];
  const unavailable = item.status && item.status !== "active";

  return (
    <li className={`flex gap-4 rounded-xl border border-stone-200 bg-white p-3 ${unavailable ? "opacity-70" : ""}`}>
      <Link to={PATHS.listing(item._id)} className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-stone-100">
        {cover && <img src={cover.url} alt={item.title} loading="lazy" className="h-full w-full object-cover" />}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <Link to={PATHS.listing(item._id)} className="line-clamp-2 font-medium hover:underline">
            {item.title}
          </Link>
          <p className="mt-0.5 text-sm text-stone-500">
            {[item.brand, item.size && `Size ${item.size}`].filter(Boolean).join(" · ")}
          </p>
          {unavailable && (
            <p className="mt-1 text-sm font-medium text-red-600">
              This item is no longer available. Remove it to continue.
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">{formatPrice(item.price)}</span>
          <button
            onClick={() => onRemove?.(item._id)}
            disabled={removing}
            aria-label={`Remove ${item.title} from cart`}
            className="flex items-center gap-1 text-sm text-stone-500 hover:text-red-600 disabled:opacity-50"
          >
            <Trash2 size={16} /> Remove
          </button>
        </div>
      </div>
    </li>
  );
}