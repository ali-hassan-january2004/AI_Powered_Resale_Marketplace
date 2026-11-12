// Stable cache key for a params object (ignores empty values, order-independent)
export const listKey = (params = {}) =>
  JSON.stringify(
    Object.keys(params)
      .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== "")
      .sort()
      .map((k) => [k, params[k]])
  );

// API lists are { items, page, limit, total } (SRS 8.1). Tolerates a bare array too.
export const normalizeList = (res, fallbackLimit = 20) => {
  const items = Array.isArray(res) ? res : res?.items || [];
  return {
    items,
    total: res?.total ?? items.length,
    page: res?.page ?? 1,
    limit: res?.limit ?? fallbackLimit,
  };
};

export const emptyList = () => ({ items: [], total: 0, page: 1, limit: 20 });