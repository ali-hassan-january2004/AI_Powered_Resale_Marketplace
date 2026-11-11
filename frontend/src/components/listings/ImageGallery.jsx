import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageGallery({ images = [], alt = "Listing photo" }) {
  const [index, setIndex] = useState(0);

  if (!images.length) {
    return <div className="flex aspect-square items-center justify-center rounded-xl bg-stone-100 text-sm text-stone-400">No photos</div>;
  }

  const go = (i) => setIndex((i + images.length) % images.length);

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(index - 1);
        if (e.key === "ArrowRight") go(index + 1);
      }}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-stone-100">
        <img src={images[index].url} alt={`${alt} ${index + 1} of ${images.length}`} className="h-full w-full object-cover" />
        {images.length > 1 && (
          <>
            <button onClick={() => go(index - 1)} aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow hover:bg-white">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => go(index + 1)} aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow hover:bg-white">
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <li key={img.publicId || img.url}>
              <button onClick={() => setIndex(i)} aria-label={`Show photo ${i + 1}`} aria-current={i === index}
                className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${i === index ? "border-emerald-600" : "border-transparent opacity-70 hover:opacity-100"}`}>
                <img src={img.url} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}