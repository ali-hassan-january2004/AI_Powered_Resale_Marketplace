import { useCallback, useEffect, useState } from "react";
import { getSellerReviews } from "../../api/reviews";
import ReviewItem from "./ReviewItem";
import Button from "../ui/Button";

const PAGE_SIZE = 10;

export default function ReviewList({ sellerId }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(
    async (p) => {
      setLoading(true);
      try {
        const res = await getSellerReviews(sellerId, { page: p, limit: PAGE_SIZE });
        setItems((prev) => (p === 1 ? res.items : [...prev, ...res.items]));
        setTotal(res.total ?? 0);
        setPage(p);
        setError("");
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [sellerId]
  );

  useEffect(() => { load(1); }, [load]);

  if (error) return <p className="py-6 text-sm text-red-600">{error}</p>;
  if (!loading && !items.length) return <p className="py-6 text-sm text-stone-500">No reviews yet.</p>;

  return (
    <div>
      <ul className="divide-y divide-stone-100">
        {items.map((r) => <li key={r._id}><ReviewItem review={r} /></li>)}
      </ul>
      {loading && <p className="py-4 text-center text-sm text-stone-500">Loading reviews…</p>}
      {!loading && items.length < total && (
        <div className="pt-2 text-center">
          <Button variant="secondary" onClick={() => load(page + 1)}>Load more</Button>
        </div>
      )}
    </div>
  );
}