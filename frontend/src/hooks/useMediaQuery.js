import { useCallback, useSyncExternalStore } from "react";

export default function useMediaQuery(query) {
  const subscribe = useCallback((onChange) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

// Breakpoints match Tailwind (SRS 6.1)
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
export const useIsMobile = () => !useMediaQuery("(min-width: 768px)");