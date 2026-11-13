import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Bell } from "lucide-react";
import { PATHS } from "../../app/routePaths";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "../../api/notifications";
import { setUnreadCount } from "../../features/ui/uiSlice";
import NotificationItem from "./NotificationItem";

const POLL_MS = 60000;

export default function NotificationBell() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const unread = useSelector((s) => s.ui.unreadCount ?? 0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const ref = useRef(null);

  const load = useCallback(async () => {
    try {
      const res = await getNotifications({ limit: 20 });
      const list = res.items || [];
      setItems(list);
      dispatch(setUnreadCount(list.filter((n) => !n.isRead).length));
    } catch {
      /* the bell should never break the page */
    }
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial and periodic refreshes update remote notification state.
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [user, load]);

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!user) return null;

  const readOne = async (n) => {
    setItems((list) => list.map((i) => (i._id === n._id ? { ...i, isRead: true } : i)));
    dispatch(setUnreadCount(Math.max(0, unread - 1)));
    setOpen(false);
    try { await markNotificationRead(n._id); } catch { load(); }
  };

  const readAll = async () => {
    setItems((list) => list.map((i) => ({ ...i, isRead: true })));
    dispatch(setUnreadCount(0));
    try { await markAllNotificationsRead(); } catch { load(); }
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`} aria-expanded={open} className="relative">
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-semibold text-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[90vw] overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-stone-100 px-4 py-2.5">
            <span className="text-sm font-semibold">Notifications</span>
            {unread > 0 && <button onClick={readAll} className="text-xs text-emerald-700 hover:underline">Mark all read</button>}
          </div>
          <ul className="max-h-96 divide-y divide-stone-100 overflow-y-auto">
            {items.slice(0, 6).map((n) => (
              <li key={n._id}><NotificationItem notification={n} onRead={readOne} /></li>
            ))}
            {!items.length && <li className="px-4 py-8 text-center text-sm text-stone-500">You're all caught up.</li>}
          </ul>
          <Link to={PATHS.notifications} onClick={() => setOpen(false)} className="block border-t border-stone-100 py-2.5 text-center text-sm font-medium text-emerald-700 hover:bg-stone-50">
            View all
          </Link>
        </div>
      )}
    </div>
  );
}