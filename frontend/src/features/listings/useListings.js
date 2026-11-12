import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listKey } from "../../utils/listCache";
import { fetchListingById, fetchListings } from "./listingsSlice";

// Same return shape as useFetch: { data, loading, error, refetch }, plus `refreshing`.
// Results are cached per query, so returning to a page shows the previous results immediately
// while fresh ones load in the background.
export default function useListings(params = {}) {
  const dispatch = useDispatch();
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const key = listKey(params);

  const data = useSelector((s) => s.listings.cache[key] ?? null);
  const status = useSelector((s) => (s.listings.activeKey === key ? s.listings.status : "idle"));
  const error = useSelector((s) => (s.listings.activeKey === key && s.listings.status === "failed" ? s.listings.error : ""));

  const refetch = useCallback(() => dispatch(fetchListings(paramsRef.current)), [dispatch]);

  useEffect(() => {
    dispatch(fetchListings(paramsRef.current));
  }, [dispatch, key]);

  return {
    data,
    loading: !data && status !== "failed",
    refreshing: !!data && status === "loading",
    error,
    refetch,
  };
}

export function useListing(id) {
  const dispatch = useDispatch();
  const data = useSelector((s) => s.listings.byId[id] ?? null);
  const status = useSelector((s) => s.listings.detailStatus);
  const error = useSelector((s) => s.listings.detailError);

  const refetch = useCallback(() => dispatch(fetchListingById(id)), [dispatch, id]);
  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading: !data && status !== "failed", error: !data && status === "failed" ? error : "", refetch };
}