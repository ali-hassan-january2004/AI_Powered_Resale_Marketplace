import { createSlice } from "@reduxjs/toolkit";

// Filters, sort and page live in the URL (useListingFilters), so shareable links work.
// This slice only holds things the URL should not: recent searches (persisted by store.js).
export const RECENT_SEARCHES_KEY = "recentSearches";
const MAX = 8;

const load = () => {
  try {
    const v = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY));
    return Array.isArray(v) ? v.slice(0, MAX) : [];
  } catch {
    return [];
  }
};

const slice = createSlice({
  name: "filters",
  initialState: { recentSearches: load() },
  reducers: {
    addRecentSearch(state, { payload }) {
      const q = payload?.trim();
      if (!q) return;
      state.recentSearches = [q, ...state.recentSearches.filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, MAX);
    },
    removeRecentSearch(state, { payload }) {
      state.recentSearches = state.recentSearches.filter((x) => x !== payload);
    },
    clearRecentSearches(state) {
      state.recentSearches = [];
    },
  },
});

export const { addRecentSearch, removeRecentSearch, clearRecentSearches } = slice.actions;
export const selectRecentSearches = (s) => s.filters.recentSearches;
export default slice.reducer;