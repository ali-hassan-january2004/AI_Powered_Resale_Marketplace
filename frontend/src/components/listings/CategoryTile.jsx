import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PATHS } from "../../app/routePaths";

const CATEGORY_COVERS = {
  women: "/images/category-women.jpg",
  men: "/images/resale-clothing.jpg",
  accessories: "/images/category-accessories.jpg",
};

export default function CategoryTile({ category }) {
  const image = category.image || CATEGORY_COVERS[category.slug] || "/images/category-accessories.jpg";

  return (
    <Link
      to={PATHS.category(category.slug)}
      className="group relative block h-56 overflow-hidden rounded-2xl bg-stone-200 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:h-72"
    >
      <img
        src={image}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/10 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-left text-white sm:p-6">
        <span>
          <span className="block text-xs font-medium uppercase tracking-[0.16em] text-white/75">Explore</span>
          <span className="mt-1 block font-display text-2xl sm:text-3xl">{category.name}</span>
        </span>
        <span className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/10 backdrop-blur transition group-hover:bg-white group-hover:text-stone-900">
          <ArrowUpRight size={18} />
        </span>
      </span>
    </Link>
  );
}