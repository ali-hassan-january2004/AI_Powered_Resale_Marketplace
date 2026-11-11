import { useState } from "react";
import Button from "../ui/Button";

// onToggle(user, nextBlockedValue) must return a promise
export default function BlockUserButton({ user, onToggle }) {
  const [loading, setLoading] = useState(false);
  const blocking = !user.isBlocked;

  const handle = async () => {
    const msg = blocking
      ? `Block ${user.name}? They will not be able to log in or list items.`
      : `Unblock ${user.name}?`;
    if (!window.confirm(msg)) return;
    setLoading(true);
    try {
      await onToggle(user, blocking);
    } finally {
      setLoading(false);
    }
  };

  if (user.role === "admin") return <span className="text-xs text-stone-400">Admin</span>;

  return (
    <Button size="sm" variant={blocking ? "danger" : "secondary"} loading={loading} onClick={handle}>
      {blocking ? "Block" : "Unblock"}
    </Button>
  );
}