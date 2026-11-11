import StatusBadge from "../commerce/StatusBadge";
import Button from "../ui/Button";

export default function ReportsTable({ reports = [], onReview, loading = false }) {
  if (loading) return <p className="py-8 text-center text-sm text-stone-500">Loading reports…</p>;
  if (!reports.length) return <p className="py-8 text-center text-sm text-stone-500">No reports to review.</p>;

  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-stone-50 text-xs uppercase text-stone-500">
          <tr>
            <th className="px-4 py-3">Target</th>
            <th className="px-4 py-3">Reason</th>
            <th className="px-4 py-3">Reported by</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {reports.map((r) => (
            <tr key={r._id}>
              <td className="px-4 py-3 capitalize">{r.targetType}</td>
              <td className="max-w-xs px-4 py-3"><p className="line-clamp-2">{r.reason}</p></td>
              <td className="px-4 py-3 text-stone-600">{r.reporter?.name || "–"}</td>
              <td className="px-4 py-3 text-stone-600">{new Date(r.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
              <td className="px-4 py-3 text-right">
                {r.status === "open" && <Button size="sm" onClick={() => onReview(r)}>Review</Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}