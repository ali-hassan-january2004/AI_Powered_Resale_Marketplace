import { Link } from "react-router-dom";
import { PATHS } from "../../app/routePaths";

export default function CategoryTile({ category }) {
  return (
    <Link
      to={PATHS.category(category.slug)}
      className="group flex flex-col items-center gap-2 rounded-xl border border-stone-200 bg-white p-4 text-center transition hover:border-emerald-600 hover:shadow-sm"
    >
      <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-emerald-50 text-xl font-bold text-emerald-700">
        {category.image ? (
          <img src={category.image} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          category.name?.[0]?.toUpperCase()
        )}
      </span>
      <span className="text-sm font-medium group-hover:text-emerald-700">{category.name}</span>
    </Link>
  );
}