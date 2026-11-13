import { Link, useParams } from "react-router-dom";
import { PATHS } from "../../app/routePaths";
import { getSellerOrder, updateOrderStatus } from "../../api/sellerApi";
import { formatPrice } from "../../utils/formatPrice";
import useFetch from "../../hooks/useFetch";
import PageContainer from "../../components/layout/PageContainer";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import OrderTimeline from "../../components/commerce/OrderTimeline";
import StatusBadge from "../../components/commerce/StatusBadge";
import OrderStatusUpdater from "../../components/seller/OrderStatusUpdater";
import ErrorBanner from "../../components/ui/ErrorBanner";
import Skeleton from "../../components/ui/Skeleton";
import { toast } from "../../components/ui/toastStore";

export default function SellerOrderDetail() {
  const { id } = useParams();
  const { data: order, loading, error, refetch } = useFetch(() => getSellerOrder(id), [id]);

  if (loading) return <PageContainer className="!px-0 !py-0"><Skeleton className="h-96 w-full" rounded="rounded-2xl" /></PageContainer>;
  if (error || !order) return <PageContainer className="!px-0 !py-0"><ErrorBanner message={error || "Order not found."} onRetry={refetch} /></PageContainer>;

  const a = order.shippingAddress;
  const t = order.totals || {};

  const update = async (status, note) => {
    await updateOrderStatus(order._id, status, note);
    toast.success(`Order marked as ${status}`);
    refetch();
  };

  return (
    <PageContainer className="!px-0 !py-0">
      <Breadcrumbs items={[{ label: "Orders", to: PATHS.sellerOrders }, { label: `#${String(order._id).slice(-6).toUpperCase()}` }]} />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">Order #{String(order._id).slice(-6).toUpperCase()}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-xl border border-stone-200 bg-white p-5">
            <h2 className="mb-3 font-semibold">Items</h2>
            <ul className="space-y-3">
              {order.items?.map((it) => (
                <li key={it.listing} className="flex items-center gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                    {it.image && <img src={it.image} alt="" loading="lazy" className="h-full w-full object-cover" />}
                  </div>
                  <Link to={PATHS.listing(it.listing)} className="line-clamp-2 flex-1 text-sm hover:underline">{it.title}</Link>
                  <span className="text-sm font-medium">{formatPrice(it.priceAtPurchase)}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-xl border border-stone-200 bg-white p-5">
            <h2 className="mb-4 font-semibold">Status history</h2>
            <OrderTimeline status={order.status} statusHistory={order.statusHistory} />
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-xl border border-stone-200 bg-white p-5">
            <h2 className="mb-3 font-semibold">Update status</h2>
            <OrderStatusUpdater order={order} onUpdate={update} />
          </section>
          <section className="rounded-xl border border-stone-200 bg-white p-5 text-sm">
            <p className="font-semibold">Buyer</p>
            <p className="mt-1 text-stone-600">{order.buyer?.name || "–"}</p>
            {a && (<><p className="mt-4 font-semibold">Ship to</p><p className="mt-1 text-stone-600">{a.line1}, {a.city}, {a.region} {a.postalCode}, {a.country}</p></>)}
            <p className="mt-4 font-semibold">Payment</p>
            <p className="mt-1 text-stone-600">{order.paymentMethod === "cod" ? "Cash on delivery" : "Test card"} · <span className="capitalize">{order.paymentStatus}</span></p>
          </section>
          <section className="rounded-xl border border-stone-200 bg-white p-5 text-sm">
            <dl className="space-y-1.5">
              <div className="flex justify-between"><dt className="text-stone-500">Subtotal</dt><dd>{formatPrice(t.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-stone-500">Shipping</dt><dd>{formatPrice(t.shipping)}</dd></div>
              <div className="flex justify-between"><dt className="text-stone-500">Platform fee</dt><dd>−{formatPrice(t.platformFee)}</dd></div>
              <div className="flex justify-between border-t border-stone-100 pt-2 font-semibold"><dt>Total</dt><dd>{formatPrice(t.total)}</dd></div>
            </dl>
          </section>
        </aside>
      </div>
    </PageContainer>
  );
}