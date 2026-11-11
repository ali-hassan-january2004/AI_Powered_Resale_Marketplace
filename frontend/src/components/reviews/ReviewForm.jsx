import { useState } from "react";
import RatingStars from "../ui/RatingStars";
import Button from "../ui/Button";

// onSubmit({ rating, comment }) must return a promise
export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) return setError("Please choose a star rating.");
    setLoading(true);
    setError("");
    try {
      await onSubmit({ rating, comment: comment.trim() || undefined });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-stone-200 bg-white p-4">
      <div>
        <p className="mb-1 text-sm font-medium">Rate this seller</p>
        <RatingStars value={rating} onChange={setRating} size={28} />
      </div>
      <div>
        <label htmlFor="review-comment" className="mb-1 block text-sm font-medium">Comment (optional)</label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          rows={3}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
        />
        <p className="text-right text-xs text-stone-500">{comment.length}/500</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" loading={loading}>Submit review</Button>
    </form>
  );
}