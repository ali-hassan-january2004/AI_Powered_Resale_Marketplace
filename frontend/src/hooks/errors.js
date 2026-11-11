// Thunks may reject with a string or an Error; this handles both.
export const errMsg = (e, fallback = "Something went wrong") =>
  typeof e === "string" ? e : e?.message || fallback;