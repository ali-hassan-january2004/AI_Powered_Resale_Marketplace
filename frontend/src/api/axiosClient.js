import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const tokenStorage = {
  getAccess: () => localStorage.getItem("accessToken"),
  getRefresh: () => localStorage.getItem("refreshToken"),
  set: ({ accessToken, refreshToken }) => {
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  },
  clear: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

axiosClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let queue = [];
const flushQueue = (error, token) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  queue = [];
};

axiosClient.interceptors.response.use(
  (res) => res.data?.data ?? res.data, // unwrap {success, data}
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (status === 401 && !original._retry && tokenStorage.getRefresh()
        && !original.url.includes("/auth/")) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => queue.push({ resolve, reject }))
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return axiosClient(original);
          });
      }

      isRefreshing = true;
      try {
        const res = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken: tokenStorage.getRefresh(),
        });
        const tokens = res.data?.data;
        tokenStorage.set(tokens);
        flushQueue(null, tokens.accessToken);
        original.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return axiosClient(original);
      } catch (err) {
        flushQueue(err, null);
        tokenStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    const apiError = error.response?.data?.error;
    const normalized = new Error(apiError?.message || error.message || "Something went wrong");
    normalized.code = apiError?.code;
    normalized.status = status;
    return Promise.reject(normalized);
  }
);

export default axiosClient;