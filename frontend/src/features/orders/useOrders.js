import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listKey } from "../../utils/listCache";
import { fetchOrder, fetchOrders } from "./ordersSlice";

// Same return shape as useFetch: { data, loading, error, refetch }
// const { data } = useOrders({ status, page, limit });   data = { items, total, page, limit }
export function useOrders(params = {}) {
  const dispatch = useDispatch();
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const key = listKey(params);

  const list = useSelector((s) => s.orders.list);
  const status = useSelector((s) => s.orders.listStatus);
  const error = useSelector((s) => s.orders.listError);

  const refetch = useCallback(() => dispatch(fetchOrders(paramsRef.current)), [dispatch]);
  useEffect(() => { refetch(); }, [refetch, key]);

  return {
    data: list,
    loading: status === "idle" || status === "loading",
    error: status === "failed" ? error : "",
    refetch,
  };
}

export function useOrder(id) {
  const dispatch = useDispatch();
  const data = useSelector((s) => s.orders.byId[id] ?? null);
  const status = useSelector((s) => s.orders.detailStatus);
  const error = useSelector((s) => s.orders.detailError);

  const refetch = useCallback(() => dispatch(fetchOrder(id)), [dispatch, id]);
  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading: !data && status !== "failed", error: !data && status === "failed" ? error : "", refetch };
}

export default useOrders;