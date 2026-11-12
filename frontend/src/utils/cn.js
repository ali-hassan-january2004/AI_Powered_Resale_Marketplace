// cn("btn", isActive && "btn-active", { hidden: !open }) → "btn btn-active"
export function cn(...args) {
  const out = [];
  const walk = (a) => {
    if (!a) return;
    if (typeof a === "string" || typeof a === "number") out.push(a);
    else if (Array.isArray(a)) a.forEach(walk);
    else if (typeof a === "object") Object.entries(a).forEach(([k, v]) => v && out.push(k));
  };
  args.forEach(walk);
  return out.join(" ");
}