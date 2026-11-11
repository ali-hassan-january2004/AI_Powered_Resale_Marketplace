import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ defaultValue = "", onSearch, placeholder = "Search by title, brand or description…" }) {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => setValue(defaultValue), [defaultValue]);

  const submit = (e) => {
    e.preventDefault();
    onSearch(value.trim());
  };
  const clear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <form onSubmit={submit} role="search" className="relative">
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search listings"
        className="w-full rounded-full border border-stone-300 bg-white py-2.5 pl-10 pr-10 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
      />
      {value && (
        <button type="button" onClick={clear} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700">
          <X size={16} />
        </button>
      )}
    </form>
  );
}