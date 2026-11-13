import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Heart } from "lucide-react";
import { PATHS } from "../../app/routePaths";
import { getWishlist } from "../../api/wishlist";
import { toggleWishlist } from "../../features/wishlist/wishlistSlice";
import { addCartItem } from "../../features/cart/cartSlice";
import { errMsg } from "../../utils/errors";
import useFetch from "../../hooks/useFetch";
import PageContainer from "../../components/layout/PageContainer";
import ListingCard from "../../components/listings/ListingCard";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import ErrorBanner from "../../components/ui/ErrorBanner";
import Skeleton from "../../components/ui/Skeleton";
import { toast } from "../../components/ui/toastStore";

export default function Wishlist() {
  const dispatch = useDispatch();
  const { data, loading, error, refetch, setData } = useFetch(() => getWishlist(), []);
  const [movingId, setMovingId] = useState(null);
  const items = Array.isArray(data) ? data : data?.items || [];

  const dropFromList = (id) => setData(() => items.filter((l) => l._id !== id));

  const moveToCart = async (listing) => {
    setMovingId(listing._id);
    try {
      await dispatch(addCartItem(listing._id)).unwrap();
      await dispatch(toggleWishlist({ listingId: listing._id, add: false })).unwrap();
      dropFromList(listing._id);
      toast.success("Moved to your cart");
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setMovingId(null);
    }
  };

  return (
    <PageContainer title="My wishlist">
      {error ? (
        <ErrorBanner message={error} onRetry={refetch} />
      ) : loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="aspect-square w-full" rounded="rounded-xl" />)}</div>
      ) : !items.length ? (
        <EmptyState icon={Heart} title="Your wishlist is empty" description="Tap the heart on any item to save it for later."
          action={<Link to={PATHS.search} className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">Browse items</Link>} />
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((l) => (
            <li key={l._id}>
              <ListingCard listing={{ ...l, isFavorite: true }} />
              <Button size="sm" variant="secondary" className="mt-2 w-full" disabled={l.status !== "active"}
                loading={movingId === l._id} onClick={() => moveToCart(l)}>
                {l.status === "active" ? "Move to cart" : "Unavailable"}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </PageContainer>
  );
}