import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

// items: [{ label, to? }] — last item is the current page (no link)
export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-stone-500">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {item.to && !last ? (
                <Link to={item.to} className="hover:text-stone-900">{item.label}</Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "text-stone-900" : ""}>
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight size={14} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}