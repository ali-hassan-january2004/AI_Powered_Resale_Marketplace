import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { getListings } from "../../api/listings";
import { getCategories } from "../../api/categories";
import useFetch from "../../hooks/useFetch";
import useListingFilters from "../../hooks/useListingFilters";
import FilterSidebar from "./FilterSidebar";
import FilterDrawer from "./FilterDrawer";
import SortSelect from "./SortSelect";
import SearchBar from "./SearchBar";
import ListingGrid from "./ListingGrid";
import Pagination from "../ui/Pagination";
import ErrorBanner from "../ui/ErrorBanner";
import Button from "../ui/Button";

const LIMIT = 20;

// fixedParams: e.g. { category: "jackets" } for category pages (hides the category filter)
export default function ListingBrowser({ fixedParams = {}, showSearch = true, emptyTitle }) {
  const { filters, q, sort, page, setFilters, setQ, setSort, setPage } = useListingFilters();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const params = { ...filters, ...fixedParams, q: q || undefined, sort, page, limit: LIMIT };
  const { data, loading, error, refetch } = useFetch(() => getListings(params), [JSON.stringify(params)]);
  const { data: categories } = useFetch(() => getCategories(), []);

  const sidebarCategories = fixedParams.category ? [] : categories || [];
  const items = data?.items || [];
  const total = data?.total ?? 0;

  const sidebar = (
    <FilterSidebar filters={filters} onChange={setFilters} categories={sidebarCategories} />
  );

  return (
    <div>
      {showSearch && (
        <div className="mb-4">
          <SearchBar defaultValue={q} onSearch={setQ} />
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-stone-600" aria-live="polite">
          {loading ? "Loading…" : `${total} item${total === 1 ? "" : "s"}`}
        </p>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" className="lg:hidden" onClick={() => setDrawerOpen(true)}>
            <SlidersHorizontal size={16} /> Filters
          </Button>
          <SortSelect value={sort} onChange={setSort} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">{sidebar}</aside>
        <div>
          {error ? (
            <ErrorBanner message={error} onRetry={refetch} />
          ) : (
            <>
              <ListingGrid listings={items} loading={loading} emptyTitle={emptyTitle} />
              <Pagination page={page} limit={LIMIT} total={total} onChange={setPage} />
            </>
          )}
        </div>
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onApply={setFilters}
        categories={sidebarCategories}
      />
    </div>
  );
}