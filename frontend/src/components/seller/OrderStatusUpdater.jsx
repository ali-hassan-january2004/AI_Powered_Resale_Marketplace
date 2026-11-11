import { useState } from "react";
import Button from "../ui/Button";

const NEXT = {
  pending: { status: "confirmed", label: "Confirm order" },
  confirmed: { status: "shipped", label: "Mark as shipped", askNote: true },
  shipped: { status: "delivered", label: "Mark as delivered" },
};

// onUpdate(status, note) must return a promise
export default function OrderStatusUpdater({ order, onUpdate }) {
  const next = NEXT[order.status];
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!next) {
    return <p className="text-sm text-stone-500">{order.status === "cancelled" ? "Order cancelled." : "No further action needed."}</p>;
  }

  const run = async () => {
    setLoading(true);
    setError("");
    try {
      await onUpdate(next.status, next.askNote ? note.trim() || undefined : undefined);
      setNote("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {next.askNote && (
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Tracking note (optional)"
          aria-label="Tracking note"
          maxLength={200}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
      )}
      <Button size="sm" loading={loading} onClick={run}>{next.label}</Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}