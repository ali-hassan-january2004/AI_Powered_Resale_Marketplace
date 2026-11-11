export default function StatCard({ label, value, icon: Icon, hint }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">{label}</p>
        {Icon && <Icon size={18} className="text-stone-400" />}
      </div>
      <p className="mt-1 text-2xl font-bold">{value ?? "–"}</p>
      {hint && <p className="text-xs text-stone-500">{hint}</p>}
    </div>
  );
}