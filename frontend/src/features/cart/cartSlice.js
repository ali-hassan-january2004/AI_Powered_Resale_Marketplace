import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addToCart, getCart, removeFromCart } from "../../api/cart";
import { toRejection } from "../../hooks/errors";
import { logoutUser } from "../auth/authSlice";

// The UI (CartItem) wants flat listing objects. The backend should populate cart items;
// this handles [{ listing: {...}, addedAt }] and [{...listing}].
export const normalizeCart = (res) => {
  const list = Array.isArray(res) ? res : res?.items || [];
  return list.map((entry) => {
    const listing = entry.listing && typeof entry.listing === "object" ? entry.listing : entry;
    return entry.addedAt ? { ...listing, addedAt: entry.addedAt } : listing;
  });
};

export const fetchCart = createAsyncThunk("cart/fetch", async (_, { rejectWithValue }) => {
  try {
    return normalizeCart(await getCart());
  } catch (e) {
    return rejectWithValue(toRejection(e));
  }
});

// Adds, then re-reads the cart so the store always matches the server
export const addCartItem = createAsyncThunk("cart/add", async (listingId, { rejectWithValue }) => {
  try {
    await addToCart(listingId);
    return normalizeCart(await getCart());
  } catch (e) {
    return rejectWithValue(toRejection(e));
  }
});

export const removeCartItem = createAsyncThunk("cart/remove", async (listingId, { rejectWithValue }) => {
  try {
    await removeFromCart(listingId);
    return listingId;
  } catch (e) {
    return rejectWithValue(toRejection(e));
  }
});

const initialState = { items: [], status: "idle", error: null }; // status: idle | loading | succeeded | failed

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Called after a successful checkout
    clearCart(state) {
      state.items = [];
      state.status = "succeeded";
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchCart.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(fetchCart.fulfilled, (s, { payload }) => { s.status = "succeeded"; s.items = payload; })
      .addCase(fetchCart.rejected, (s, { payload }) => { s.status = "failed"; s.error = payload?.message || "Could not load your cart"; })
      .addCase(addCartItem.fulfilled, (s, { payload }) => { s.items = payload; s.status = "succeeded"; })
      .addCase(removeCartItem.fulfilled, (s, { payload }) => { s.items = s.items.filter((i) => i._id !== payload); })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const { clearCart } = slice.actions;
export default slice.reducer;