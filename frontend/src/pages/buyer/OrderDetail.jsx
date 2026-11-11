import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PATHS } from "../../app/routePaths";
import { cancelOrder, getOrder } from "../../api/orders";
import { createReview } from "../../api/reviews";
import { formatPrice } from "../../utils/formatPrice";
import useFetch from "../../hooks/useFetch";
import PageContainer from "../../components/layout/PageContainer";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import OrderTimeline from "../../components/commerce/OrderTimeline";
import OrderSummary from "../../components/commerce/OrderSummary";
import StatusBadge from "../../components/commerce/StatusBadge";
import ReviewForm from "../../components/reviews/ReviewForm";
import RatingStars from "../../components/ui/RatingStars";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ErrorBanner from "../../components/ui/ErrorBanner";
import Skeleton from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";
import { toast } from "../../components/ui/Toast";

export default function OrderDetail() {
  const { id } = useParams();
  const { data: order, loading, error, refetch } = useFetch(() => getOrder(id), [id]);
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (loading) return <PageContainer><Skeleton className="h-96 w-full" rounded="rounded-2xl" /></PageContainer>;
  if (error || !order) return <PageContainer narrow><ErrorBanner message={error || "Order not found."} onRetry={refetch} /></PageContainer>;

  const a = order.shippingAddress;
  const canCancel = ["pending", "confirmed"].includes(order.status);
  const canReview = order.status === "completed" && !order.review;

  const doCancel = async () => {
    await cancelOrder(order._id);
    toast.success("Order cancelled");
    refetch();
  };

  const submitReview = async ({ rating, comment }) => {
    await createReview(order._id, { rating, comment });
    toast.success("Thanks for your review!");
    refetch();
  };

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: "My orders", to: PATHS.orders }, { label: `Order #${String(order._id).slice(-6).toUpperCase()}` }]} />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">Order #{String(order._id).slice(-6).toUpperCase()}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="rounded-xl border border-stone-200 bg-white p-5">
            <h2 className="mb-4 font-semibold">Tracking</h2>
            <OrderTimeline status={order.status} statusHistory={order.statusHistory} />
          </section>

          <section className="rounded-xl border border-stone-200 bg-white p-5">
            <h2 className="mb-3 font-semibold">Items</h2>
            <ul className="space-y-3">
              {order.items?.map((it) => (
                <li key={it.listing} className="flex items-center gap-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                    {it.image && <img src={it.image} alt="" loading="lazy" className="h-full w-full object-cover" />}
                  </div>
                  <Link to={PATHS.listing(it.listing)} className="line-clamp-2 flex-1 text-sm hover:underline">{it.title}</Link>
                  <span className="text-sm font-medium">{formatPrice(it.priceAtPurchase)}</span>
                </li>
              ))}
            </ul>
          </section>

          {order.review ? (
            <section className="rounded-xl border border-stone-200 bg-white p-5">
              <h2 className="mb-2 font-semibold">Your review</h2>
              <RatingStars value={order.review.rating} />
              {order.review.comment && <p className="mt-2 text-sm text-stone-700">{order.review.comment}</p>}
            </section>
          ) : canReview ? (
            <section>
              <h2 className="mb-2 font-semibold">How was your experience?</h2>
              <ReviewForm onSubmit={submitReview} />
            </section>
          ) : null}
        </div>

        <aside className="space-y-4">
          <OrderSummary totals={order.totals} itemCount={order.items?.length}>
            {canCancel && <Button variant="secondary" className="w-full" onClick={() => setConfirmCancel(true)}>Cancel order</Button>}
          </OrderSummary>
          <div className="rounded-xl border border-stone-200 bg-white p-5 text-sm">
            <p className="font-semibold">Shipping address</p>
            {a && <p className="mt-1 text-stone-600">{a.line1}, {a.city}, {a.region} {a.postalCode}, {a.country}</p>}
            <p className="mt-4 font-semibold">Payment</p>
            <p className="mt-1 text-stone-600">{order.paymentMethod === "cod" ? "Cash on delivery" : "Test card"} · <span className="capitalize">{order.paymentStatus}</span></p>
            {order.seller && (
              <>
                <p className="mt-4 font-semibold">Seller</p>
                <Link to={PATHS.seller(order.seller._id || order.seller)} className="mt-1 block text-emerald-700 hover:underline">
                  {order.seller.sellerProfile?.shopName || order.seller.name || "View seller"}
                </Link>
              </>
            )}
          </div>
        </aside>
      </div>

      <ConfirmDialog open={confirmCancel} onClose={() => setConfirmCancel(false)} onConfirm={doCancel}
        title="Cancel this order?" message="The items will become available to other buyers again." confirmLabel="Cancel order" danger />
    </PageContainer>
  );
}