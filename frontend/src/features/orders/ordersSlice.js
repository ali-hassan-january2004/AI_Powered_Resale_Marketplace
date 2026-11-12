import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cancelOrder, createOrder, getOrder, getOrders } from "../../api/orders";
import { toRejection } from "../../hooks/errors";
import { emptyList, normalizeList } from "../../utils/listCache";
import { logoutUser } from "../auth/authSlice";

export const fetchOrders = createAsyncThunk("orders/fetchList", async (params = {}, { rejectWithValue }) => {
  try {
    return normalizeList(await getOrders(params), params.limit);
  } catch (e) {
    return rejectWithValue(toRejection(e));
  }
});

export const fetchOrder = createAsyncThunk("orders/fetchOne", async (id, { rejectWithValue }) => {
  try {
    return await getOrder(id);
  } catch (e) {
    return rejectWithValue(toRejection(e));
  }
});

// Rejects with { status: 409 } if an item was sold in the meantime (SRS AT-05)
export const placeOrder = createAsyncThunk("orders/place", async (payload, { rejectWithValue }) => {
  try {
    const res = await createOrder(payload);
    return res?.orders || [res]; // one order per seller
  } catch (e) {
    return rejectWithValue(toRejection(e));
  }
});

export const cancelUserOrder = createAsyncThunk("orders/cancel", async (id, { rejectWithValue }) => {
  try {
    await cancelOrder(id);
    return await getOrder(id);
  } catch (e) {
    return rejectWithValue(toRejection(e));
  }
});

const initialState = {
  list: emptyList(),
  listStatus: "idle",
  listError: null,
  byId: {},
  detailStatus: "idle",
  detailError: null,
  lastPlaced: [], // ids from the most recent checkout
};

const slice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearLastPlaced(state) { state.lastPlaced = []; },
  },
  extraReducers: (b) => {
    b.addCase(fetchOrders.pending, (s) => { s.listStatus = "loading"; s.listError = null; })
      .addCase(fetchOrders.fulfilled, (s, { payload }) => { s.listStatus = "succeeded"; s.list = payload; })
      .addCase(fetchOrders.rejected, (s, { payload }) => { s.listStatus = "failed"; s.listError = payload?.message || "Could not load orders"; })
      .addCase(fetchOrder.pending, (s) => { s.detailStatus = "loading"; s.detailError = null; })
      .addCase(fetchOrder.fulfilled, (s, { payload }) => { s.detailStatus = "succeeded"; s.byId[payload._id] = payload; })
      .addCase(fetchOrder.rejected, (s, { payload }) => { s.detailStatus = "failed"; s.detailError = payload?.message || "Could not load this order"; })
      .addCase(placeOrder.fulfilled, (s, { payload }) => {
        s.lastPlaced = payload.map((o) => o._id);
        payload.forEach((o) => { s.byId[o._id] = o; });
        s.listStatus = "idle"; // the list is stale now
      })
      .addCase(cancelUserOrder.fulfilled, (s, { payload }) => {
        s.byId[payload._id] = payload;
        const row = s.list.items.find((o) => o._id === payload._id);
        if (row) row.status = payload.status;
      })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const { clearLastPlaced } = slice.actions;
export default slice.reducer;