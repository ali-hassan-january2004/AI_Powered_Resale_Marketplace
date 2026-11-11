import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const FILTER_KEYS = ["category", "minPrice", "maxPrice", "size", "condition", "brand", "color"];

// Keeps q, sort, page and all filters in the URL (SRS BRW-04).
export default function useListingFilters() {
  const [sp, setSp] = useSearchParams();

  const filters = useMemo(() => {
    const f = {};
    FILTER_KEYS.forEach((k) => {
      const v = sp.get(k);
      if (v) f[k] = v;
    });
    return f;
  }, [sp]);

  const q = sp.get("q") || "";
  const sort = sp.get("sort") || "newest";
  const page = Number(sp.get("page")) || 1;

  const update = (patch) => {
    const next = new URLSearchParams(sp);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") next.delete(k);
      else next.set(k, String(v));
    });
    if (!("page" in patch)) next.delete("page"); // any change resets to page 1
    setSp(next);
  };

  return {
    filters,
    q,
    sort,
    page,
    setFilters: (f) => update(Object.fromEntries(FILTER_KEYS.map((k) => [k, f[k]]))),
    setQ: (value) => update({ q: value }),
    setSort: (value) => update({ sort: value }),
    setPage: (value) => update({ page: value > 1 ? value : undefined }),
  };
}