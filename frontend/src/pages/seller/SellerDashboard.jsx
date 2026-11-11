import { Link } from "react-router-dom";
import { Eye, Package, ShoppingBag } from "lucide-react";
import { PATHS } from "../../app/routePaths";
import { getSellerOrders, getSellerSummary } from "../../api/sellerApi";
import { formatPrice } from "../../utils/formatPrice";
import useFetch from "../../hooks/useFetch";
import PageContainer from "../../components/layout/PageContainer";
import EarningsSummary from "../../components/seller/EarningsSummary";
import SalesChart from "../../components/seller/SalesChart";
import StatCard from "../../components/seller/StatCard";
import StatusBadge from "../../components/commerce/StatusBadge";
import ErrorBanner from "../../components/ui/ErrorBanner";
import Skeleton from "../../components/ui/Skeleton";

export default function SellerDashboard() {
  const summary = useFetch(() => getSellerSummary(), []);
  const orders = useFetch(() => getSellerOrders({ limit: 5 }), []);
  const s = summary.data;

  return (
    <PageContainer title="Seller dashboard" className="!px-0 !py-0"
      actions={<Link to={PATHS.sellNew} className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">New listing</Link>}>
      {summary.error ? (
        <ErrorBanner message={summary.error} onRetry={summary.refetch} />
      ) : summary.loading ? (
        <Skeleton className="h-28 w-full" rounded="rounded-xl" />
      ) : (
        <div className="space-y-6">
          <EarningsSummary summary={s} />
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Active listings" value={s?.activeListings ?? 0} icon={Package} />
            <StatCard label="Orders to handle" value={s?.pendingOrders ?? 0} icon={ShoppingBag} hint="Pending or confirmed" />
            <StatCard label="Total views" value={s?.totalViews ?? 0} icon={Eye} />
          </div>

          <section className="rounded-xl border border-stone-200 bg-white p-5">
            <h2 className="mb-3 font-semibold">Sales over time</h2>
            <SalesChart data={s?.salesOverTime || []} />
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-stone-200 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold">Recent orders</h2>
                <Link to={PATHS.sellerOrders} className="text-sm text-emerald-700 hover:underline">See all</Link>
              </div>
              {orders.loading ? <Skeleton className="h-24 w-full" /> : (orders.data?.items || []).length ? (
                <ul className="divide-y divide-stone-100">
                  {orders.data.items.map((o) => (
                    <li key={o._id} className="flex items-center justify-between gap-2 py-2.5 text-sm">
                      <Link to={PATHS.sellerOrderDetail(o._id)} className="hover:underline">#{String(o._id).slice(-6).toUpperCase()}</Link>
                      <span className="font-medium">{formatPrice(o.totals?.total)}</span>
                      <StatusBadge status={o.status} />
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-stone-500">No orders yet.</p>}
            </section>

            <section className="rounded-xl border border-stone-200 bg-white p-5">
              <h2 className="mb-3 font-semibold">Most viewed</h2>
              {(s?.mostViewed || []).length ? (
                <ul className="divide-y divide-stone-100">
                  {s.mostViewed.map((l) => (
                    <li key={l._id} className="flex items-center justify-between gap-2 py-2.5 text-sm">
                      <Link to={PATHS.listing(l._id)} className="line-clamp-1 hover:underline">{l.title}</Link>
                      <span className="flex shrink-0 items-center gap-1 text-stone-500"><Eye size={14} /> {l.views}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-stone-500">Views will show up here once buyers find your items.</p>}
            </section>
          </div>
        </div>
      )}
    </PageContainer>
  );
}