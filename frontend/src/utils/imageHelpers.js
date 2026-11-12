export const getCoverImage = (listing) =>
  listing?.images?.find((i) => i.isCover) || listing?.images?.[0] || null;

// Cloudinary URLs get automatic format/quality and optional resizing (NFR-01).
// Any other URL is returned unchanged.
export function optimizeImage(url, { width, height, crop = "fill" } = {}) {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  const t = [
    "f_auto",
    "q_auto",
    width && `w_${width}`,
    height && `h_${height}`,
    (width || height) && `c_${crop}`,
  ]
    .filter(Boolean)
    .join(",");
  return url.replace("/upload/", `/upload/${t}/`);
}

export const getCoverUrl = (listing, opts) => optimizeImage(getCoverImage(listing)?.url, opts);

export const imageSrcSet = (url, widths = [320, 640, 960]) =>
  widths.map((w) => `${optimizeImage(url, { width: w })} ${w}w`).join(", ");

// Frees the blob: URLs created for local previews (see ImageUploader)
export const revokePreviews = (images = []) =>
  images.forEach((i) => i.file && URL.revokeObjectURL(i.url));

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}