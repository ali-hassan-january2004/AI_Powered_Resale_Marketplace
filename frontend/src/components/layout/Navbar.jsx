import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Search, ShoppingBag, Bell, Menu, Heart } from "lucide-react";
import { PATHS } from "../../app/routePaths";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";

function Badge({ count }) {
  return count > 0 ? (
    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-semibold text-white">
      {count > 99 ? "99+" : count}
    </span>
  ) : null;
}

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

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/95 shadow-[0_4px_24px_rgba(28,25,23,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.25rem] max-w-[88rem] items-center gap-3 px-4 sm:gap-5 sm:px-6 lg:px-8">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100 md:hidden"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={22} />
        </button>

        <Link to={PATHS.home} className="shrink-0 text-[1.4rem] font-bold tracking-tight text-stone-900">
          resale<span className="text-emerald-600">.</span>
        </Link>

        <form onSubmit={submit} className="relative hidden w-full max-w-2xl flex-1 md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search one-of-a-kind jackets, brands, sizes…"
            aria-label="Search"
            className="w-full rounded-full border border-stone-200 bg-stone-100/70 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-stone-500 focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
          />
        </form>

        <nav aria-label="Account and shopping" className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4">
          {user && (
            <Link to={PATHS.sellNew} className="hidden rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:block">
              Sell
            </Link>
          )}
          {user && (
            <Link to={PATHS.wishlist} aria-label="Wishlist" className="hidden h-10 w-10 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100 sm:flex">
              <Heart size={20} />
            </Link>
          )}
          {user && (
            <Link to={PATHS.notifications} aria-label="Notifications" className="relative flex h-10 w-10 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100">
              <Bell size={20} />
              <Badge count={unread} />
            </Link>
          )}
          <Link to={PATHS.cart} aria-label="Cart" className="relative flex h-10 w-10 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100">
            <ShoppingBag size={20} />
            <Badge count={cartCount} />
          </Link>

          {user ? (
            <UserMenu />
          ) : (
            <Link to={PATHS.login} className="rounded-full px-3 py-2 text-sm font-semibold text-stone-800 transition hover:bg-stone-100">
              Log in
            </Link>
          )}
        </nav>
      </div>

      <form onSubmit={submit} className="relative border-t border-stone-100 px-4 py-2.5 md:hidden">
        <Search size={16} className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pre-loved pieces…"
          aria-label="Search"
          className="w-full rounded-full border border-stone-200 bg-stone-100/70 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
        />
      </form>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}