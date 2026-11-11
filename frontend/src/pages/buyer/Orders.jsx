import { useState } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { PATHS } from "../../app/routePaths";
import { getOrders } from "../../api/orders";
import useFetch from "../../hooks/useFetch";
import PageContainer from "../../components/layout/PageContainer";
import OrderCard from "../../components/commerce/OrderCard";
import Tabs from "../../components/ui/Tabs";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";
import ErrorBanner from "../../components/ui/ErrorBanner";
import Skeleton from "../../components/ui/Skeleton";

const TABS = ["all", "pending", "confirmed", "shipped", "delivered", "completed", "cancelled"].map((id) => ({
  id,
  label: id[0].toUpperCase() + id.slice(1),
}));
const LIMIT = 10;

export default function Orders() {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useFetch(
    () => getOrders({ status: status === "all" ? undefined : status, page, limit: LIMIT }),
    [status, page]
  );
  const items = data?.items || [];

  return (
    <PageContainer title="My orders" narrow>
      <Tabs tabs={TABS} value={status} onChange={(v) => { setStatus(v); setPage(1); }} />
      <div className="mt-6">
        {error ? (
          <ErrorBanner message={error} onRetry={refetch} />
        ) : loading ? (
          <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-32 w-full" rounded="rounded-xl" />)}</div>
        ) : !items.length ? (
          <EmptyState icon={Package} title={status === "all" ? "No orders yet" : `No ${status} orders`}
            action={status === "all" && <Link to={PATHS.search} className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">Start shopping</Link>} />
        ) : (
          <ul className="space-y-3">{items.map((o) => <li key={o._id}><OrderCard order={o} /></li>)}</ul>
        )}
        <Pagination page={page} limit={LIMIT} total={data?.total || 0} onChange={setPage} />
      </div>
    </PageContainer>
  );
}