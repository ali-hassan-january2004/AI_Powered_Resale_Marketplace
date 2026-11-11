import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { X } from "lucide-react";
import { PATHS } from "../../app/routePaths";

export default function MobileMenu({ open, onClose }) {
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const links = [
    { to: PATHS.home, label: "Home" },
    { to: PATHS.search, label: "Browse all" },
    ...(user
      ? [
          { to: PATHS.sellNew, label: "Sell an item" },
          { to: PATHS.orders, label: "My orders" },
          { to: PATHS.wishlist, label: "Wishlist" },
          { to: PATHS.account, label: "Account" },
        ]
      : [
          { to: PATHS.login, label: "Log in" },
          { to: PATHS.register, label: "Create account" },
        ]),
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute left-0 top-0 h-full w-72 bg-white p-5 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xl font-bold">Resale<span className="text-emerald-600">.</span></span>
          <button onClick={onClose} aria-label="Close menu"><X size={22} /></button>
        </div>
        <ul className="space-y-1">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} onClick={onClose} className="block rounded-lg px-3 py-2.5 text-base hover:bg-stone-100">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}