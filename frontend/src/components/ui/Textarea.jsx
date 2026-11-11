import { forwardRef, useId } from "react";

const Textarea = forwardRef(function Textarea({ label, error, hint, id, className = "", rows = 4, ...rest }, ref) {
  const autoId = useId();
  const areaId = id || autoId;

  return (
    <div className={className}>
      {label && <label htmlFor={areaId} className="mb-1 block text-sm font-medium">{label}</label>}
      <textarea
        ref={ref}
        id={areaId}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${areaId}-error` : undefined}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600/20 ${
          error ? "border-red-500" : "border-stone-300 focus:border-emerald-600"
        }`}
        {...rest}
      />
      {error ? (
        <p id={`${areaId}-error`} className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-stone-500">{hint}</p>
      ) : null}
    </div>
  );
});

export default Textarea;