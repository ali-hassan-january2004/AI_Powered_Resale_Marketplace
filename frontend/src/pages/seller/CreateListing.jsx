import { useNavigate } from "react-router-dom";
import { PATHS } from "../../app/routePaths";
import { createListing, updateListing, uploadListingImages } from "../../api/listings";
import { getCategories } from "../../api/categories";
import useFetch from "../../hooks/useFetch";
import PageContainer from "../../components/layout/PageContainer";
import ListingForm from "../../components/selling/ListingForm";
import { toast } from "../../components/ui/Toast";

export default function CreateListing() {
  const navigate = useNavigate();
  const { data: categories } = useFetch(() => getCategories(), []);

  const submit = async (values, images, { draft }) => {
    // 1. create as draft  2. upload photos (cover first)  3. publish
    const created = await createListing({ ...values, status: "draft" });
    const id = created._id || created.listing?._id;

    try {
      const files = [...images].sort((a, b) => Number(b.isCover) - Number(a.isCover)).map((i) => i.file);
      if (files.length) await uploadListingImages(id, files);
      if (!draft) await updateListing(id, { status: "active" });
    } catch (e) {
      toast.error(`Your listing was saved, but: ${e.message}`);
      navigate(PATHS.sellEdit(id), { replace: true });
      return;
    }

    toast.success(draft ? "Draft saved" : "Your item is live!");
    navigate(draft ? PATHS.sellerListings : PATHS.listing(id), { replace: true });
  };

  return (
    <PageContainer title="Sell an item" subtitle="Upload photos, review the details, publish." narrow>
      <ListingForm categories={categories || []} onSubmit={submit} />
    </PageContainer>
  );
}