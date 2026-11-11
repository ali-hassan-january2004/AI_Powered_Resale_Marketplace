import { useEffect, useState } from "react";
import { COLORS, CONDITIONS, SIZES } from "../../utils/constants";

// filters: { category, minPrice, maxPrice, size, condition, brand, color } (undefined = not set)
// onChange(nextFilters) — the parent should put these in the URL (SRS BRW-04) and drop undefined values.
// categories: tree or flat list; category filter uses the category slug.
const flatten = (list = []) => list.flatMap((c) => [c, ...flatten(c.children || [])]);

function Section({ title, children }) {
  return (
    <fieldset className="border-b border-stone-200 py-4 first:pt-0 last:border-0">
      <legend className="mb-2 text-sm font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}

export default function FilterSidebar({ filters = {}, onChange, categories = [] }) {
  const [price, setPrice] = useState({ min: filters.minPrice ?? "", max: filters.maxPrice ?? "" });
  const [brand, setBrand] = useState(filters.brand ?? "");

  useEffect(() => {
    setPrice({ min: filters.minPrice ?? "", max: filters.maxPrice ?? "" });
    setBrand(filters.brand ?? "");
  }, [filters.minPrice, filters.maxPrice, filters.brand]);

  const set = (patch) => onChange({ ...filters, ...patch });
  const toggle = (key, value) => set({ [key]: filters[key] === value ? undefined : value });
  const hasFilters = Object.values(filters).some(Boolean);

  const inputCls = "w-full rounded-lg border border-stone-300 px-3 py-1.5 text-sm outline-none focus:border-emerald-600";

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        {hasFilters && (
          <button onClick={() => onChange({})} className="text-sm text-emerald-700 hover:underline">
            Clear all
          </button>
        )}
      </div>

      {categories.length > 0 && (
        <Section title="Category">
          <select
            value={filters.category || ""}
            onChange={(e) => set({ category: e.target.value || undefined })}
            className={inputCls}
          >
            <option value="">All categories</option>
            {flatten(categories).map((c) => (
              <option key={c._id} value={c.slug}>{c.parent ? "— " : ""}{c.name}</option>
            ))}
          </select>
        </Section>
      )}

      <Section title="Price">
        <div className="flex items-center gap-2">
          <input type="number" min="0" placeholder="Min" aria-label="Minimum price" value={price.min}
            onChange={(e) => setPrice((p) => ({ ...p, min: e.target.value }))} className={inputCls} />
          <span className="text-stone-400">–</span>
          <input type="number" min="0" placeholder="Max" aria-label="Maximum price" value={price.max}
            onChange={(e) => setPrice((p) => ({ ...p, max: e.target.value }))} className={inputCls} />
        </div>
        <button
          onClick={() => set({ minPrice: price.min || undefined, maxPrice: price.max || undefined })}
          className="mt-2 w-full rounded-lg border border-stone-300 py-1.5 text-sm hover:bg-stone-50"
        >
          Apply price
        </button>
      </Section>

      <Section title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button key={s} onClick={() => toggle("size", s)} aria-pressed={filters.size === s}
              className={`rounded-full border px-3 py-1 text-xs ${filters.size === s ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 hover:bg-stone-100"}`}>
              {s}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Condition">
        <div className="space-y-1.5">
          {CONDITIONS.map((c) => (
            <label key={c.value} className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="radio" name="condition" checked={filters.condition === c.value}
                onChange={() => set({ condition: c.value })} className="accent-emerald-600" />
              {c.label}
            </label>
          ))}
          {filters.condition && (
            <button onClick={() => set({ condition: undefined })} className="text-xs text-emerald-700 hover:underline">
              Any condition
            </button>
          )}
        </div>
      </Section>

      <Section title="Color">
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button key={c.name} onClick={() => toggle("color", c.name)} aria-label={c.name} aria-pressed={filters.color === c.name}
              title={c.name} style={{ backgroundColor: c.hex }}
              className={`h-7 w-7 rounded-full border ${filters.color === c.name ? "ring-2 ring-emerald-600 ring-offset-2" : "border-stone-300"}`} />
          ))}
        </div>
      </Section>

      <Section title="Brand">
        <input
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          onBlur={() => set({ brand: brand.trim() || undefined })}
          onKeyDown={(e) => e.key === "Enter" && set({ brand: brand.trim() || undefined })}
          placeholder="e.g. Zara"
          className={inputCls}
        />
      </Section>
    </div>
  );
}