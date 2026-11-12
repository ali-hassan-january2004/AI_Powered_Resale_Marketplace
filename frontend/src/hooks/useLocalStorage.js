import { useCallback, useEffect, useRef, useState } from "react";

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
  const initialRef = useRef(initialValue);
  const [value, setValue] = useState(() => read(key, initialRef.current));
  const valueRef = useRef(value);
  valueRef.current = value;

  const set = useCallback(
    (next) => {
      const v = typeof next === "function" ? next(valueRef.current) : next;
      setValue(v);
      try { window.localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage full or blocked */ }
    },
    [key]
  );

  const reset = useCallback(() => {
    try { window.localStorage.removeItem(key); } catch { /* ignore */ }
    setValue(initialRef.current);
  }, [key]);

  // Keep other tabs in sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === key) setValue(read(key, initialRef.current));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  return [value, set, reset];
}