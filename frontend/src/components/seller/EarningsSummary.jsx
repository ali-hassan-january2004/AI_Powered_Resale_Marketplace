import { Banknote, Percent, Wallet } from "lucide-react";
import { formatPrice } from "../../utils/formatPrice";
import StatCard from "./StatCard";

// summary: { totalSales, platformFee, netEarnings } (shape assumed for GET /seller/summary)
export default function EarningsSummary({ summary }) {
  const { totalSales = 0, platformFee = 0, netEarnings = totalSales - platformFee } = summary || {};
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="Total sales" value={formatPrice(totalSales)} icon={Banknote} />
      <StatCard label="Platform commission" value={formatPrice(platformFee)} icon={Percent} />
      <StatCard label="Net earnings" value={formatPrice(netEarnings)} icon={Wallet} hint="After commission" />
    </div>
  );
}