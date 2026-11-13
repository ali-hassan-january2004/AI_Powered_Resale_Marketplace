import { useState } from "react";
import { getAdminListings, removeAdminListing } from "../../api/adminApi";
import useFetch from "../../hooks/useFetch";
import PageContainer from "../../components/layout/PageContainer";
import SearchBar from "../../components/listings/SearchBar";
import ListingsTable from "../../components/admin/ListingsTable";
import RemoveListingModal from "../../components/admin/RemoveListingModal";
import Select from "../../components/ui/Select";
import Pagination from "../../components/ui/Pagination";
import ErrorBanner from "../../components/ui/ErrorBanner";
import { toast } from "../../components/ui/toastStore";

const LIMIT = 20;
const STATUSES = ["active", "reserved", "sold", "flagged", "removed", "draft"].map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }));

export default function AdminListings() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [removing, setRemoving] = useState(null);
  const { data, loading, error, refetch } = useFetch(
    () => getAdminListings({ q: q || undefined, status: status || undefined, page, limit: LIMIT }),
    [q, status, page]
  );

  const confirmRemove = async (reason) => {
    await removeAdminListing(removing._id, reason);
    toast.success("Listing removed. The seller was notified.");
    refetch();
  };

  return (
    <PageContainer title="Listings" className="!px-0 !py-0">
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="min-w-[240px] flex-1 max-w-md">
          <SearchBar defaultValue={q} onSearch={(v) => { setQ(v); setPage(1); }} placeholder="Search listings…" />
        </div>
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} placeholder="All statuses" options={STATUSES} aria-label="Filter by status" />
      </div>
      {error ? (
        <ErrorBanner message={error} onRetry={refetch} />
      ) : (
        <>
          <ListingsTable listings={data?.items} loading={loading} onRemove={setRemoving} />
          <Pagination page={page} limit={LIMIT} total={data?.total || 0} onChange={setPage} />
        </>
      )}
      <RemoveListingModal open={!!removing} listing={removing} onClose={() => setRemoving(null)} onConfirm={confirmRemove} />
    </PageContainer>
  );
}