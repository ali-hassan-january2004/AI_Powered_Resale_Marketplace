import { Outlet } from "react-router-dom";
import { LayoutDashboard, Package, PlusCircle, Settings, ShoppingBag } from "lucide-react";
import { PATHS } from "../app/routePaths";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

const ITEMS = [
  { to: PATHS.sellerDashboard, label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: PATHS.sellerListings, label: "My listings", icon: Package },
  { to: PATHS.sellerOrders, label: "Orders", icon: ShoppingBag },
  { to: PATHS.sellNew, label: "New listing", icon: PlusCircle },
  { to: PATHS.sellerSettings, label: "Shop settings", icon: Settings },
];

export default function SellerLayout() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <Navbar />
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row">
        <Sidebar title="Seller" items={ITEMS} />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}