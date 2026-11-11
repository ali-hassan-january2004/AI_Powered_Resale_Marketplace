import { forwardRef, useId } from "react";

// Pass either `options=[{ value, label }]` or <option> children.
const Select = forwardRef(function Select(
  { label, error, hint, options, placeholder, id, className = "", children, ...rest },
  ref
) {
  const autoId = useId();
  const selectId = id || autoId;

  return (
    <div className={className}>
      {label && <label htmlFor={selectId} className="mb-1 block text-sm font-medium">{label}</label>}
      <select
        ref={ref}
        id={selectId}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600/20 ${
          error ? "border-red-500" : "border-stone-300 focus:border-emerald-600"
        }`}
        {...rest}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options
          ? options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)
          : children}
      </select>
      {error ? (
        <p id={`${selectId}-error`} className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-stone-500">{hint}</p>
      ) : null}
    </div>
  );
});

export default Select;