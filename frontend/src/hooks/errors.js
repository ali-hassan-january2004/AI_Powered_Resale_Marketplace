export { errMsg } from "../utils/errors";

// Shape used by every thunk's rejectWithValue, so callers can read e.message / e.status / e.code
export const toRejection = (e) =>
  typeof e === "string"
    ? { message: e }
    : { message: e?.message || "Something went wrong", status: e?.status, code: e?.code };

export const isConflict = (e) => e?.status === 409; // e.g. item already sold
export const isUnauthorized = (e) => e?.status === 401;