import { Link } from "react-router-dom";
import { PATHS } from "../../app/routePaths";
import { formatPrice } from "../../utils/formatPrice";
import WishlistButton from "./WishlistButton";

export default function ListingCard({ listing }) {
  const cover = listing.images?.find((i) => i.isCover) || listing.images?.[0];
  const unavailable = listing.status === "sold" || listing.status === "reserved";

  return (
    <article className="relative">
      <Link to={PATHS.listing(listing._id)} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-stone-100">
          {cover && (
            <img
              src={cover.url}
              alt={listing.title}
              loading="lazy"
              className={`h-full w-full object-cover transition hover:scale-105 ${unavailable ? "opacity-60" : ""}`}
            />
          )}
          {unavailable && (
            <span className="absolute left-2 top-2 rounded-full bg-stone-900 px-2.5 py-0.5 text-xs font-medium capitalize text-white">
              {listing.status}
            </span>
          )}
        </div>
        <div className="mt-2">
          <p className="line-clamp-1 text-sm font-medium">{listing.title}</p>
          <p className="line-clamp-1 text-xs text-stone-500">
            {[listing.brand, listing.size && `Size ${listing.size}`].filter(Boolean).join(" · ")}
          </p>
          <p className="mt-0.5 text-sm font-semibold">{formatPrice(listing.price)}</p>
        </div>
      </Link>
      <WishlistButton
        listingId={listing._id}
        initialActive={!!listing.isFavorite}
        className="absolute right-2 top-2"
      />
    </article>
  );
}