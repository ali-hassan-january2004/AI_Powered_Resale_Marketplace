import { ArrowDownRight, ArrowRight, BadgeCheck, Leaf, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { PATHS } from "../../app/routePaths";
import { getCategories } from "../../api/categories";
import { getListings } from "../../api/listings";
import useFetch from "../../hooks/useFetch";
import CategoryTile from "../../components/listings/CategoryTile";
import ListingGrid from "../../components/listings/ListingGrid";
import ErrorBanner from "../../components/ui/ErrorBanner";

function Section({ eyebrow, title, to, children }) {
  return (
    <section className="mt-16 sm:mt-20">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              {eyebrow}
            </p>
          )}
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        </div>
        {to && (
          <Link
            to={to}
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-stone-700 transition hover:text-emerald-700"
          >
            View all
            <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

const BENEFITS = [
  { icon: Sparkles, title: "One-of-a-kind finds", detail: "Pieces with a little more story" },
  { icon: BadgeCheck, title: "Shop with confidence", detail: "Details and condition up front" },
  { icon: Leaf, title: "A lighter way to shop", detail: "Give great things another life" },
];

export default function Home() {
  const cats = useFetch(() => getCategories(), []);
  const fresh = useFetch(() => getListings({ sort: "newest", limit: 8 }), []);
  const popular = useFetch(() => getListings({ sort: "popular", limit: 8 }), []);
  const topCategories = (cats.data || []).filter((category) => !category.parent && category.isActive !== false);

  return (
    <div className="mx-auto max-w-[88rem] px-4 pb-16 sm:px-6 lg:px-8">
      <section className="mt-5 grid overflow-hidden rounded-[2rem] bg-[#f0ede5] shadow-sm lg:min-h-[520px] lg:grid-cols-[1fr_0.92fr]">
        <div className="flex flex-col items-start justify-center px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            Good finds, passed on
          </span>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight text-stone-900 sm:text-6xl">
            Great style deserves{" "}
            <span className="font-normal italic text-emerald-800">a second life.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-stone-600 sm:text-lg">
            Find pre-loved pieces worth keeping, or pass your own favorites on to someone new.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={PATHS.search}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-stone-900 px-6 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-800"
            >
              Explore the edit
              <ArrowRight size={16} />
            </Link>
            <Link
              to={PATHS.sellNew}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-stone-300 bg-white/60 px-6 text-sm font-semibold text-stone-800 transition hover:border-stone-500 hover:bg-white"
            >
              Sell a piece
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-3 text-sm text-stone-600">
            <div className="flex -space-x-2" aria-hidden="true">
              <span className="h-8 w-8 rounded-full border-2 border-[#f0ede5] bg-[#d5a284]" />
              <span className="h-8 w-8 rounded-full border-2 border-[#f0ede5] bg-[#8d9b7a]" />
              <span className="h-8 w-8 rounded-full border-2 border-[#f0ede5] bg-[#d8c6a9]" />
            </div>
            <span><strong className="font-semibold text-stone-900">A community</strong> that loves a good rewear</span>
          </div>
        </div>

        <div className="relative min-h-[300px] overflow-hidden sm:min-h-[400px] lg:min-h-full">
          <img
            src="/images/editorial-hero.jpg"
            alt="A colorful street-style look ready for a second life"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-[center_38%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/45 via-transparent to-transparent lg:bg-gradient-to-r lg:from-stone-950/10 lg:via-transparent lg:to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/40 bg-white/90 p-4 shadow-xl backdrop-blur-md sm:bottom-8 sm:left-8 sm:right-auto sm:max-w-xs sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-800">The good-find feeling</p>
            <p className="mt-2 font-display text-xl leading-snug text-stone-900">
              Your next favorite is already out there.
            </p>
            <Link to={PATHS.search} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-stone-700 hover:text-emerald-800">
              Find it <ArrowDownRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-7 grid gap-3 rounded-2xl border border-stone-200/80 bg-white p-4 sm:grid-cols-3 sm:p-5">
        {BENEFITS.map(({ icon: Icon, title, detail }) => (
          <div key={title} className="flex items-center gap-3 px-2 py-2 sm:justify-center sm:px-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
              <Icon size={19} strokeWidth={1.8} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-stone-900">{title}</span>
              <span className="mt-0.5 block text-xs text-stone-500">{detail}</span>
            </span>
          </div>
        ))}
      </div>

      {topCategories.length > 0 && (
        <Section eyebrow="Find your corner" title="Shop by category">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {topCategories.map((category) => (
              <li key={category._id}>
                <CategoryTile category={category} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section eyebrow="Just added" title="New arrivals" to={`${PATHS.search}?sort=newest`}>
        {fresh.error ? (
          <ErrorBanner message={fresh.error} onRetry={fresh.refetch} />
        ) : (
          <ListingGrid
            listings={fresh.data?.items}
            loading={fresh.loading}
            skeletonCount={8}
            emptyTitle="Nothing here yet"
            emptyHint="New items will appear as sellers list them."
          />
        )}
      </Section>

      <Section eyebrow="Loved by the community" title="Popular right now" to={`${PATHS.search}?sort=popular`}>
        {popular.error ? (
          <ErrorBanner message={popular.error} onRetry={popular.refetch} />
        ) : (
          <ListingGrid listings={popular.data?.items} loading={popular.loading} skeletonCount={4} emptyTitle="Nothing popular yet" />
        )}
      </Section>

      <section className="relative mt-16 overflow-hidden rounded-[2rem] bg-stone-900 px-6 py-10 text-white sm:mt-20 sm:px-10 sm:py-12">
        <div className="relative z-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Ready for a wardrobe refresh?</p>
          <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">Make room for something you&apos;ll love.</h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-stone-300">
            Browse thoughtful finds or list a piece that deserves another outing.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={PATHS.search} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-emerald-100">
              Browse pieces
            </Link>
            <Link to={PATHS.sellNew} className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
              Start selling
            </Link>
          </div>
        </div>
        <Sparkles className="absolute -bottom-8 -right-4 h-48 w-48 text-white/[0.06] sm:right-10 sm:h-64 sm:w-64" strokeWidth={1} aria-hidden="true" />
      </section>
    </div>
  );
}
