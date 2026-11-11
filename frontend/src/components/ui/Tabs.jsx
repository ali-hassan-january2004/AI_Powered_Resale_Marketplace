// tabs: [{ id, label, count? }]  — render the matching panel yourself based on `value`.
export default function Tabs({ tabs = [], value, onChange, className = "" }) {
  const onKeyDown = (e, i) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    onChange(tabs[next].id);
    e.currentTarget.parentElement.children[next]?.focus();
  };

  return (
    <div role="tablist" className={`flex gap-1 overflow-x-auto border-b border-stone-200 ${className}`}>
      {tabs.map((t, i) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium ${
              active ? "border-emerald-600 text-emerald-700" : "border-transparent text-stone-600 hover:text-stone-900"
            }`}
          >
            {t.label}
            {t.count != null && <span className="ml-1.5 rounded-full bg-stone-100 px-1.5 text-xs text-stone-600">{t.count}</span>}
          </button>
        );
      })}
    </div>
  );
}