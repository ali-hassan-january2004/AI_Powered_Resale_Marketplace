// Size it with Tailwind classes: <Skeleton className="h-4 w-1/2" />
export default function Skeleton({ className = "", rounded = "rounded" }) {
  return <div aria-hidden="true" className={`animate-pulse bg-stone-200 ${rounded} ${className}`} />;
}