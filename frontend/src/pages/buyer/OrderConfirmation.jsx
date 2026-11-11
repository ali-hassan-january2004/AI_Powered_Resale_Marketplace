import { Link, useLocation, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { PATHS } from "../../app/routePaths";
import { getOrder } from "../../api/orders";
import { formatPrice } from "../../utils/formatPrice";
import useFetch from "../../hooks/useFetch";
import PageContainer from "../../components/layout/PageContainer";
import StatusBadge from "../../components/commerce/StatusBadge";
import ErrorBanner from "../../components/ui/ErrorBanner";
import Skeleton from "../../components/ui/Skeleton";

export default function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const { data: order, loading, error, refetch } = useFetch(() => getOrder(id), [id]);
  const orderCount = location.state?.orderIds?.length || 1;

  if (loading) return <PageContainer narrow><Skeleton className="h-64 w-full" rounded="rounded-2xl" /></PageContainer>;
  if (error || !order) return <PageContainer narrow><ErrorBanner message={error || "Order not found."} onRetry={refetch} /></PageContainer>;

  const a = order.shippingAddress;

  return (
    <PageContainer narrow>
      <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center sm:p-10">
        <CheckCircle2 size={48} className="mx-auto text-emerald-600" />
        <h1 className="mt-3 text-2xl font-bold">Thank you for your order!</h1>
        <p className="mt-1 text-sm text-stone-600">
          Order #{String(order._id).slice(-6).toUpperCase()} has been placed. The seller has been notified.
        </p>
        {orderCount > 1 && (
          <p className="mt-2 rounded-lg bg-stone-50 p-2 text-sm text-stone-600">
            Your items were split into {orderCount} orders, one per seller. Find them all in your orders.
          </p>
        )}

        <dl className="mt-6 grid gap-3 text-left text-sm sm:grid-cols-2">
          <div><dt className="text-stone-500">Status</dt><dd><StatusBadge status={order.status} /></dd></div>
          <div><dt className="text-stone-500">Total</dt><dd className="font-semibold">{formatPrice(order.totals?.total)}</dd></div>
          <div><dt className="text-stone-500">Payment</dt><dd>{order.paymentMethod === "cod" ? "Cash on delivery" : "Test card"}</dd></div>
          {a && <div><dt className="text-stone-500">Shipping to</dt><dd>{a.line1}, {a.city}, {a.country}</dd></div>}
        </dl>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to={PATHS.order(order._id)} className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-700">Track order</Link>
          <Link to={PATHS.search} className="rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium hover:bg-stone-50">Keep shopping</Link>
        </div>
      </div>
    </PageContainer>
  );
}