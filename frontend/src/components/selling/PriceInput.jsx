import { forwardRef } from "react";

const CURRENCY = import.meta.env.VITE_CURRENCY || "USD";
const symbol =
  new Intl.NumberFormat(undefined, { style: "currency", currency: CURRENCY })
    .formatToParts(0)
    .find((p) => p.type === "currency")?.value || CURRENCY;

const PriceInput = forwardRef(function PriceInput({ value, onChange, error, id = "price", ...rest }, ref) {
  return (
    <div>
      <div className={`flex items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-emerald-600/20 ${error ? "border-red-500" : "border-stone-300 focus-within:border-emerald-600"}`}>
        <span className="pl-3 text-sm text-stone-500">{symbol}</span>
        <input
          ref={ref}
          id={id}
          type="number"
          inputMode="decimal"
          min="0"
          step="1"
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value === "" ? "" : Number(e.target.value))}
          aria-invalid={!!error}
          className="w-full bg-transparent px-2 py-2 text-sm outline-none"
          {...rest}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});

export default PriceInput;