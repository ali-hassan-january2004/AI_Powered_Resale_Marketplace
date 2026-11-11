import { NavLink } from "react-router-dom";

// items: [{ to, label, icon: LucideIcon, end? }]
export default function Sidebar({ title, items = [] }) {
  return (
    <aside className="w-full shrink-0 md:w-56">
      {title && <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-stone-500">{title}</p>}
      <nav className="flex gap-1 overflow-x-auto md:flex-col">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${
                isActive ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-stone-100"
              }`
            }
          >
            {Icon && <Icon size={16} />}
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}