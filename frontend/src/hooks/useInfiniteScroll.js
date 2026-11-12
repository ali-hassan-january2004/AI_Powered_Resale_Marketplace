import { useCallback, useEffect, useRef } from "react";

// const sentinelRef = useInfiniteScroll({ onLoadMore, hasMore, loading });
// ...render items, then <div ref={sentinelRef} /> after the list
export default function useInfiniteScroll({ onLoadMore, hasMore = true, loading = false, rootMargin = "300px" }) {
  const callbackRef = useRef(onLoadMore);
  callbackRef.current = onLoadMore;
  const observerRef = useRef(null);

  // Callback ref: re-attaches whenever hasMore/loading change, so if the sentinel is still
  // visible after a page loads, the next page is requested automatically.
  const sentinelRef = useCallback(
    (node) => {
      observerRef.current?.disconnect();
      if (!node || !hasMore || loading) return;
      observerRef.current = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && callbackRef.current?.(),
        { rootMargin }
      );
      observerRef.current.observe(node);
    },
    [hasMore, loading, rootMargin]
  );

  useEffect(() => () => observerRef.current?.disconnect(), []);
  return sentinelRef;
}