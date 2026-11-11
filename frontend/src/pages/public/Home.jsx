import { Link } from "react-router-dom";
import { PATHS } from "../../app/routePaths";
import { getCategories } from "../../api/categories";
import { getListings } from "../../api/listings";
import useFetch from "../../hooks/useFetch";
import CategoryTile from "../../components/listings/CategoryTile";
import ListingGrid from "../../components/listings/ListingGrid";
import ErrorBanner from "../../components/ui/ErrorBanner";

function Section({ title, to, children }) {
  return (
    <section className="mt-12">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
        {to && <Link to={to} className="text-sm font-medium text-emerald-700 hover:underline">See all</Link>}
      </div>
      {children}
    </section>
  );
}

export default function Home() {
  const cats = useFetch(() => getCategories(), []);
  const fresh = useFetch(() => getListings({ sort: "newest", limit: 8 }), []);
  const popular = useFetch(() => getListings({ sort: "popular", limit: 8 }), []);

  const topCategories = (cats.data || []).filter((c) => !c.parent && c.isActive !== false);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8">
      <section className="mt-6 rounded-3xl bg-stone-900 px-6 py-12 text-white sm:px-12 sm:py-16">
        <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">Pre-loved fashion</p>
        <h1 className="mt-3 max-w-xl text-3xl font-bold leading-tight sm:text-5xl">
          Give great clothes a second life.
        </h1>
        <p className="mt-4 max-w-md text-stone-300">
          Buy curated second-hand pieces, or turn your wardrobe into cash in under a minute.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={PATHS.search} className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-stone-950 hover:bg-emerald-400">
            Start shopping
          </Link>
          <Link to={PATHS.sellNew} className="rounded-full border border-stone-600 px-6 py-2.5 text-sm font-semibold hover:bg-stone-800">
            Sell an item
          </Link>
        </div>
      </section>

      {topCategories.length > 0 && (
        <Section title="Shop by category">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {topCategories.map((c) => <li key={c._id}><CategoryTile category={c} /></li>)}
          </ul>
        </Section>
      )}

      <Section title="New arrivals" to={`${PATHS.search}?sort=newest`}>
        {fresh.error ? (
          <ErrorBanner message={fresh.error} onRetry={fresh.refetch} />
        ) : (
          <ListingGrid listings={fresh.data?.items} loading={fresh.loading} skeletonCount={8}
            emptyTitle="Nothing here yet" emptyHint="New items will appear as sellers list them." />
        )}
      </Section>

      <Section title="Popular right now" to={`${PATHS.search}?sort=popular`}>
        {popular.error ? (
          <ErrorBanner message={popular.error} onRetry={popular.refetch} />
        ) : (
          <ListingGrid listings={popular.data?.items} loading={popular.loading} skeletonCount={4}
            emptyTitle="Nothing popular yet" />
        )}
      </Section>
    </div>
  );
}