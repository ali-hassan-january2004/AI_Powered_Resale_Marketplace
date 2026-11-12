// buildQueryString({ q: "jacket", page: 2, size: "" }) → "?q=jacket&page=2"
export function buildQueryString(params = {}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    if (Array.isArray(v)) v.forEach((x) => sp.append(k, String(x)));
    else sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export function parseQueryString(qs = "") {
  const out = {};
  for (const [k, v] of new URLSearchParams(qs).entries()) {
    out[k] = k in out ? [].concat(out[k], v) : v;
  }
  return out;
}

// withQuery("/search", { q: "coat" }) → "/search?q=coat"
export const withQuery = (path, params) => `${path}${buildQueryString(params)}`;