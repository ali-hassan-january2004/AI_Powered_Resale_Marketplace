import { useSearchParams } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import ListingBrowser from "../../components/listings/ListingBrowser";

export default function Search() {
  const [sp] = useSearchParams();
  const q = sp.get("q");

  return (
    <PageContainer title={q ? `Results for "${q}"` : "Browse all items"}>
      <ListingBrowser emptyTitle="No items match your search" />
    </PageContainer>
  );
}