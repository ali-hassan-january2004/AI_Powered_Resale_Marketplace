import { Link, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, Tags, Users } from "lucide-react";
import { PATHS } from "../app/routePaths";
import Sidebar from "../components/layout/Sidebar";
import UserMenu from "../components/layout/UserMenu";

const ITEMS = [
  { to: PATHS.admin, label: "Overview", icon: LayoutDashboard, end: true },
  { to: PATHS.adminUsers, label: "Users", icon: Users },
  { to: PATHS.adminListings, label: "Listings", icon: Package },
  { to: PATHS.adminCategories, label: "Categories & reports", icon: Tags },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="bg-stone-900 text-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span className="font-bold">Resale<span className="text-emerald-400">.</span> Admin</span>
            <Link to={PATHS.home} className="text-sm text-stone-300 hover:text-white">← Back to site</Link>
          </div>
          <UserMenu />
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row">
        <Sidebar title="Admin" items={ITEMS} />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}