import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

// onConfirm(reason) must return a promise
export default function RemoveListingModal({ open, listing, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    setReason("");
    setError("");
    onClose();
  };

  const submit = async () => {
    if (reason.trim().length < 5) return setError("Please give a reason (at least 5 characters). The seller will see it.");
    setLoading(true);
    setError("");
    try {
      await onConfirm(reason.trim());
      close();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={close} title="Remove listing">
      <p className="text-sm text-stone-600">
        You are removing <span className="font-medium text-stone-900">{listing?.title}</span>. It will disappear from search and the seller will be notified.
      </p>
      <label className="mt-4 block text-sm font-medium" htmlFor="remove-reason">Reason</label>
      <textarea
        id="remove-reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={3}
        maxLength={300}
        className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={close}>Cancel</Button>
        <Button variant="danger" loading={loading} onClick={submit}>Remove listing</Button>
      </div>
    </Modal>
  );
}