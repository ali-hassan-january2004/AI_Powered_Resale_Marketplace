import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Flag, ShoppingBag } from "lucide-react";
import { PATHS } from "../../app/routePaths";
import { getListing } from "../../api/listings";
import { createReport } from "../../api/reports";
import { addCartItem } from "../../features/cart/cartSlice";
import { CONDITIONS } from "../../utils/constants";
import { formatPrice } from "../../utils/formatPrice";
import { errMsg } from "../../utils/errors";
import useFetch from "../../hooks/useFetch";
import PageContainer from "../../components/layout/PageContainer";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import ImageGallery from "../../components/listings/ImageGallery";
import SellerCard from "../../components/listings/SellerCard";
import SimilarItems from "../../components/listings/SimilarItems";
import WishlistButton from "../../components/listings/WishlistButton";
import ErrorBanner from "../../components/ui/ErrorBanner";
import Skeleton from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";
import { toast } from "../../components/ui/Toast";

const REASONS = [
  "Counterfeit or fake item",
  "Prohibited item",
  "Misleading description or photos",
  "Spam or duplicate listing",
  "Other",
];

function ReportModal({ open, onClose, listingId }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!reason) return setError("Please choose a reason.");
    setLoading(true);
    setError("");
    try {
      await createReport({
        targetType: "listing",
        targetId: listingId,
        reason: details.trim() ? `${reason}: ${details.trim()}` : reason,
      });
      toast.success("Thanks, we'll review this listing.");
      onClose();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Report this listing"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant="danger" loading={loading} onClick={submit}>Send report</Button></>}>
      <div className="space-y-3">
        <Select label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Select a reason…"
          options={REASONS.map((r) => ({ value: r, label: r }))} />
        <Textarea label="Details (optional)" rows={3} maxLength={300} value={details} onChange={(e) => setDetails(e.target.value)} />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </Modal>
  );
}

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const cartItems = useSelector((s) => s.cart.items || []);
  const { data: listing, loading, error, refetch } = useFetch(() => getListing(id), [id]);
  const [adding, setAdding] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const requireLogin = () => navigate(PATHS.login, { state: { from: location } });

  if (loading) {
    return (
      <PageContainer>
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square w-full" rounded="rounded-xl" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" /><Skeleton className="h-6 w-1/4" /><Skeleton className="h-32 w-full" />
          </div>
        </div>
      </PageContainer>
    );
  }
  if (error || !listing) {
    return <PageContainer narrow><ErrorBanner message={error || "Listing not found."} onRetry={refetch} /></PageContainer>;
  }

  const sellerId = listing.seller?._id || listing.seller;
  const isOwn = user && sellerId === user._id;
  const inCart = cartItems.some((i) => i._id === listing._id);
  const available = listing.status === "active";
  const condition = CONDITIONS.find((c) => c.value === listing.condition);

  const addToCart = async () => {
    if (!user) return requireLogin();
    setAdding(true);
    try {
      await dispatch(addCartItem(listing._id)).unwrap();
      toast.success("Added to your cart");
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setAdding(false);
    }
  };

  const details = [
    ["Brand", listing.brand],
    ["Size", listing.size],
    ["Color", listing.color],
    ["Condition", condition?.label],
  ].filter(([, v]) => v);

  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          { label: "Home", to: PATHS.home },
          ...(listing.category?.slug ? [{ label: listing.category.name, to: PATHS.category(listing.category.slug) }] : []),
          { label: listing.title },
        ]}
      />

      <div className="grid gap-8 md:grid-cols-2">
        <ImageGallery images={listing.images} alt={listing.title} />

        <div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{listing.title}</h1>
            <WishlistButton listingId={listing._id} initialActive={!!listing.isFavorite} className="border border-stone-200" />
          </div>
          <p className="mt-2 text-2xl font-semibold">{formatPrice(listing.price)}</p>

          {!available && (
            <p className="mt-3 rounded-lg bg-stone-100 px-3 py-2 text-sm text-stone-700">
              {listing.status === "sold" ? "This item has been sold." : "This item is not available right now."}
            </p>
          )}

          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            {details.map(([k, v]) => (
              <div key={k}>
                <dt className="text-stone-500">{k}</dt>
                <dd className="font-medium capitalize">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6">
            {isOwn ? (
              <Link to={PATHS.sellEdit(listing._id)} className="inline-block rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium hover:bg-stone-50">
                Edit your listing
              </Link>
            ) : inCart ? (
              <Link to={PATHS.cart} className="inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700">
                In your cart. View cart
              </Link>
            ) : (
              <Button size="lg" className="w-full sm:w-auto" disabled={!available} loading={adding} onClick={addToCart}>
                <ShoppingBag size={18} /> Add to cart
              </Button>
            )}
          </div>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-stone-500">Description</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-stone-700">{listing.description}</p>

          <div className="mt-8">
            <SellerCard seller={listing.seller} />
          </div>

          {!isOwn && (
            <button
              onClick={() => (user ? setReportOpen(true) : requireLogin())}
              className="mt-4 flex items-center gap-1.5 text-xs text-stone-500 hover:text-red-600"
            >
              <Flag size={14} /> Report this listing
            </button>
          )}
        </div>
      </div>

      <SimilarItems listingId={listing._id} />
      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} listingId={listing._id} />
    </PageContainer>
  );
}