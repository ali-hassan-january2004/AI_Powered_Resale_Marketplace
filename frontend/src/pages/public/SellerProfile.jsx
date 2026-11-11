import { useState } from "react";
import { useParams } from "react-router-dom";
import { getSellerProfile } from "../../api/users";
import useFetch from "../../hooks/useFetch";
import PageContainer from "../../components/layout/PageContainer";
import ListingGrid from "../../components/listings/ListingGrid";
import ReviewList from "../../components/reviews/ReviewList";
import RatingStars from "../../components/ui/RatingStars";
import Tabs from "../../components/ui/Tabs";
import ErrorBanner from "../../components/ui/ErrorBanner";
import Skeleton from "../../components/ui/Skeleton";

export default function SellerProfile() {
  const { id } = useParams();
  const { data: profile, loading, error, refetch } = useFetch(() => getSellerProfile(id), [id]);
  const [tab, setTab] = useState("listings");

  if (loading) return <PageContainer narrow><Skeleton className="h-28 w-full" rounded="rounded-xl" /></PageContainer>;
  if (error || !profile) return <PageContainer narrow><ErrorBanner message={error || "Seller not found."} onRetry={refetch} /></PageContainer>;

  const shop = profile.sellerProfile?.shopName || profile.name;
  const listings = profile.listings || [];

  return (
    <PageContainer>
      <header className="flex flex-wrap items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5">
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt="" className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-3xl font-bold text-white">
            {shop?.[0]?.toUpperCase()}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold">{shop}</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-stone-600">
            <RatingStars value={profile.ratingAvg || 0} size={16} />
            <span>{profile.ratingCount ? `${(profile.ratingAvg || 0).toFixed(1)} (${profile.ratingCount} reviews)` : "No reviews yet"}</span>
          </div>
          {profile.sellerProfile?.bio && <p className="mt-2 max-w-xl text-sm text-stone-700">{profile.sellerProfile.bio}</p>}
          {profile.createdAt && <p className="mt-1 text-xs text-stone-500">Member since {new Date(profile.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</p>}
        </div>
      </header>

      <Tabs className="mt-6" value={tab} onChange={setTab}
        tabs={[{ id: "listings", label: "Listings", count: listings.length }, { id: "reviews", label: "Reviews", count: profile.ratingCount || 0 }]} />

      <div className="mt-6">
        {tab === "listings" ? (
          <ListingGrid listings={listings} emptyTitle="No active listings" emptyHint="This seller has nothing for sale right now." />
        ) : (
          <ReviewList sellerId={id} />
        )}
        {profile.sellerProfile?.returnPolicy && tab === "listings" && (
          <div className="mt-8 rounded-xl border border-stone-200 bg-white p-4 text-sm">
            <p className="font-semibold">Return policy</p>
            <p className="mt-1 text-stone-600">{profile.sellerProfile.returnPolicy}</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}