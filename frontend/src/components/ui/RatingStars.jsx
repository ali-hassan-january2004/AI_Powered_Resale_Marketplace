import { useState } from "react";
import { Star as StarIcon } from "lucide-react";

// Display:     <RatingStars value={4.5} size={16} />   (supports half stars)
// Interactive: <RatingStars value={rating} onChange={setRating} size={28} />
export default function RatingStars({ value = 0, onChange, size = 16, max = 5, className = "" }) {
  const [hover, setHover] = useState(0);
  const interactive = typeof onChange === "function";
  const shown = interactive && hover ? hover : value;
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  const star = (n) => {
    const fill = Math.max(0, Math.min(1, shown - (n - 1)));
    return (
      <span className="relative inline-block" style={{ width: size, height: size }}>
        <StarIcon size={size} className="text-stone-300" />
        <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
          <StarIcon size={size} className="fill-amber-400 text-amber-400" />
        </span>
      </span>
    );
  };

  if (!interactive) {
    return (
      <span role="img" aria-label={`${value} out of ${max} stars`} className={`inline-flex gap-0.5 ${className}`}>
        {stars.map((n) => <span key={n}>{star(n)}</span>)}
      </span>
    );
  }

  return (
    <div role="radiogroup" aria-label="Rating" className={`inline-flex gap-1 ${className}`} onMouseLeave={() => setHover(0)}>
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onFocus={() => setHover(n)}
          onBlur={() => setHover(0)}
        >
          {star(n)}
        </button>
      ))}
    </div>
  );
}