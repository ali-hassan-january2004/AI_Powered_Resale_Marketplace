import { CONDITIONS } from "../../utils/constants";

export default function ConditionSelect({ value, onChange, error }) {
  return (
    <fieldset>
      <legend className="sr-only">Condition</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {CONDITIONS.map((c) => (
          <label
            key={c.value}
            className={`flex cursor-pointer gap-3 rounded-xl border p-3 ${
              value === c.value ? "border-emerald-600 bg-emerald-50" : "border-stone-200 bg-white hover:bg-stone-50"
            }`}
          >
            <input type="radio" name="condition" value={c.value} checked={value === c.value} onChange={() => onChange(c.value)} className="mt-1 accent-emerald-600" />
            <span>
              <span className="block text-sm font-medium">{c.label}</span>
              <span className="block text-xs text-stone-500">{c.hint}</span>
            </span>
          </label>
        ))}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </fieldset>
  );
}