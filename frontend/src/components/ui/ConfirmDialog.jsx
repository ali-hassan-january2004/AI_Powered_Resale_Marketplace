import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

// onConfirm may be async; the dialog closes when it resolves.
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const confirm = async () => {
    setLoading(true);
    setError("");
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={loading ? undefined : onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>{cancelLabel}</Button>
          <Button variant={danger ? "danger" : "primary"} loading={loading} onClick={confirm}>{confirmLabel}</Button>
        </>
      }
    >
      {message && <p className="text-sm text-stone-600">{message}</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </Modal>
  );
}