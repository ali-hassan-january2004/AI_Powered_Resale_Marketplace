import { Link } from "react-router-dom";
import { Eye, Heart } from "lucide-react";
import { PATHS } from "../../app/routePaths";
import { formatPrice } from "../../utils/formatPrice";
import ListingStatusBadge from "../selling/ListingStatusBadge";
import Button from "../ui/Button";

export default function SellerListingRow({ listing, onMarkSold, onDelete }) {
  const cover = listing.images?.find((i) => i.isCover) || listing.images?.[0];
  const editable = ["draft", "active"].includes(listing.status);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-stone-200 bg-white p-3">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-100">
        {cover && <img src={cover.url} alt="" loading="lazy" className="h-full w-full object-cover" />}
      </div>
      <div className="min-w-0 flex-1 basis-48">
        <Link to={PATHS.listing(listing._id)} className="line-clamp-1 font-medium hover:underline">{listing.title}</Link>
        <p className="text-sm font-semibold">{formatPrice(listing.price)}</p>
        <div className="mt-0.5 flex items-center gap-3 text-xs text-stone-500">
          <span className="flex items-center gap-1"><Eye size={13} /> {listing.views ?? 0}</span>
          <span className="flex items-center gap-1"><Heart size={13} /> {listing.favoritesCount ?? 0}</span>
        </div>
      </div>
      <ListingStatusBadge status={listing.status} />
      <div className="flex gap-2">
        {editable && (
          <Link to={PATHS.sellEdit(listing._id)} className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-50">Edit</Link>
        )}
        {listing.status === "active" && (
          <Button size="sm" variant="secondary" onClick={() => onMarkSold?.(listing)}>Mark sold</Button>
        )}
        {listing.status !== "removed" && listing.status !== "sold" && (
          <Button size="sm" variant="ghost" onClick={() => onDelete?.(listing)}>Delete</Button>
        )}
      </div>
    </div>
  );
}