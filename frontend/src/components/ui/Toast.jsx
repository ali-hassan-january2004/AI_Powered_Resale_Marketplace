import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

// --- tiny global store: call toast.success("Saved") from anywhere ---
let toasts = [];
let nextId = 1;
const listeners = new Set();
const emit = () => listeners.forEach((l) => l(toasts));

export const subscribeToasts = (fn) => {
  listeners.add(fn);
  fn(toasts);
  return () => listeners.delete(fn);
};

const dismiss = (id) => {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
};

const show = (message, { type = "info", duration = 4000 } = {}) => {
  const id = nextId++;
  toasts = [...toasts, { id, message, type }];
  emit();
  if (duration > 0) setTimeout(() => dismiss(id), duration);
  return id;
};

export const toast = {
  show,
  dismiss,
  success: (m, o) => show(m, { ...o, type: "success" }),
  error: (m, o) => show(m, { duration: 6000, ...o, type: "error" }),
  info: (m, o) => show(m, { ...o, type: "info" }),
};

// --- single toast view ---
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