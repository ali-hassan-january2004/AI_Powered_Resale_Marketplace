import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatPrice } from "../../utils/formatPrice";

// data: [{ label: "Nov 3", total: 12000 }, ...]
export default function SalesChart({ data = [] }) {
  if (!data.length) {
    return <p className="py-10 text-center text-sm text-stone-500">No sales yet. Your chart will appear after your first sale.</p>;
  }
  return (
    <div className="h-64 w-full" role="img" aria-label="Sales over time">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} width={48} />
          <Tooltip formatter={(v) => formatPrice(v)} />
          <Bar dataKey="total" fill="#059669" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}