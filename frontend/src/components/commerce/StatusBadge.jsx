const STYLES = {
  // orders
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-teal-100 text-teal-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-stone-200 text-stone-700",
  // listings
  draft: "bg-stone-100 text-stone-700",
  active: "bg-emerald-100 text-emerald-800",
  reserved: "bg-amber-100 text-amber-800",
  sold: "bg-stone-200 text-stone-700",
  flagged: "bg-red-100 text-red-800",
  removed: "bg-red-100 text-red-800",
  // reports / payments
  open: "bg-amber-100 text-amber-800",
  dismissed: "bg-stone-200 text-stone-700",
  actioned: "bg-emerald-100 text-emerald-800",
  paid: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-800",
};

export default function StatusBadge({ status, className = "" }) {
  if (!status) return null;
  const label = status.replace(/_/g, " ");
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
        STYLES[status] || "bg-stone-100 text-stone-700"
      } ${className}`}
    >
      {label}
    </span>
  );
}