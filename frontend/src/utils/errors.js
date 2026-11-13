export const errMsg = (error, fallback = "Something went wrong") =>
  error?.response?.data?.message || error?.message || fallback;
