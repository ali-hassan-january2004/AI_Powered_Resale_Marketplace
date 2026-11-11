import { ChevronLeft, ChevronRight } from "lucide-react";

function pageList(page, pages) {
  const set = new Set([1, pages, page - 1, page, page + 1]);
  const nums = [...set].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}

export default function Pagination({ page = 1, limit = 20, total = 0, onChange }) {
  const pages = Math.max(1, Math.ceil(total / limit));
  if (pages <= 1) return null;

  const btn = "flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm";

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
      <button onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Previous page"
        className={`${btn} border-stone-300 hover:bg-stone-50 disabled:opacity-40`}>
        <ChevronLeft size={16} />
      </button>
      {pageList(page, pages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-stone-400">…</span>
        ) : (
          <button key={p} onClick={() => onChange(p)} aria-current={p === page ? "page" : undefined}
            className={`${btn} ${p === page ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 hover:bg-stone-50"}`}>
            {p}
          </button>
        )
      )}
      <button onClick={() => onChange(page + 1)} disabled={page >= pages} aria-label="Next page"
        className={`${btn} border-stone-300 hover:bg-stone-50 disabled:opacity-40`}>
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}