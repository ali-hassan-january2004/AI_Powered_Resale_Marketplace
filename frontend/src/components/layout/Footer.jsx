import { Link } from "react-router-dom";
import { PATHS } from "../../app/routePaths";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold">Resale<span className="text-emerald-600">.</span></p>
          <p className="mt-2 max-w-xs text-sm text-stone-600">
            Pre-loved fashion, given a second life. Buy and sell second-hand clothing and accessories.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Shop</p>
          <ul className="mt-2 space-y-1 text-sm text-stone-600">
            <li><Link to={PATHS.search} className="hover:text-stone-900">Browse all</Link></li>
            <li><Link to={PATHS.wishlist} className="hover:text-stone-900">Wishlist</Link></li>
            <li><Link to={PATHS.orders} className="hover:text-stone-900">My orders</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Sell</p>
          <ul className="mt-2 space-y-1 text-sm text-stone-600">
            <li><Link to={PATHS.sellNew} className="hover:text-stone-900">List an item</Link></li>
            <li><Link to={PATHS.sellerDashboard} className="hover:text-stone-900">Seller dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-100 py-4 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} Resale Marketplace. All rights reserved.
      </div>
    </footer>
  );
}