import { Link } from "react-router-dom";
import { PATHS } from "../../app/routePaths";
import { formatPrice } from "../../utils/formatPrice";
import StatusBadge from "../commerce/StatusBadge";
import Button from "../ui/Button";

export default function ListingsTable({ listings = [], onRemove, loading = false }) {
  if (loading) return <p className="py-8 text-center text-sm text-stone-500">Loading listings…</p>;
  if (!listings.length) return <p className="py-8 text-center text-sm text-stone-500">No listings found.</p>;

  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-stone-50 text-xs uppercase text-stone-500">
          <tr>
            <th className="px-4 py-3">Item</th>
            <th className="px-4 py-3">Seller</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {listings.map((l) => {
            const cover = l.images?.find((i) => i.isCover) || l.images?.[0];
            return (
              <tr key={l._id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                      {cover && <img src={cover.url} alt="" loading="lazy" className="h-full w-full object-cover" />}
                    </div>
                    <Link to={PATHS.listing(l._id)} className="line-clamp-2 font-medium hover:underline">
                      {l.title}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3 text-stone-600">{l.seller?.name || "–"}</td>
                <td className="px-4 py-3">{formatPrice(l.price)}</td>
                <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                <td className="px-4 py-3 text-right">
                  {l.status !== "removed" && l.status !== "sold" && (
                    <Button size="sm" variant="danger" onClick={() => onRemove(l)}>Remove</Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}