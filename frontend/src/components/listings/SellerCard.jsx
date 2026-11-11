import { Link } from "react-router-dom";
import { PATHS } from "../../app/routePaths";
import RatingStars from "../ui/RatingStars";

// seller: { _id, name, avatarUrl, sellerProfile: { shopName }, ratingAvg, ratingCount }
export default function SellerCard({ seller }) {
  if (!seller) return null;
  const shop = seller.sellerProfile?.shopName || seller.name;

  return (
    <Link
      to={PATHS.seller(seller._id)}
      className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 hover:border-emerald-600"
    >
      {seller.avatarUrl ? (
        <img src={seller.avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
      ) : (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-semibold text-white">
          {shop?.[0]?.toUpperCase()}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate font-medium">{shop}</p>
        <div className="flex items-center gap-1.5 text-xs text-stone-500">
          <RatingStars value={seller.ratingAvg || 0} size={14} />
          <span>
            {seller.ratingCount ? `${(seller.ratingAvg || 0).toFixed(1)} (${seller.ratingCount})` : "No reviews yet"}
          </span>
        </div>
      </div>
    </Link>
  );
}