import { Banknote, Flag, Package, ShoppingBag, Users } from "lucide-react";
import { getAdminStats } from "../../api/adminApi";
import { formatPrice } from "../../utils/formatPrice";
import useFetch from "../../hooks/useFetch";
import PageContainer from "../../components/layout/PageContainer";
import AdminStatCard from "../../components/admin/AdminStatCard";
import ErrorBanner from "../../components/ui/ErrorBanner";
import Skeleton from "../../components/ui/Skeleton";

export default function AdminDashboard() {
  const { data: s, loading, error, refetch } = useFetch(() => getAdminStats(), []);

  return (
    <PageContainer title="Overview" subtitle="Platform totals" className="!px-0 !py-0">
      {error ? (
        <ErrorBanner message={error} onRetry={refetch} />
      ) : loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 w-full" rounded="rounded-xl" />)}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AdminStatCard label="Users" value={s?.users} icon={Users} />
          <AdminStatCard label="Listings" value={s?.listings} icon={Package} />
          <AdminStatCard label="Orders" value={s?.orders} icon={ShoppingBag} />
          <AdminStatCard label="Revenue (commission)" value={formatPrice(s?.revenue || 0)} icon={Banknote} tone="good" />
          <AdminStatCard label="Flagged items" value={s?.flagged} icon={Flag} tone={s?.flagged ? "bad" : "default"} hint={s?.flagged ? "Needs review" : undefined} />
        </div>
      )}
    </PageContainer>
  );
}