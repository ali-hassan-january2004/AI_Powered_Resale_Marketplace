import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

// onResolve(status) where status is "dismissed" | "actioned"; must return a promise
export default function ReportActionModal({ open, report, onClose, onResolve }) {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");

  const act = async (status) => {
    setLoading(status);
    setError("");
    try {
      await onResolve(status);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Review report">
      {report && (
        <dl className="space-y-2 text-sm">
          <div><dt className="text-stone-500">Target</dt><dd className="capitalize">{report.targetType} ({String(report.targetId).slice(-6)})</dd></div>
          <div><dt className="text-stone-500">Reason</dt><dd>{report.reason}</dd></div>
          <div><dt className="text-stone-500">Reported by</dt><dd>{report.reporter?.name || "–"}</dd></div>
        </dl>
      )}
      <p className="mt-4 text-xs text-stone-500">
        "Take action" marks the report as handled. Remove the listing or block the user separately from their admin pages.
      </p>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button variant="secondary" loading={loading === "dismissed"} onClick={() => act("dismissed")}>Dismiss</Button>
        <Button variant="danger" loading={loading === "actioned"} onClick={() => act("actioned")}>Take action</Button>
      </div>
    </Modal>
  );
}