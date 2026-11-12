import { createSlice } from "@reduxjs/toolkit";
import { logoutUser } from "../auth/authSlice";
import { fetchNotifications, readAllNotifications, readNotification } from "../notifications/notificationsSlice";

const initialState = { unreadCount: 0, mobileMenuOpen: false };

const slice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setUnreadCount(state, { payload }) { state.unreadCount = Math.max(0, payload || 0); },
    setMobileMenuOpen(state, { payload }) { state.mobileMenuOpen = !!payload; },
    toggleMobileMenu(state) { state.mobileMenuOpen = !state.mobileMenuOpen; },
  },
  // Keeps the navbar badge in sync with the notifications thunks
  extraReducers: (b) => {
    b.addCase(fetchNotifications.fulfilled, (s, { payload }) => {
      if (payload.page === 1) s.unreadCount = payload.items.filter((n) => !n.isRead).length;
    })
      .addCase(readNotification.fulfilled, (s, { payload }) => {
        if (payload.wasUnread) s.unreadCount = Math.max(0, s.unreadCount - 1);
      })
      .addCase(readAllNotifications.fulfilled, (s) => { s.unreadCount = 0; })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const { setUnreadCount, setMobileMenuOpen, toggleMobileMenu } = slice.actions;
export default slice.reducer;