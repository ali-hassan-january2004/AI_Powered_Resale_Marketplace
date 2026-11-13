import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PATHS } from "../../app/routePaths";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-stone-200 bg-[#f3f1eb]">
      <div className="mx-auto grid max-w-[88rem] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_0.7fr_0.7fr] lg:px-8 lg:py-16">
        <div className="max-w-md">
          <Link to={PATHS.home} className="text-2xl font-bold tracking-tight text-stone-900">
            resale<span className="text-emerald-700">.</span>
          </Link>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Good clothes deserve a longer story. Discover pre-loved fashion or pass along the pieces you no longer wear.
          </p>
          <Link to={PATHS.search} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950">
            Find your next favorite <ArrowRight size={16} />
          </Link>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Shop</p>
          <ul className="mt-4 space-y-3 text-sm font-medium text-stone-700">
            <li><Link to={PATHS.search} className="transition hover:text-emerald-800">Browse all</Link></li>
            <li><Link to={PATHS.wishlist} className="transition hover:text-emerald-800">Wishlist</Link></li>
            <li><Link to={PATHS.orders} className="transition hover:text-emerald-800">My orders</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Sell</p>
          <ul className="mt-4 space-y-3 text-sm font-medium text-stone-700">
            <li><Link to={PATHS.sellNew} className="transition hover:text-emerald-800">List a piece</Link></li>
            <li><Link to={PATHS.sellerDashboard} className="transition hover:text-emerald-800">Seller dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-200/80">
        <div className="mx-auto flex max-w-[88rem] flex-col gap-2 px-4 py-4 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} Resale Marketplace</span>
          <span>Better finds. Longer lives.</span>
        </div>
      </div>
    </footer>
  );
}