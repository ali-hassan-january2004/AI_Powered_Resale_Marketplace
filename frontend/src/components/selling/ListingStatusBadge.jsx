const MAP = {
  draft: ["Draft", "bg-stone-100 text-stone-700"],
  active: ["Live", "bg-emerald-100 text-emerald-800"],
  reserved: ["Reserved", "bg-amber-100 text-amber-800"],
  sold: ["Sold", "bg-stone-200 text-stone-700"],
  flagged: ["Under review", "bg-red-100 text-red-800"],
  removed: ["Removed", "bg-red-100 text-red-800"],
};

export default function ListingStatusBadge({ status }) {
  const [label, cls] = MAP[status] || [status, "bg-stone-100 text-stone-700"];
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>{label}</span>;
}