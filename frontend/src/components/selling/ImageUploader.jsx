import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Star, X } from "lucide-react";
import { LISTING_LIMITS } from "../../utils/constants";

const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

// value: [{ id, url, file?, isCover }]  (file is set for new uploads; existing images only have url)
// onChange(nextValue)
export default function ImageUploader({ value = [], onChange, error }) {
  const [localError, setLocalError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);
  const dragIndex = useRef(null);
  const { maxImages, maxImageMB } = LISTING_LIMITS;

  const withCover = (list) =>
    list.length && !list.some((i) => i.isCover) ? list.map((i, idx) => ({ ...i, isCover: idx === 0 })) : list;

  const addFiles = (fileList) => {
    const errors = [];
    const next = [...value];
    for (const file of Array.from(fileList)) {
      if (next.length >= maxImages) { errors.push(`You can add up to ${maxImages} photos.`); break; }
      if (!ACCEPT.includes(file.type)) { errors.push(`${file.name}: use JPG, PNG or WebP.`); continue; }
      if (file.size > maxImageMB * 1024 * 1024) { errors.push(`${file.name}: larger than ${maxImageMB} MB.`); continue; }
      next.push({ id: crypto.randomUUID(), file, url: URL.createObjectURL(file), isCover: false });
    }
    setLocalError(errors.join(" "));
    onChange(withCover(next));
  };

  const remove = (id) => {
    const item = value.find((i) => i.id === id);
    if (item?.file) URL.revokeObjectURL(item.url);
    onChange(withCover(value.filter((i) => i.id !== id)));
  };

  const setCover = (id) => onChange(value.map((i) => ({ ...i, isCover: i.id === id })));

  const move = (from, to) => {
    if (to < 0 || to >= value.length || from === to) return;
    const next = [...value];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    onChange(next);
  };

  const shownError = error || localError;

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
        }}
        className={`rounded-xl border-2 border-dashed p-6 text-center ${dragOver ? "border-emerald-600 bg-emerald-50" : "border-stone-300 bg-white"}`}
      >
        <ImagePlus className="mx-auto text-stone-400" size={32} />
        <p className="mt-2 text-sm">
          Drag photos here or{" "}
          <button type="button" onClick={() => inputRef.current?.click()} className="font-medium text-emerald-700 hover:underline">
            browse
          </button>
        </p>
        <p className="text-xs text-stone-500">
          1 to {maxImages} photos · JPG, PNG or WebP · up to {maxImageMB} MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT.join(",")}
          multiple
          className="hidden"
          onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
        />
      </div>

      {shownError && <p className="mt-2 text-sm text-red-600">{shownError}</p>}

      {value.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {value.map((img, idx) => (
            <li
              key={img.id}
              draggable
              onDragStart={() => (dragIndex.current = idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (dragIndex.current != null) move(dragIndex.current, idx);
                dragIndex.current = null;
              }}
              className="group relative"
            >
              <div className={`aspect-square overflow-hidden rounded-lg border-2 bg-stone-100 ${img.isCover ? "border-emerald-600" : "border-transparent"}`}>
                <img src={img.url} alt={`Photo ${idx + 1}`} className="h-full w-full object-cover" />
              </div>
              {img.isCover && (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">Cover</span>
              )}
              <button type="button" onClick={() => remove(img.id)} aria-label={`Remove photo ${idx + 1}`}
                className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1 shadow hover:bg-white">
                <X size={14} />
              </button>
              <div className="mt-1 flex items-center justify-between">
                <button type="button" onClick={() => move(idx, idx - 1)} disabled={idx === 0} aria-label="Move earlier" className="p-1 text-stone-600 disabled:opacity-30"><ArrowLeft size={16} /></button>
                <button type="button" onClick={() => setCover(img.id)} disabled={img.isCover} aria-label="Set as cover" className="flex items-center gap-1 text-xs text-stone-600 hover:text-emerald-700 disabled:opacity-30">
                  <Star size={13} /> Cover
                </button>
                <button type="button" onClick={() => move(idx, idx + 1)} disabled={idx === value.length - 1} aria-label="Move later" className="p-1 text-stone-600 disabled:opacity-30"><ArrowRight size={16} /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}