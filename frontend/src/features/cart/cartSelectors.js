import { createSelector } from "@reduxjs/toolkit";
import { calcTotals } from "../../utils/pricing";

export const selectCartItems = (s) => s.cart.items;
export const selectCartStatus = (s) => s.cart.status;
export const selectCartError = (s) => s.cart.error;
export const selectCartCount = (s) => s.cart.items.length;
export const selectIsInCart = (listingId) => (s) => s.cart.items.some((i) => i._id === listingId);

export const selectAvailableCartItems = createSelector([selectCartItems], (items) =>
  items.filter((i) => !i.status || i.status === "active")
);
export const selectHasUnavailableItems = createSelector(
  [selectCartItems, selectAvailableCartItems],
  (all, available) => all.length !== available.length
);

// Estimate for display only; the backend computes the real totals at checkout
export const selectCartTotals = createSelector([selectAvailableCartItems], (items) => calcTotals(items));