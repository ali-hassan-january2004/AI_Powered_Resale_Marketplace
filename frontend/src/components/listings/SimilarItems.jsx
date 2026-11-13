import { useEffect, useState } from "react";
import { getSimilarListings } from "../../api/listings";
import ListingGrid from "./ListingGrid";

export default function SimilarItems({ listingId, title = "More like this" }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Show loading while fetching items for a changed listing.
    setLoading(true);
    getSimilarListings(listingId)
      .then((res) => !cancelled && setItems(Array.isArray(res) ? res : res.items || []))
      .catch(() => !cancelled && setItems([]))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [listingId]);

  if (!loading && !items.length) return null; // hide the section when empty

  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <ListingGrid listings={items.slice(0, 8)} loading={loading} skeletonCount={4} />
    </section>
  );
}