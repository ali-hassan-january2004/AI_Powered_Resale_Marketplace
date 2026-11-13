import { Link } from "react-router-dom";
import { PATHS } from "../../app/routePaths";
import { formatPrice } from "../../utils/formatPrice";
import WishlistButton from "./WishlistButton";

const CONDITION_LABELS = {
  new_with_tags: "New with tags",
  like_new: "Like new",
  good: "Good",
  fair: "Fair",
};

export default function ListingCard({ listing }) {
  const cover = listing.images?.find((i) => i.isCover) || listing.images?.[0];
  const unavailable = listing.status === "sold" || listing.status === "reserved";
  const image = cover?.url || "/placeholder-listing.webp";

  return (
    <article className="group relative h-full rounded-2xl border border-stone-200/80 bg-white p-2 transition duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-xl">
      <Link to={PATHS.listing(listing._id)} className="block">
        <div className="relative aspect-[4/4.5] overflow-hidden rounded-xl bg-stone-100">
          <img
            src={image}
            alt={listing.title}
            loading="lazy"
            decoding="async"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "/placeholder-listing.webp";
            }}
            className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${unavailable ? "opacity-60" : ""}`}
          />
          {unavailable && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-stone-900/90 px-3 py-1 text-[11px] font-semibold capitalize text-white backdrop-blur">
              {listing.status}
            </span>
          )}
          {!unavailable && CONDITION_LABELS[listing.condition] && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-stone-800 shadow-sm backdrop-blur">
              {CONDITION_LABELS[listing.condition]}
            </span>
          )}
        </div>
        <div className="px-1 pb-1 pt-3">
          <p className="line-clamp-1 text-sm font-semibold text-stone-900">{listing.title}</p>
          <p className="mt-1 line-clamp-1 text-xs text-stone-500">
            {[listing.brand, listing.size && `Size ${listing.size}`].filter(Boolean).join(" · ")}
          </p>
          <p className="mt-2 text-base font-semibold tracking-tight text-stone-900">{formatPrice(listing.price)}</p>
        </div>
      </Link>
      <WishlistButton
        listingId={listing._id}
        initialActive={!!listing.isFavorite}
        className="absolute right-4 top-4 h-10 w-10 border border-stone-200/80 shadow-md transition hover:scale-105"
      />
    </article>
  );
}