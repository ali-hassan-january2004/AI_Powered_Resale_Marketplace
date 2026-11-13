import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

const STYLES = {
  success: { icon: CheckCircle2, cls: "border-emerald-200 bg-emerald-50 text-emerald-900" },
  error: { icon: AlertCircle, cls: "border-red-200 bg-red-50 text-red-900" },
  info: { icon: Info, cls: "border-stone-200 bg-white text-stone-900" },
};

export default function Toast({ toast: t, onClose }) {
  const { icon: Icon, cls } = STYLES[t.type] || STYLES.info;
  return (
    <div role="status" className={`flex w-full items-start gap-3 rounded-xl border p-3 shadow-lg ${cls}`}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p className="flex-1 text-sm">{t.message}</p>
      <button onClick={() => onClose(t.id)} aria-label="Dismiss"><X size={16} /></button>
    </div>
  );
}