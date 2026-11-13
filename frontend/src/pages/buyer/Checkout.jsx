import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PATHS } from "../../app/routePaths";
import { createOrder } from "../../api/orders";
import { clearCart, fetchCart } from "../../features/cart/cartSlice";
import { calcTotals } from "../../utils/pricing";
import { errMsg } from "../../utils/errors";
import PageContainer from "../../components/layout/PageContainer";
import AddressPicker from "../../components/commerce/AddressPicker";
import PaymentOptions from "../../components/commerce/PaymentOptions";
import OrderSummary from "../../components/commerce/OrderSummary";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { toast } from "../../components/ui/toastStore";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const { items = [], status } = useSelector((s) => s.cart);
  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  if ((status === "idle" || status === "loading") && !items.length) {
    return <PageContainer><div className="flex justify-center py-16"><Spinner size={28} /></div></PageContainer>;
  }
  if (status === "succeeded" && !items.length && !placing) return <Navigate to={PATHS.cart} replace />;

  const unavailable = items.some((i) => i.status && i.status !== "active");
  const totals = calcTotals(items);

  const place = async () => {
    if (!address) return setError("Choose or enter a shipping address.");
    setError("");
    setPlacing(true);
    try {
      const res = await createOrder({ shippingAddress: address, paymentMethod });
      const orders = res.orders || [res];
      dispatch(clearCart());
      navigate(PATHS.orderConfirmation(orders[0]._id), { replace: true, state: { orderIds: orders.map((o) => o._id) } });
    } catch (e) {
      setPlacing(false);
      if (e.status === 409) {
        toast.error("One of your items was just sold. We've updated your cart.");
        dispatch(fetchCart());
        navigate(PATHS.cart);
      } else {
        setError(errMsg(e));
      }
    }
  };

  return (
    <PageContainer title="Checkout">
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <AddressPicker addresses={user?.addresses || []} onSelect={setAddress} />
          <PaymentOptions value={paymentMethod} onChange={setPaymentMethod} />
        </div>
        <div>
          <OrderSummary totals={totals} itemCount={items.length}>
            {error && <p role="alert" className="mb-3 text-sm text-red-600">{error}</p>}
            {unavailable && <p className="mb-3 text-sm text-red-600">Some items are no longer available. <Link to={PATHS.cart} className="underline">Review your cart</Link>.</p>}
            <Button className="w-full" size="lg" loading={placing} disabled={unavailable} onClick={place}>
              Place order
            </Button>
            <p className="mt-2 text-center text-xs text-stone-500">Payment is simulated in this version.</p>
          </OrderSummary>
        </div>
      </div>
    </PageContainer>
  );
}