import { useCallback, useMemo } from "react";
import { toast } from "../components/ui/toastStore";
import { errMsg } from "./errors";

// const toast = useToast();
// toast.success("Saved");
// await toast.run(() => api(), { success: "Saved" })  // shows the error toast on failure, returns undefined
export default function useToast() {
  const run = useCallback(async (fn, { success, error } = {}) => {
    try {
      const result = await fn();
      if (success) toast.success(typeof success === "function" ? success(result) : success);
      return result;
    } catch (e) {
      toast.error(error || errMsg(e));
      return undefined;
    }
  }, []);

  return useMemo(() => ({ ...toast, run }), [run]);
}