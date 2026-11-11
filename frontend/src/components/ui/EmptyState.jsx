export default function EmptyState({ icon: Icon, title, description, action, className = "" }) {
  return (
    <div className={`rounded-xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center ${className}`}>
      {Icon && <Icon size={36} className="mx-auto mb-3 text-stone-400" />}
      <p className="font-medium">{title}</p>
      {description && <p className="mx-auto mt-1 max-w-sm text-sm text-stone-500">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}