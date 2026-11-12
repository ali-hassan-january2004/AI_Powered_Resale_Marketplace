import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// Generic helper for any page that keeps state in the URL.
// const { params, get, getNumber, set } = useQueryParams();
// set({ tab: "reviews", page: undefined })  // undefined/""/null removes the key
export default function useQueryParams() {
  const [sp, setSp] = useSearchParams();
  const params = useMemo(() => Object.fromEntries(sp.entries()), [sp]);

  const get = useCallback((key, fallback = "") => sp.get(key) ?? fallback, [sp]);

  const getNumber = useCallback(
    (key, fallback) => {
      const raw = sp.get(key);
      if (raw === null || raw === "") return fallback;
      const n = Number(raw);
      return Number.isNaN(n) ? fallback : n;
    },
    [sp]
  );

  const set = useCallback(
    (patch, { replace = false } = {}) => {
      const next = new URLSearchParams(sp);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") next.delete(k);
        else next.set(k, String(v));
      });
      setSp(next, { replace });
    },
    [sp, setSp]
  );

  const reset = useCallback(() => setSp(new URLSearchParams()), [setSp]);

  return { params, get, getNumber, set, reset };
}