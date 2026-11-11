import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { PATHS } from "../../app/routePaths";
import { getSellerOrders, updateOrderStatus } from "../../api/sellerApi";
import useFetch from "../../hooks/useFetch";
import PageContainer from "../../components/layout/PageContainer";
import SellerOrderRow from "../../components/seller/SellerOrderRow";
import Tabs from "../../components/ui/Tabs";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";
import ErrorBanner from "../../components/ui/ErrorBanner";
import Skeleton from "../../components/ui/Skeleton";
import { toast } from "../../components/ui/Toast";

const TABS = ["all", "pending", "confirmed", "shipped", "delivered", "completed", "cancelled"].map((id) => ({
  id, label: id[0].toUpperCase() + id.slice(1),
}));
const LIMIT = 10;

export default function SellerOrders() {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useFetch(
    () => getSellerOrders({ status: status === "all" ? undefined : status, page, limit: LIMIT }),
    [status, page]
  );
  const items = data?.items || [];

  const onUpdateStatus = async (orderId, next, note) => {
    await updateOrderStatus(orderId, next, note);
    toast.success(`Order marked as ${next}`);
    refetch();
  };

  return (
    <PageContainer title="Orders" className="!px-0 !py-0">
      <Tabs tabs={TABS} value={status} onChange={(v) => { setStatus(v); setPage(1); }} />
      <div className="mt-6">
        {error ? (
          <ErrorBanner message={error} onRetry={refetch} />
        ) : loading ? (
          <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 w-full" rounded="rounded-xl" />)}</div>
        ) : !items.length ? (
          <EmptyState icon={ShoppingBag} title="No orders here" description="When a buyer purchases one of your items, it will appear here." />
        ) : (
          <ul className="space-y-3">
            {items.map((o) => (
              <li key={o._id}>
                <SellerOrderRow order={o} onUpdateStatus={onUpdateStatus} />
                <div className="mt-1 text-right">
                  <Link to={PATHS.sellerOrderDetail(o._id)} className="text-xs text-emerald-700 hover:underline">Open full details</Link>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Pagination page={page} limit={LIMIT} total={data?.total || 0} onChange={setPage} />
      </div>
    </PageContainer>
  );
}