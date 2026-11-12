const toDate = (d) => (d instanceof Date ? d : new Date(d));
const valid = (dt) => !Number.isNaN(dt.getTime());

export const formatDate = (d, opts = { year: "numeric", month: "short", day: "numeric" }) => {
  const dt = toDate(d);
  return valid(dt) ? dt.toLocaleDateString(undefined, opts) : "";
};

export const formatDateTime = (d) => {
  const dt = toDate(d);
  return valid(dt) ? dt.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "";
};

export const formatMonthYear = (d) => formatDate(d, { month: "long", year: "numeric" });

export function timeAgo(date) {
  const dt = toDate(date);
  if (!valid(dt)) return "";
  const s = Math.floor((Date.now() - dt.getTime()) / 1000);
  if (s < 60) return "just now";
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [name, secs] of units) {
    const n = Math.floor(s / secs);
    if (n >= 1) return `${n} ${name}${n > 1 ? "s" : ""} ago`;
  }
  return "just now";
}