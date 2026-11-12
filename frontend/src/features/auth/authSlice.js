import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authApi from "../../api/auth";
import { getMe } from "../../api/users";
import { tokenStorage } from "../../api/axiosClient";
import { toRejection } from "../../hooks/errors";

// Expected backend shape (SRS AUTH-02): login → { accessToken, refreshToken, user }
export const loginUser = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const res = await authApi.login(credentials);
    tokenStorage.set(res);
    return res.user;
  } catch (e) {
    return rejectWithValue(toRejection(e));
  }
});

export const registerUser = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const res = await authApi.register(payload);
    if (res?.accessToken) {
      tokenStorage.set(res);
      return res.user;
    }
    // Backend returned only the new user: sign in right away
    const session = await authApi.login({ email: payload.email, password: payload.password });
    tokenStorage.set(session);
    return session.user;
  } catch (e) {
    return rejectWithValue(toRejection(e));
  }
});

// Runs once on app start: restores the session from the stored token
export const initAuth = createAsyncThunk("auth/init", async (_, { rejectWithValue }) => {
  if (!tokenStorage.getAccess()) return null;
  try {
    const res = await getMe();
    return res?.user ?? res;
  } catch (e) {
    tokenStorage.clear();
    return rejectWithValue(toRejection(e));
  }
});

// Never rejects: the user is logged out locally even if the server call fails
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  const refreshToken = tokenStorage.getRefresh();
  try {
    if (refreshToken) await authApi.logout(refreshToken);
  } catch {
    /* token may already be expired */
  }
  tokenStorage.clear();
});

const initialState = {
  user: null,
  status: "idle", // idle | loading | succeeded | failed
  // With no stored token there is nothing to restore, so routes can render immediately
  initialized: !tokenStorage.getAccess(),
  error: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Accepts a user or { user }
    setUser(state, { payload }) {
      state.user = payload?.user ?? payload;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (b) => {
    const pending = (s) => { s.status = "loading"; s.error = null; };
    const authed = (s, { payload }) => { s.status = "succeeded"; s.user = payload; s.initialized = true; };
    const failed = (s, { payload, error }) => {
      s.status = "failed";
      s.error = payload?.message || error?.message || "Something went wrong";
    };

    b.addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, authed)
      .addCase(loginUser.rejected, failed)
      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, authed)
      .addCase(registerUser.rejected, failed)
      .addCase(initAuth.pending, pending)
      .addCase(initAuth.fulfilled, authed)
      .addCase(initAuth.rejected, (s) => { s.status = "idle"; s.user = null; s.initialized = true; })
      .addCase(logoutUser.fulfilled, (s) => {
        s.user = null; s.status = "idle"; s.error = null; s.initialized = true;
      });
  },
});

export const { setUser, clearAuthError } = slice.actions;
export default slice.reducer;