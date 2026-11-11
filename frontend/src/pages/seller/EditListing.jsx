import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "../../app/routePaths";
import { getListing, updateListing, uploadListingImages } from "../../api/listings";
import { getCategories } from "../../api/categories";
import useFetch from "../../hooks/useFetch";
import PageContainer from "../../components/layout/PageContainer";
import ListingForm from "../../components/selling/ListingForm";
import ErrorBanner from "../../components/ui/ErrorBanner";
import Skeleton from "../../components/ui/Skeleton";
import { toast } from "../../components/ui/Toast";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: listing, loading, error, refetch } = useFetch(() => getListing(id), [id]);
  const { data: categories } = useFetch(() => getCategories(), []);

  if (loading) return <PageContainer narrow><Skeleton className="h-96 w-full" rounded="rounded-2xl" /></PageContainer>;
  if (error || !listing) return <PageContainer narrow><ErrorBanner message={error || "Listing not found."} onRetry={refetch} /></PageContainer>;

  if (["sold", "reserved", "removed"].includes(listing.status)) {
    return (
      <PageContainer narrow>
        <ErrorBanner message={`This listing is ${listing.status} and can no longer be edited.`} />
      </PageContainer>
    );
  }

  const isDraft = listing.status === "draft";

  const initialValues = {
    title: listing.title, description: listing.description,
    category: listing.category?._id || listing.category || "",
    brand: listing.brand || "", size: listing.size || "", color: listing.color || "",
    condition: listing.condition || "", price: listing.price,
  };

  const initialImages = (listing.images || []).map((img) => ({
    id: img.publicId || img.url, url: img.url, publicId: img.publicId, isCover: !!img.isCover,
  }));

  const submit = async (values, images, { draft }) => {
    const kept = images.filter((i) => !i.file);
    const fresh = images.filter((i) => i.file);

    await updateListing(id, {
      ...values,
      images: kept.map((i, idx) => ({ url: i.url, publicId: i.publicId, isCover: i.isCover, order: idx })),
    });
    if (fresh.length) await uploadListingImages(id, fresh.map((i) => i.file));
    if (isDraft && !draft) await updateListing(id, { status: "active" });

    toast.success(isDraft && !draft ? "Your item is live!" : "Changes saved");
    navigate(isDraft && draft ? PATHS.sellerListings : PATHS.listing(id));
  };

  return (
    <PageContainer title="Edit listing" narrow>
      <ListingForm
        initialValues={initialValues}
        initialImages={initialImages}
        categories={categories || []}
        onSubmit={submit}
        submitLabel={isDraft ? "Publish listing" : "Save changes"}
        showDraftButton={isDraft}
      />
    </PageContainer>
  );
}