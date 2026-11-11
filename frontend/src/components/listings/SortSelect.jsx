import { SORT_OPTIONS } from "../../utils/constants";

export default function SortSelect({ value = "newest", onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-stone-600">Sort by</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}