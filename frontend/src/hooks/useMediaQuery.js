import { useEffect, useState } from "react";

export default function useMediaQuery(query) {
  const get = () => typeof window !== "undefined" && window.matchMedia(query).matches;
  const [matches, setMatches] = useState(get);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

// Breakpoints match Tailwind (SRS 6.1)
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
export const useIsMobile = () => !useMediaQuery("(min-width: 768px)");