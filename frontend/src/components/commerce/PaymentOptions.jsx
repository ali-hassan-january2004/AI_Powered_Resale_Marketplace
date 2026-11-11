import { Banknote, CreditCard } from "lucide-react";

const OPTIONS = [
  { value: "cod", label: "Cash on delivery", hint: "Pay when the item arrives", icon: Banknote },
  { value: "test_card", label: "Test card", hint: "Simulated payment (no real charge)", icon: CreditCard },
];

export default function PaymentOptions({ value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">Payment method</legend>
      <div className="space-y-2">
        {OPTIONS.map(({ value: v, label, hint, icon: Icon }) => (
          <label
            key={v}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${
              value === v ? "border-emerald-600 bg-emerald-50" : "border-stone-200 bg-white hover:bg-stone-50"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={v}
              checked={value === v}
              onChange={() => onChange(v)}
              className="accent-emerald-600"
            />
            <Icon size={20} className="text-stone-600" />
            <span>
              <span className="block text-sm font-medium">{label}</span>
              <span className="block text-xs text-stone-500">{hint}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}