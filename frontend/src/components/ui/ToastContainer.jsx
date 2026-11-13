import { useEffect, useState } from "react";
import Toast from "./Toast";
import { subscribeToasts, toast } from "./toastStore";

export default function ToastContainer() {
  const [items, setItems] = useState([]);

  useEffect(() => subscribeToasts(setItems), []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 sm:items-end">
      {items.map((t) => (
        <div key={t.id} className="pointer-events-auto w-full max-w-sm">
          <Toast toast={t} onClose={toast.dismiss} />
        </div>
      ))}
    </div>
  );
}