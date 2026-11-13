import { useEffect, useState } from "react";
import { X } from "lucide-react";
import FilterSidebar from "./FilterSidebar";

// Mobile version of the filters. Changes are applied when "Show results" is tapped.
export default function FilterDrawer({ open, onClose, filters, onApply, categories }) {
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Keep the editable draft in sync when applied filters change.
    if (open) setDraft(filters);
  }, [open, filters]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute bottom-0 flex max-h-[90vh] w-full flex-col rounded-t-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
          <span className="font-semibold">Filters</span>
          <button onClick={onClose} aria-label="Close filters"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <FilterSidebar filters={draft} onChange={setDraft} categories={categories} />
        </div>
        <div className="border-t border-stone-200 p-4">
          <button
            onClick={() => { onApply(draft); onClose(); }}
            className="w-full rounded-lg bg-stone-900 py-2.5 text-sm font-medium text-white hover:bg-stone-700"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}