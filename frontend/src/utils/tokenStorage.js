const ACCESS = "accessToken";
const REFRESH = "refreshToken";

// Falls back to memory if localStorage is blocked (private mode, strict browser settings)
const memory = {};
const store = {
  get(k) {
    try { return window.localStorage.getItem(k); } catch { return memory[k] ?? null; }
  },
  set(k, v) {
    try { window.localStorage.setItem(k, v); } catch { memory[k] = v; }
  },
  remove(k) {
    try { window.localStorage.removeItem(k); } catch { /* ignore */ }
    delete memory[k];
  },
};

export const tokenStorage = {
  getAccess: () => store.get(ACCESS),
  getRefresh: () => store.get(REFRESH),
  set: ({ accessToken, refreshToken } = {}) => {
    if (accessToken) store.set(ACCESS, accessToken);
    if (refreshToken) store.set(REFRESH, refreshToken);
  },
  clear: () => {
    store.remove(ACCESS);
    store.remove(REFRESH);
  },
};

export default tokenStorage;