import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { PATHS } from "../../app/routePaths";
import { selectUser } from "../../features/auth/authSelectors";
import { selectWishlistFlag, toggleWishlist } from "../../features/wishlist/wishlistSlice";

export default function WishlistButton({ listingId, initialActive = false, onChange, className = "" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const stored = useSelector(selectWishlistFlag(listingId));
  const [busy, setBusy] = useState(false);
  const active = stored ?? initialActive;

  const toggle = async (e) => {
    e.preventDefault(); // the button sits inside a card link
    e.stopPropagation();
    if (!user) return navigate(PATHS.login, { state: { from: location } });
    if (busy) return;
    const next = !active;
    setBusy(true);
    try {
      await dispatch(toggleWishlist({ listingId, add: next })).unwrap();
      onChange?.(next);
    } catch {
      /* the slice already rolled the heart back */
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur hover:bg-white ${className}`}
    >
      <Heart size={18} className={active ? "fill-red-500 text-red-500" : "text-stone-700"} />
    </button>
  );
}