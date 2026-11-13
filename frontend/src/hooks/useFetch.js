import { useCallback, useEffect, useRef, useState } from "react";

// const { data, loading, error, refetch, setData } = useFetch(() => api(), [dep1, dep2]);
export default function useFetch(fn, deps = [], { enabled = true } = {}) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const reqId = useRef(0);
  const [state, setState] = useState({ data: null, loading: enabled, error: "" });

  const run = useCallback(async () => {
    const id = ++reqId.current;
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const data = await fnRef.current();
      if (id === reqId.current) setState({ data, loading: false, error: "" });
      return data;
    } catch (e) {
      if (id === reqId.current)
        setState((s) => ({ ...s, loading: false, error: e?.message || "Something went wrong" }));
    }
  }, []);

  useEffect(() => {
    if (enabled) run();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps -- The ref is a request sequence counter, not a rendered DOM ref.
      reqId.current++;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  const setData = useCallback(
    (updater) =>
      setState((s) => ({ ...s, data: typeof updater === "function" ? updater(s.data) : updater })),
    []
  );

  return { ...state, refetch: run, setData };
}