import { useParams } from "react-router-dom";
import { PATHS } from "../../app/routePaths";
import { getCategories } from "../../api/categories";
import useFetch from "../../hooks/useFetch";
import PageContainer from "../../components/layout/PageContainer";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import ListingBrowser from "../../components/listings/ListingBrowser";

const flatten = (list = []) => list.flatMap((c) => [c, ...flatten(c.children || [])]);

export default function Category() {
  const { slug } = useParams();
  const { data: categories } = useFetch(() => getCategories(), []);
  const category = flatten(categories || []).find((c) => c.slug === slug);
  const name = category?.name || slug.replace(/-/g, " ");

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: "Home", to: PATHS.home }, { label: name }]} />
      <h1 className="mb-6 text-2xl font-bold capitalize tracking-tight sm:text-3xl">{name}</h1>
      <ListingBrowser key={slug} fixedParams={{ category: slug }} emptyTitle={`No items in ${name} yet`} />
    </PageContainer>
  );
}