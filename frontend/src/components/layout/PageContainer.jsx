export default function PageContainer({ title, subtitle, actions, narrow = false, children, className = "" }) {
  return (
    <div className={`mx-auto px-4 py-8 ${narrow ? "max-w-3xl" : "max-w-7xl"} ${className}`}>
      {(title || actions) && (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            {title && <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>}
            {subtitle && <p className="mt-1 text-sm text-stone-600">{subtitle}</p>}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}