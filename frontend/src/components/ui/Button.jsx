import { forwardRef } from "react";
import Spinner from "./Spinner";

const VARIANTS = {
  primary: "bg-stone-900 text-white hover:bg-stone-700 focus-visible:ring-stone-900",
  accent: "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-600",
  secondary: "border border-stone-300 bg-white text-stone-900 hover:bg-stone-50 focus-visible:ring-stone-400",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
  ghost: "text-stone-700 hover:bg-stone-100 focus-visible:ring-stone-400",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

const Button = forwardRef(function Button(
  { variant = "primary", size = "md", loading = false, disabled = false, type = "button", className = "", children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading && <Spinner size={16} />}
      {children}
    </button>
  );
});

export default Button;