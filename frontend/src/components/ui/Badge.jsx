const VARIANTS = {
  neutral: "bg-stone-100 text-stone-700",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
};

export default function Badge({ variant = "neutral", className = "", children }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${VARIANTS[variant]} ${className}`}>
      {children}
    </span>
  );
}