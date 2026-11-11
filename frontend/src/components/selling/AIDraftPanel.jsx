import { useState } from "react";
import { Sparkles } from "lucide-react";
import Button from "../ui/Button";

// onRequestDraft(): async function that returns the draft from POST /ai/listing-draft.
// onApply(values): receives the fields to put into the form.
// Before Phase 4 the backend returns an empty draft, so the manual form keeps working.
export default function AIDraftPanel({ onRequestDraft, onApply, disabled = false }) {
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(null);
  const [message, setMessage] = useState("");

  const toValues = (d) => {
    const v = {};
    if (d.title) v.title = d.title;
    if (d.description) v.description = d.description;
    if (d.condition?.label) v.condition = d.condition.label;
    if (d.priceSuggestion?.value) v.price = d.priceSuggestion.value;
    if (d.color?.[0]?.label) v.color = d.color[0].label;
    if (d.brand?.[0]?.label) v.brand = d.brand[0].label;
    if (d.category?.[0]?.label) v.categoryLabel = d.category[0].label;
    return v;
  };

  const request = async () => {
    setLoading(true);
    setMessage("");
    try {
      const d = await onRequestDraft();
      const values = d ? toValues(d) : {};
      if (Object.keys(values).length === 0) {
        setDraft(null);
        setMessage("No suggestions available right now. Please fill in the details below.");
      } else {
        setDraft({ raw: d, values });
      }
    } catch {
      setMessage("AI suggestions are unavailable right now. You can fill in the form manually.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-emerald-700" />
          <div>
            <p className="text-sm font-semibold">Smart listing</p>
            <p className="text-xs text-stone-600">Let AI suggest details from your photos. You can edit everything.</p>
          </div>
        </div>
        <Button size="sm" loading={loading} disabled={disabled} onClick={request}>Suggest details</Button>
      </div>

      {message && <p className="mt-3 text-sm text-stone-700">{message}</p>}

      {draft && (
        <div className="mt-3 space-y-2 rounded-lg bg-white p-3 text-sm">
          <p className="text-xs font-semibold uppercase text-emerald-700">AI suggested</p>
          {draft.values.title && <p><span className="text-stone-500">Title:</span> {draft.values.title}</p>}
          {draft.values.categoryLabel && <p><span className="text-stone-500">Category:</span> {draft.values.categoryLabel}</p>}
          {draft.values.color && <p><span className="text-stone-500">Color:</span> {draft.values.color}</p>}
          {draft.values.brand && <p><span className="text-stone-500">Brand:</span> {draft.values.brand}</p>}
          {draft.values.condition && (
            <p>
              <span className="text-stone-500">Condition:</span> {draft.values.condition}
              {draft.raw.condition?.score != null && ` (${Math.round(draft.raw.condition.score * 100)}% confident)`}
            </p>
          )}
          {draft.values.price && <p><span className="text-stone-500">Suggested price:</span> {draft.values.price}</p>}
          <Button size="sm" onClick={() => { onApply(draft.values); setDraft(null); }}>Apply to form</Button>
        </div>
      )}
    </section>
  );
}