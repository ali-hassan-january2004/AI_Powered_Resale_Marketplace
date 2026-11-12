import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAdminListings, getAdminReports, getAdminStats, getAdminUsers,
  removeAdminListing, resolveReport, toggleBlockUser,
} from "../../api/adminApi";
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

export const fetchAdminStats = thunk("admin/stats", () => getAdminStats());
export const fetchAdminUsers = thunk("admin/users", async (p = {}) => normalizeList(await getAdminUsers(p), p.limit));
export const fetchAdminListings = thunk("admin/listings", async (p = {}) => normalizeList(await getAdminListings(p), p.limit));
export const fetchAdminReports = thunk("admin/reports", async (p = {}) => normalizeList(await getAdminReports(p), p.limit));

export const setUserBlocked = thunk("admin/block", async ({ id, blocked }) => {
  await toggleBlockUser(id, blocked);
  return { id, blocked };
});
export const removeListingAsAdmin = thunk("admin/removeListing", async ({ id, reason }) => {
  await removeAdminListing(id, reason);
  return id;
});
export const resolveAdminReport = thunk("admin/resolveReport", async ({ id, status }) => {
  await resolveReport(id, status);
  return { id, status };
});

const initialState = {
  stats: null, statsStatus: "idle", statsError: null,
  users: emptyList(), usersStatus: "idle", usersError: null,
  listings: emptyList(), listingsStatus: "idle", listingsError: null,
  reports: emptyList(), reportsStatus: "idle", reportsError: null,
};

const slice = createSlice({
  name: "admin",
  initialState,
  extraReducers: (b) => {
    b.addCase(fetchAdminStats.pending, (s) => { s.statsStatus = "loading"; s.statsError = null; })
      .addCase(fetchAdminStats.fulfilled, (s, { payload }) => { s.statsStatus = "succeeded"; s.stats = payload; })
      .addCase(fetchAdminStats.rejected, (s, { payload }) => { s.statsStatus = "failed"; s.statsError = payload?.message; })
      .addCase(fetchAdminUsers.pending, (s) => { s.usersStatus = "loading"; s.usersError = null; })
      .addCase(fetchAdminUsers.fulfilled, (s, { payload }) => { s.usersStatus = "succeeded"; s.users = payload; })
      .addCase(fetchAdminUsers.rejected, (s, { payload }) => { s.usersStatus = "failed"; s.usersError = payload?.message; })
      .addCase(fetchAdminListings.pending, (s) => { s.listingsStatus = "loading"; s.listingsError = null; })
      .addCase(fetchAdminListings.fulfilled, (s, { payload }) => { s.listingsStatus = "succeeded"; s.listings = payload; })
      .addCase(fetchAdminListings.rejected, (s, { payload }) => { s.listingsStatus = "failed"; s.listingsError = payload?.message; })
      .addCase(fetchAdminReports.pending, (s) => { s.reportsStatus = "loading"; s.reportsError = null; })
      .addCase(fetchAdminReports.fulfilled, (s, { payload }) => { s.reportsStatus = "succeeded"; s.reports = payload; })
      .addCase(fetchAdminReports.rejected, (s, { payload }) => { s.reportsStatus = "failed"; s.reportsError = payload?.message; })
      .addCase(setUserBlocked.fulfilled, (s, { payload }) => {
        const u = s.users.items.find((x) => x._id === payload.id);
        if (u) u.isBlocked = payload.blocked;
      })
      .addCase(removeListingAsAdmin.fulfilled, (s, { payload }) => {
        const l = s.listings.items.find((x) => x._id === payload);
        if (l) l.status = "removed";
      })
      .addCase(resolveAdminReport.fulfilled, (s, { payload }) => {
        const r = s.reports.items.find((x) => x._id === payload.id);
        if (r) r.status = payload.status;
      })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export default slice.reducer;