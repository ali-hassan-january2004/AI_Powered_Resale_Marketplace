export default function AdminStatCard({ label, value, icon: Icon, hint, tone = "default" }) {
  const tones = {
    default: "bg-stone-100 text-stone-700",
    good: "bg-emerald-100 text-emerald-700",
    warn: "bg-amber-100 text-amber-700",
    bad: "bg-red-100 text-red-700",
  };
  return (
    <div className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-5">
      {Icon && (
        <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${tones[tone]}`}>
          <Icon size={22} />
        </span>
      )}
      <div>
        <p className="text-sm text-stone-500">{label}</p>
        <p className="text-2xl font-bold">{value ?? "–"}</p>
        {hint && <p className="text-xs text-stone-500">{hint}</p>}
      </div>
    </div>
  );
}