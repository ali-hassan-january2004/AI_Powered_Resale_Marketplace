import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown } from "lucide-react";
import { PATHS } from "../../app/routePaths";
import { logoutUser } from "../../features/auth/authSlice";

export default function UserMenu() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!user) return null;
  const isSeller = user.role === "seller" || user.role === "admin";

  const items = [
    { to: PATHS.account, label: "My account" },
    { to: PATHS.orders, label: "My orders" },
    { to: PATHS.wishlist, label: "Wishlist" },
    ...(isSeller
      ? [
          { to: PATHS.sellerDashboard, label: "Seller dashboard" },
          { to: PATHS.sellerOrders, label: "Incoming orders" },
        ]
      : []),
    ...(user.role === "admin" ? [{ to: PATHS.admin, label: "Admin panel" }] : []),
  ];

  const handleLogout = async () => {
    setOpen(false);
    await dispatch(logoutUser());
    navigate(PATHS.home);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1.5"
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
            {user.name?.[0]?.toUpperCase() ?? "U"}
          </span>
        )}
        <ChevronDown size={14} />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-stone-200 bg-white py-1 shadow-lg">
          <div className="border-b border-stone-100 px-4 py-2">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-stone-500">{user.email}</p>
          </div>
          {items.map((i) => (
            <Link
              key={i.to}
              to={i.to}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm hover:bg-stone-50"
            >
              {i.label}
            </Link>
          ))}
          <button
            role="menuitem"
            onClick={handleLogout}
            className="block w-full border-t border-stone-100 px-4 py-2 text-left text-sm text-red-600 hover:bg-stone-50"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}