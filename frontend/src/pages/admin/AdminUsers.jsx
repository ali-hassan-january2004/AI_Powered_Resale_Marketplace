import { useState } from "react";
import { getAdminUsers, toggleBlockUser } from "../../api/adminApi";
import useFetch from "../../hooks/useFetch";
import PageContainer from "../../components/layout/PageContainer";
import SearchBar from "../../components/listings/SearchBar";
import UsersTable from "../../components/admin/UsersTable";
import Pagination from "../../components/ui/Pagination";
import ErrorBanner from "../../components/ui/ErrorBanner";
import { toast } from "../../components/ui/Toast";

const LIMIT = 20;

export default function AdminUsers() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useFetch(() => getAdminUsers({ q: q || undefined, page, limit: LIMIT }), [q, page]);

  const onToggleBlock = async (user, blocked) => {
    await toggleBlockUser(user._id, blocked);
    toast.success(blocked ? `${user.name} was blocked` : `${user.name} was unblocked`);
    refetch();
  };

  return (
    <PageContainer title="Users" className="!px-0 !py-0">
      <div className="mb-4 max-w-md">
        <SearchBar defaultValue={q} onSearch={(v) => { setQ(v); setPage(1); }} placeholder="Search by name or email…" />
      </div>
      {error ? (
        <ErrorBanner message={error} onRetry={refetch} />
      ) : (
        <>
          <UsersTable users={data?.items} loading={loading} onToggleBlock={onToggleBlock} />
          <Pagination page={page} limit={LIMIT} total={data?.total || 0} onChange={setPage} />
        </>
      )}
    </PageContainer>
  );
}