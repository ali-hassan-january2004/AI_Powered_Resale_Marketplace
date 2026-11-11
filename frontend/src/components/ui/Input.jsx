import { forwardRef, useId } from "react";

const Input = forwardRef(function Input({ label, error, hint, id, className = "", ...rest }, ref) {
  const autoId = useId();
  const inputId = id || autoId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className={className}>
      {label && <label htmlFor={inputId} className="mb-1 block text-sm font-medium">{label}</label>}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600/20 disabled:bg-stone-100 ${
          error ? "border-red-500" : "border-stone-300 focus:border-emerald-600"
        }`}
        {...rest}
      />
      {error ? (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1 text-xs text-stone-500">{hint}</p>
      ) : null}
    </div>
  );
});

export default Input;