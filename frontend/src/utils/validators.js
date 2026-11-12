import { LISTING_LIMITS } from "./constants";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isEmail = (v) => EMAIL_RE.test(String(v ?? "").trim());

export const isPhone = (v) => /^[+\d][\d\s()-]{6,19}$/.test(String(v ?? "").trim());

// SRS AUTH-01: at least 8 characters (72 is bcrypt's input limit)
export const isValidPassword = (v) => typeof v === "string" && v.length >= 8 && v.length <= 72;

// For a live checklist under the password field
export const passwordChecks = (v = "") => [
  { label: "At least 8 characters", ok: v.length >= 8 },
  { label: "Contains a letter", ok: /[A-Za-z]/.test(v) },
  { label: "Contains a number", ok: /\d/.test(v) },
];

export const isPositiveNumber = (v) => Number.isFinite(Number(v)) && Number(v) > 0;

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Returns an error message, or "" if the file is fine (SRS LST-02, AT-09)
export function validateImageFile(file, { maxMB = LISTING_LIMITS.maxImageMB } = {}) {
  if (!file) return "No file selected.";
  if (!IMAGE_TYPES.includes(file.type)) return `${file.name}: use JPG, PNG or WebP.`;
  if (file.size > maxMB * 1024 * 1024) return `${file.name}: larger than ${maxMB} MB.`;
  return "";
}