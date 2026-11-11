import { Link } from "react-router-dom";
import { PATHS } from "../../app/routePaths";
import PageContainer from "../../components/layout/PageContainer";
import EmptyState from "../../components/ui/EmptyState";

export default function NotFound() {
  return (
    <PageContainer narrow>
      <EmptyState
        title="404: page not found"
        description="The page you're looking for doesn't exist or has moved."
        action={<Link to={PATHS.home} className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">Back to home</Link>}
      />
    </PageContainer>
  );
}