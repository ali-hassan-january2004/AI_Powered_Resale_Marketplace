import axiosClient from "./axiosClient";

// Before Phase 4 the backend returns an empty draft, so the manual form still works.
export const getListingDraft = (images) =>
  axiosClient.post("/ai/listing-draft", { images }, { timeout: 8000 });
export const semanticSearch = (q) => axiosClient.get("/ai/search", { params: { q } });
export const getPriceSuggestion = (attrs) => axiosClient.post("/ai/price-suggestion", attrs);