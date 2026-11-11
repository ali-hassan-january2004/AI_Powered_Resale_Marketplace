import { useState } from "react";
import { useDispatch } from "react-redux";
import { Bell } from "lucide-react";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "../../api/notifications";
import { setUnreadCount } from "../../features/ui/uiSlice";
import useFetch from "../../hooks/useFetch";
import PageContainer from "../../components/layout/PageContainer";
import NotificationItem from "../../components/notifications/NotificationItem";
import Button from "../../components/ui/Button";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";
import ErrorBanner from "../../components/ui/ErrorBanner";
import Skeleton from "../../components/ui/Skeleton";

const LIMIT = 20;

export default function Notifications() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch, setData } = useFetch(() => getNotifications({ page, limit: LIMIT }), [page]);
  const items = data?.items || [];
  const unread = items.filter((n) => !n.isRead).length;

  const readOne = async (n) => {
    setData((d) => ({ ...d, items: d.items.map((i) => (i._id === n._id ? { ...i, isRead: true } : i)) }));
    try { await markNotificationRead(n._id); } catch { refetch(); }
  };

  const readAll = async () => {
    setData((d) => ({ ...d, items: d.items.map((i) => ({ ...i, isRead: true })) }));
    dispatch(setUnreadCount(0));
    try { await markAllNotificationsRead(); } catch { refetch(); }
  };

  return (
    <PageContainer title="Notifications" narrow
      actions={unread > 0 && <Button variant="secondary" size="sm" onClick={readAll}>Mark all as read</Button>}>
      {error ? (
        <ErrorBanner message={error} onRetry={refetch} />
      ) : loading ? (
        <div className="space-y-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" rounded="rounded-xl" />)}</div>
      ) : !items.length ? (
        <EmptyState icon={Bell} title="No notifications yet" description="Order updates and important alerts will show up here." />
      ) : (
        <ul className="divide-y divide-stone-100 overflow-hidden rounded-xl border border-stone-200 bg-white">
          {items.map((n) => <li key={n._id}><NotificationItem notification={n} onRead={readOne} /></li>)}
        </ul>
      )}
      <Pagination page={page} limit={LIMIT} total={data?.total || 0} onChange={setPage} />
    </PageContainer>
  );
}