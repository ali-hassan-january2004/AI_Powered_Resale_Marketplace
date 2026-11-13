import { useState } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { PATHS } from "../../app/routePaths";
import { getMyListings } from "../../api/sellerApi";
import { deleteListing, markListingSold } from "../../api/listings";
import useFetch from "../../hooks/useFetch";
import PageContainer from "../../components/layout/PageContainer";
import SellerListingRow from "../../components/seller/SellerListingRow";
import Tabs from "../../components/ui/Tabs";
import Pagination from "../../components/ui/Pagination";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import ErrorBanner from "../../components/ui/ErrorBanner";
import Skeleton from "../../components/ui/Skeleton";
import { toast } from "../../components/ui/toastStore";

const TABS = [
  { id: "all", label: "All" }, { id: "active", label: "Live" }, { id: "draft", label: "Drafts" },
  { id: "reserved", label: "Reserved" }, { id: "sold", label: "Sold" },
];
const LIMIT = 10;

export default function SellerListings() {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState(null); // { type: "sold" | "delete", listing }
  const { data, loading, error, refetch } = useFetch(
    () => getMyListings({ status: status === "all" ? undefined : status, page, limit: LIMIT }),
    [status, page]
  );
  const items = data?.items || [];

  const run = async () => {
    const { type, listing } = confirm;
    if (type === "sold") await markListingSold(listing._id);
    else await deleteListing(listing._id);
    toast.success(type === "sold" ? "Marked as sold" : "Listing deleted");
    refetch();
  };

  return (
    <PageContainer title="My listings" className="!px-0 !py-0"
      actions={<Link to={PATHS.sellNew} className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">New listing</Link>}>
      <Tabs tabs={TABS} value={status} onChange={(v) => { setStatus(v); setPage(1); }} />
      <div className="mt-6">
        {error ? (
          <ErrorBanner message={error} onRetry={refetch} />
        ) : loading ? (
          <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 w-full" rounded="rounded-xl" />)}</div>
        ) : !items.length ? (
          <EmptyState icon={Package} title="No listings here" description="List an item and it will appear in this tab."
            action={<Link to={PATHS.sellNew} className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">List an item</Link>} />
        ) : (
          <ul className="space-y-3">
            {items.map((l) => (
              <li key={l._id}>
                <SellerListingRow listing={l}
                  onMarkSold={(listing) => setConfirm({ type: "sold", listing })}
                  onDelete={(listing) => setConfirm({ type: "delete", listing })} />
              </li>
            ))}
          </ul>
        )}
        <Pagination page={page} limit={LIMIT} total={data?.total || 0} onChange={setPage} />
      </div>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={run}
        danger={confirm?.type === "delete"}
        title={confirm?.type === "sold" ? "Mark as sold?" : "Delete this listing?"}
        message={confirm?.type === "sold"
          ? "Use this if you sold the item elsewhere. It will disappear from search."
          : "It will be removed from the shop. Past orders are not affected."}
        confirmLabel={confirm?.type === "sold" ? "Mark as sold" : "Delete"}
      />
    </PageContainer>
  );
}