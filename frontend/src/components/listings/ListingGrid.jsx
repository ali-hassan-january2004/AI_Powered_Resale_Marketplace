import ListingCard from "./ListingCard";

const gridCls = "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4";

export default function ListingGrid({
  listings = [],
  loading = false,
  skeletonCount = 8,
  emptyTitle = "No items found",
  emptyHint = "Try changing your filters or search.",
}) {
  if (loading) {
    return (
      <ul className={gridCls} aria-busy="true">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <li key={i}>
            <div className="aspect-square animate-pulse rounded-xl bg-stone-200" />
            <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-stone-200" />
            <div className="mt-1 h-4 w-1/3 animate-pulse rounded bg-stone-200" />
          </li>
        ))}
      </ul>
    );
  }

  if (!listings.length) {
    return (
      <div className="rounded-xl border border-dashed border-stone-300 bg-white py-16 text-center">
        <p className="font-medium">{emptyTitle}</p>
        <p className="mt-1 text-sm text-stone-500">{emptyHint}</p>
      </div>
    );
  }

  return (
    <ul className={gridCls}>
      {listings.map((l) => (
        <li key={l._id}>
          <ListingCard listing={l} />
        </li>
      ))}
    </ul>
  );
}