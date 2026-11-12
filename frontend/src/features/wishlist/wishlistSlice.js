import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addToWishlist, getWishlist, removeFromWishlist } from "../../api/wishlist";
import { toRejection } from "../../hooks/errors";
import { logoutUser } from "../auth/authSlice";

const idOf = (l) => (typeof l === "string" ? l : l._id);

export const fetchWishlist = createAsyncThunk("wishlist/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await getWishlist();
    return Array.isArray(res) ? res : res?.items || [];
  } catch (e) {
    return rejectWithValue(toRejection(e));
  }
});

// Optimistic: the heart flips immediately and flips back if the request fails
export const toggleWishlist = createAsyncThunk("wishlist/toggle", async ({ listingId, add }, { rejectWithValue }) => {
  try {
    if (add) await addToWishlist(listingId);
    else await removeFromWishlist(listingId);
    return { listingId, add };
  } catch (e) {
    return rejectWithValue(toRejection(e));
  }
});

const initialState = {
  ids: [],
  items: [],
  touched: {}, // toggles made before the wishlist finished loading: { [id]: boolean }
  loaded: false,
  status: "idle",
  error: null,
};

const apply = (state, listingId, add) => {
  state.touched[listingId] = add;
  if (add) {
    if (!state.ids.includes(listingId)) state.ids.push(listingId);
  } else {
    state.ids = state.ids.filter((i) => i !== listingId);
    state.items = state.items.filter((l) => idOf(l) !== listingId);
  }
};

const slice = createSlice({
  name: "wishlist",
  initialState,
  extraReducers: (b) => {
    b.addCase(fetchWishlist.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(fetchWishlist.fulfilled, (s, { payload }) => {
        s.status = "succeeded";
        s.items = payload;
        s.ids = payload.map(idOf);
        s.touched = {};
        s.loaded = true;
      })
      .addCase(fetchWishlist.rejected, (s, { payload }) => { s.status = "failed"; s.error = payload?.message || "Could not load wishlist"; })
      .addCase(toggleWishlist.pending, (s, { meta }) => apply(s, meta.arg.listingId, meta.arg.add))
      .addCase(toggleWishlist.rejected, (s, { meta }) => apply(s, meta.arg.listingId, !meta.arg.add))
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

// true / false once known, undefined if nothing is known yet (caller falls back to listing.isFavorite)
export const selectWishlistFlag = (listingId) => (s) =>
  s.wishlist.touched[listingId] ?? (s.wishlist.loaded ? s.wishlist.ids.includes(listingId) : undefined);
export const selectWishlistCount = (s) => s.wishlist.ids.length;

export default slice.reducer;