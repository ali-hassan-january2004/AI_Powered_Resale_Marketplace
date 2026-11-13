import { useCallback, useEffect, useState } from "react";

const read = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
};

// const [view, setView, resetView] = useLocalStorage("viewMode", "grid");
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => read(key, initialValue));

  const set = useCallback(
    (next) => {
      const v = typeof next === "function" ? next(value) : next;
      setValue(v);
      try { window.localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage full or blocked */ }
    },
    [key, value]
  );

  const reset = useCallback(() => {
    try { window.localStorage.removeItem(key); } catch { /* ignore */ }
    setValue(initialValue);
  }, [initialValue, key]);

  // Keep other tabs in sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === key) setValue(read(key, initialValue));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [initialValue, key]);

  return [value, set, reset];
}