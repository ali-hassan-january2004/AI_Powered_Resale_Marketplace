import { Link } from "react-router-dom";
import { Bell, Package, ShieldAlert } from "lucide-react";
import { timeAgo } from "../../utils/timeAgo";

const ICONS = {
  order_placed: Package,
  order_status: Package,
  listing_removed: ShieldAlert,
  system: Bell,
};

export default function NotificationItem({ notification, onRead }) {
  const Icon = ICONS[notification.type] || Bell;

  const content = (
    <div className={`flex gap-3 px-4 py-3 ${notification.isRead ? "" : "bg-emerald-50"}`}>
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-stone-600 shadow-sm">
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-sm ${notification.isRead ? "text-stone-700" : "font-medium"}`}>{notification.message}</p>
        <p className="text-xs text-stone-500">{timeAgo(notification.createdAt)}</p>
      </div>
      {!notification.isRead && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-600" aria-label="Unread" />}
    </div>
  );

  const handle = () => !notification.isRead && onRead?.(notification);

  return notification.link ? (
    <Link to={notification.link} onClick={handle} className="block hover:bg-stone-50">{content}</Link>
  ) : (
    <button onClick={handle} className="block w-full text-left hover:bg-stone-50">{content}</button>
  );
}