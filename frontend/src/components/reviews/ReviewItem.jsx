import RatingStars from "../ui/RatingStars";
import { timeAgo } from "../../utils/timeAgo";

export default function ReviewItem({ review }) {
  const name = review.reviewer?.name || "Buyer";
  return (
    <article className="flex gap-3 py-4">
      {review.reviewer?.avatarUrl ? (
        <img src={review.reviewer.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
      ) : (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-200 font-semibold text-stone-600">
          {name[0]?.toUpperCase()}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{name}</span>
          <span className="text-xs text-stone-500">{timeAgo(review.createdAt)}</span>
        </div>
        <RatingStars value={review.rating} size={14} />
        {review.comment && <p className="mt-1 break-words text-sm text-stone-700">{review.comment}</p>}
      </div>
    </article>
  );
}