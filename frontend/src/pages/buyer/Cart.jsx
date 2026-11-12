import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingBag } from "lucide-react";
import { PATHS } from "../../app/routePaths";
import { fetchCart, removeCartItem } from "../../features/cart/cartSlice";
import { calcTotals } from "../../utils/pricing";
import { errMsg } from "../../utils/errors";
import PageContainer from "../../components/layout/PageContainer";
import CartItem from "../../components/commerce/CartItem";
import OrderSummary from "../../components/commerce/OrderSummary";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";
import { toast } from "../../components/ui/Toast";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items = [], status } = useSelector((s) => s.cart);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  const remove = async (listingId) => {
    setRemovingId(listingId);
    try {
      await dispatch(removeCartItem(listingId)).unwrap();
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setRemovingId(null);
    }
  };

  const loading = (status === "idle" || status === "loading") && !items.length;
  const unavailable = items.some((i) => i.status && i.status !== "active");
  const totals = calcTotals(items.filter((i) => !i.status || i.status === "active"));

  return (
    <PageContainer title="Your cart">
      {loading ? (
        <div className="space-y-3">{[0, 1].map((i) => <Skeleton key={i} className="h-28 w-full" rounded="rounded-xl" />)}</div>
      ) : !items.length ? (
        <EmptyState icon={ShoppingBag} title="Your cart is empty" description="Found something you like? Add it to your cart before someone else does. Each item is one of a kind."
          action={<Link to={PATHS.search} className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">Browse items</Link>} />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <ul className="space-y-3">
            {items.map((item) => (
              <CartItem key={item._id} item={item} onRemove={remove} removing={removingId === item._id} />
            ))}
          </ul>
          <div>
            <OrderSummary totals={totals} itemCount={items.length}>
              {unavailable && <p className="mb-3 text-sm text-red-600">Remove unavailable items to continue.</p>}
              <Button className="w-full" size="lg" disabled={unavailable} onClick={() => navigate(PATHS.checkout)}>
                Go to checkout
              </Button>
            </OrderSummary>
          </div>
        </div>
      )}
    </PageContainer>
  );
}