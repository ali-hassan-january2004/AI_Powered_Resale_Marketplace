import { useState } from "react";
import AddressForm from "./AddressForm";

// addresses: saved addresses from the profile
// onSelect(address): called when a saved address is chosen or a new one is entered
export default function AddressPicker({ addresses = [], onSelect }) {
  const defaultIdx = Math.max(0, addresses.findIndex((a) => a.isDefault));
  const [selected, setSelected] = useState(addresses.length ? defaultIdx : "new");
  const [initialized, setInitialized] = useState(false);

  // Report the initial selection to the parent once
  if (!initialized && addresses.length) {
    setInitialized(true);
    onSelect?.(addresses[defaultIdx]);
  }

  const choose = (idx) => {
    setSelected(idx);
    if (idx !== "new") onSelect?.(addresses[idx]);
  };

  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-sm font-semibold">Shipping address</legend>

      {addresses.map((a, idx) => (
        <label
          key={a._id || idx}
          className={`flex cursor-pointer gap-3 rounded-xl border p-3 ${
            selected === idx ? "border-emerald-600 bg-emerald-50" : "border-stone-200 bg-white hover:bg-stone-50"
          }`}
        >
          <input type="radio" name="address" checked={selected === idx} onChange={() => choose(idx)} className="mt-1 accent-emerald-600" />
          <span className="text-sm">
            <span className="block font-medium">{a.label || "Address"}{a.isDefault && " (default)"}</span>
            <span className="block text-stone-600">
              {a.line1}, {a.city}, {a.region} {a.postalCode}, {a.country}
            </span>
          </span>
        </label>
      ))}

      <label
        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm font-medium ${
          selected === "new" ? "border-emerald-600 bg-emerald-50" : "border-stone-200 bg-white hover:bg-stone-50"
        }`}
      >
        <input type="radio" name="address" checked={selected === "new"} onChange={() => choose("new")} className="accent-emerald-600" />
        Use a new address
      </label>

      {selected === "new" && (
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <AddressForm submitLabel="Use this address" onSubmit={(values) => onSelect?.(values)} />
        </div>
      )}
    </fieldset>
  );
}