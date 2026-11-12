import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteListing, markListingSold } from "../../api/listings";
import { getMyListings, getSellerOrders, getSellerSummary, updateOrderStatus } from "../../api/sellerApi";
import { toRejection } from "../../hooks/errors";
import { emptyList, normalizeList } from "../../utils/listCache";
import { logoutUser } from "../auth/authSlice";

const thunk = (type, fn) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      return await fn(arg);
    } catch (e) {
      return rejectWithValue(toRejection(e));
    }
  });

export const fetchSellerSummary = thunk("seller/summary", () => getSellerSummary());
export const fetchSellerListings = thunk("seller/listings", async (p = {}) => normalizeList(await getMyListings(p), p.limit));
export const fetchSellerOrders = thunk("seller/orders", async (p = {}) => normalizeList(await getSellerOrders(p), p.limit));

export const changeOrderStatus = thunk("seller/orderStatus", async ({ id, status, note }) => {
  await updateOrderStatus(id, status, note);
  return { id, status, note, at: new Date().toISOString() };
});
export const sellerMarkSold = thunk("seller/markSold", async (id) => {
  await markListingSold(id);
  return id;
});
export const sellerDeleteListing = thunk("seller/deleteListing", async (id) => {
  await deleteListing(id);
  return id;
});

const initialState = {
  summary: null, summaryStatus: "idle", summaryError: null,
  listings: emptyList(), listingsStatus: "idle", listingsError: null,
  orders: emptyList(), ordersStatus: "idle", ordersError: null,
};

const slice = createSlice({
  name: "seller",
  initialState,
  extraReducers: (b) => {
    b.addCase(fetchSellerSummary.pending, (s) => { s.summaryStatus = "loading"; s.summaryError = null; })
      .addCase(fetchSellerSummary.fulfilled, (s, { payload }) => { s.summaryStatus = "succeeded"; s.summary = payload; })
      .addCase(fetchSellerSummary.rejected, (s, { payload }) => { s.summaryStatus = "failed"; s.summaryError = payload?.message; })
      .addCase(fetchSellerListings.pending, (s) => { s.listingsStatus = "loading"; s.listingsError = null; })
      .addCase(fetchSellerListings.fulfilled, (s, { payload }) => { s.listingsStatus = "succeeded"; s.listings = payload; })
      .addCase(fetchSellerListings.rejected, (s, { payload }) => { s.listingsStatus = "failed"; s.listingsError = payload?.message; })
      .addCase(fetchSellerOrders.pending, (s) => { s.ordersStatus = "loading"; s.ordersError = null; })
      .addCase(fetchSellerOrders.fulfilled, (s, { payload }) => { s.ordersStatus = "succeeded"; s.orders = payload; })
      .addCase(fetchSellerOrders.rejected, (s, { payload }) => { s.ordersStatus = "failed"; s.ordersError = payload?.message; })
      .addCase(changeOrderStatus.fulfilled, (s, { payload }) => {
        const order = s.orders.items.find((o) => o._id === payload.id);
        if (!order) return;
        order.status = payload.status;
        order.statusHistory = [...(order.statusHistory || []), { status: payload.status, at: payload.at, note: payload.note }];
      })
      .addCase(sellerMarkSold.fulfilled, (s, { payload }) => {
        const l = s.listings.items.find((x) => x._id === payload);
        if (l) l.status = "sold";
      })
      .addCase(sellerDeleteListing.fulfilled, (s, { payload }) => {
        s.listings.items = s.listings.items.filter((x) => x._id !== payload);
        s.listings.total = Math.max(0, s.listings.total - 1);
      })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export default slice.reducer;