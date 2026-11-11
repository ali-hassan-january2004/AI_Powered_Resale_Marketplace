    import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { PATHS } from "../../app/routePaths";
import { addToWishlist, removeFromWishlist } from "../../api/wishlist";

export default function WishlistButton({ listingId, initialActive = false, onChange, className = "" }) {
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(initialActive);
  const [busy, setBusy] = useState(false);

  const toggle = async (e) => {
    e.preventDefault(); // the button sits inside a card link
    e.stopPropagation();
    if (!user) return navigate(PATHS.login, { state: { from: location } });
    if (busy) return;

    const next = !active;
    setActive(next); // optimistic update
    setBusy(true);
    try {
      if (next) await addToWishlist(listingId);
      else await removeFromWishlist(listingId);
      onChange?.(next);
    } catch {
      setActive(!next); // roll back
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