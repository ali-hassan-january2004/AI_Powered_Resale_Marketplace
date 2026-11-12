import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead as apiMarkRead,
} from "../../api/notifications";
import { toRejection } from "../../hooks/errors";
import { normalizeList } from "../../utils/listCache";
import { logoutUser } from "../auth/authSlice";

export const fetchNotifications = createAsyncThunk("notifications/fetch", async (params = {}, { rejectWithValue }) => {
  try {
    const list = normalizeList(await getNotifications(params), params.limit);
    return { ...list, page: params.page || 1 };
  } catch (e) {
    return rejectWithValue(toRejection(e));
  }
});

export const readNotification = createAsyncThunk("notifications/read", async (id, { getState, rejectWithValue }) => {
  const wasUnread = getState().notifications.items.some((n) => n._id === id && !n.isRead);
  try {
    await apiMarkRead(id);
    return { id, wasUnread };
  } catch (e) {
    return rejectWithValue(toRejection(e));
  }
});

export const readAllNotifications = createAsyncThunk("notifications/readAll", async (_, { rejectWithValue }) => {
  try {
    await markAllNotificationsRead();
  } catch (e) {
    return rejectWithValue(toRejection(e));
  }
});

const initialState = { items: [], total: 0, page: 1, status: "idle", error: null };

const slice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    // For future real-time pushes
    notificationReceived(state, { payload }) {
      state.items.unshift(payload);
      state.total += 1;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchNotifications.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(fetchNotifications.fulfilled, (s, { payload }) => {
        s.status = "succeeded";
        s.total = payload.total;
        s.page = payload.page;
        if (payload.page > 1) {
          const known = new Set(s.items.map((n) => n._id));
          s.items.push(...payload.items.filter((n) => !known.has(n._id)));
        } else {
          s.items = payload.items;
        }
      })
      .addCase(fetchNotifications.rejected, (s, { payload }) => { s.status = "failed"; s.error = payload?.message || "Could not load notifications"; })
      .addCase(readNotification.fulfilled, (s, { payload }) => {
        const n = s.items.find((i) => i._id === payload.id);
        if (n) n.isRead = true;
      })
      .addCase(readAllNotifications.fulfilled, (s) => { s.items.forEach((n) => { n.isRead = true; }); })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const { notificationReceived } = slice.actions;
export const selectNotifications = (s) => s.notifications.items;
export const selectNotificationsStatus = (s) => s.notifications.status;
export default slice.reducer;