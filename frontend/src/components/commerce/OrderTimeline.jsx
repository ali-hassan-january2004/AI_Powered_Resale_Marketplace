import { Check } from "lucide-react";

const STEPS = ["pending", "confirmed", "shipped", "delivered", "completed"];

// status: current order status; statusHistory: [{ status, at, note }]
export default function OrderTimeline({ status, statusHistory = [] }) {
  const history = Object.fromEntries(statusHistory.map((h) => [h.status, h]));

  if (status === "cancelled") {
    const h = history.cancelled;
    return (
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm">
        <p className="font-semibold">Order cancelled</p>
        {h?.at && <p className="text-stone-500">{new Date(h.at).toLocaleString()}</p>}
        {h?.note && <p className="mt-1">{h.note}</p>}
      </div>
    );
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <ol className="space-y-0">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const h = history[step];
        return (
          <li key={step} className="relative flex gap-3 pb-6 last:pb-0">
            {i < STEPS.length - 1 && (
              <span className={`absolute left-3 top-6 h-full w-0.5 ${i < currentIndex ? "bg-emerald-600" : "bg-stone-200"}`} />
            )}
            <span
              className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                done ? "border-emerald-600 bg-emerald-600 text-white" : "border-stone-300 bg-white"
              }`}
            >
              {done && <Check size={14} />}
            </span>
            <div>
              <p className={`text-sm font-medium capitalize ${done ? "" : "text-stone-400"}`}>{step}</p>
              {h?.at && <p className="text-xs text-stone-500">{new Date(h.at).toLocaleString()}</p>}
              {h?.note && <p className="text-xs text-stone-600">{h.note}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}