import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import uiReducer from "../features/ui/uiSlice";
import filtersReducer, { RECENT_SEARCHES_KEY } from "../features/listings/filtersSlice";
import listingsReducer from "../features/listings/listingsSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";
import ordersReducer from "../features/orders/ordersSlice";
import sellerReducer from "../features/seller/sellerSlice";
import adminReducer from "../features/admin/adminSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  ui: uiReducer,
  filters: filtersReducer,
  listings: listingsReducer,
  notifications: notificationsReducer,
  orders: ordersReducer,
  seller: sellerReducer,
  admin: adminReducer,
  wishlist: wishlistReducer,
});

export const store = configureStore({ reducer: rootReducer });

// Persist recent searches (the only state kept in localStorage; tokens are handled by axiosClient)
let prevRecent = store.getState().filters.recentSearches;
store.subscribe(() => {
  const next = store.getState().filters.recentSearches;
  if (next === prevRecent) return;
  prevRecent = next;
  try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next)); } catch { /* ignore */ }
});