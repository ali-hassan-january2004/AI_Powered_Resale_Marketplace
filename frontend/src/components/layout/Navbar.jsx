import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Search, ShoppingBag, Bell, Menu, Heart } from "lucide-react";
import { PATHS } from "../../app/routePaths";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const cartCount = useSelector((s) => s.cart.items?.length ?? 0);
  const unread = useSelector((s) => s.ui.unreadCount ?? 0);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`${PATHS.search}?q=${encodeURIComponent(q)}`);
  };

  const Badge = ({ count }) =>
    count > 0 ? (
      <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-semibold text-white">
        {count > 99 ? "99+" : count}
      </span>
    ) : null;

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <button
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={22} />
        </button>

        <Link to={PATHS.home} className="text-xl font-bold tracking-tight">
          Resale<span className="text-emerald-600">.</span>
        </Link>

        <form onSubmit={submit} className="relative hidden flex-1 md:block md:max-w-xl">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jackets, brands, sizes…"
            aria-label="Search"
            className="w-full rounded-full border border-stone-300 bg-stone-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
          />
        </form>

        <nav className="ml-auto flex items-center gap-4">
          {user && (
            <Link to={PATHS.sellNew} className="hidden rounded-full bg-stone-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-stone-700 sm:block">
              Sell
            </Link>
          )}
          {user && (
            <Link to={PATHS.wishlist} aria-label="Wishlist" className="hidden sm:block">
              <Heart size={20} />
            </Link>
          )}
          {user && (
            <Link to={PATHS.notifications} aria-label="Notifications" className="relative">
              <Bell size={20} />
              <Badge count={unread} />
            </Link>
          )}
          <Link to={PATHS.cart} aria-label="Cart" className="relative">
            <ShoppingBag size={20} />
            <Badge count={cartCount} />
          </Link>

          {user ? (
            <UserMenu />
          ) : (
            <Link to={PATHS.login} className="text-sm font-medium hover:text-emerald-700">
              Log in
            </Link>
          )}
        </nav>
      </div>

      <form onSubmit={submit} className="border-t border-stone-100 px-4 py-2 md:hidden">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          aria-label="Search"
          className="w-full rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-sm outline-none focus:border-emerald-600"
        />
      </form>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}