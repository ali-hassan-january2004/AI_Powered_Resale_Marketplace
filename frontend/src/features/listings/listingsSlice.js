import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getListing, getListings } from "../../api/listings";
import { toRejection } from "../../hooks/errors";
import { listKey, normalizeList } from "../../utils/listCache";

const MAX_CACHED_QUERIES = 30;

export const fetchListings = createAsyncThunk("listings/fetchList", async (params = {}, { rejectWithValue }) => {
  try {
    return { key: listKey(params), data: normalizeList(await getListings(params), params.limit) };
  } catch (e) {
    return rejectWithValue(toRejection(e));
  }
});

export const fetchListingById = createAsyncThunk("listings/fetchOne", async (id, { rejectWithValue }) => {
  try {
    return await getListing(id);
  } catch (e) {
    return rejectWithValue(toRejection(e));
  }
});

const initialState = {
  cache: {},      // { [listKey]: { items, total, page, limit } }, so going back shows results instantly
  keys: [],       // insertion order, for trimming the cache
  activeKey: null,
  status: "idle", // idle | loading | succeeded | failed (for activeKey)
  error: null,
  byId: {},       // listing detail cache
  detailStatus: "idle",
  detailError: null,
};

const slice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    // Call after creating, editing or deleting a listing
    invalidateListings(state) {
      state.cache = {};
      state.keys = [];
      state.byId = {};
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchListings.pending, (s, { meta }) => {
      s.activeKey = listKey(meta.arg);
      s.status = "loading";
      s.error = null;
    })
      .addCase(fetchListings.fulfilled, (s, { payload }) => {
        const { key, data } = payload;
        if (!s.cache[key]) s.keys.push(key);
        s.cache[key] = data;
        while (s.keys.length > MAX_CACHED_QUERIES) delete s.cache[s.keys.shift()];
        if (s.activeKey === key) s.status = "succeeded";
      })
      .addCase(fetchListings.rejected, (s, { meta, payload }) => {
        if (s.activeKey !== listKey(meta.arg)) return; // a newer request replaced this one
        s.status = "failed";
        s.error = payload?.message || "Could not load listings";
      })
      .addCase(fetchListingById.pending, (s) => { s.detailStatus = "loading"; s.detailError = null; })
      .addCase(fetchListingById.fulfilled, (s, { payload }) => {
        s.detailStatus = "succeeded";
        s.byId[payload._id] = payload;
      })
      .addCase(fetchListingById.rejected, (s, { payload }) => {
        s.detailStatus = "failed";
        s.detailError = payload?.message || "Could not load this listing";
      });
  },
});

export const { invalidateListings } = slice.actions;
export default slice.reducer;