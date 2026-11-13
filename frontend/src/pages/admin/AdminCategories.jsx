import { useState } from "react";
import { getAdminReports, resolveReport } from "../../api/adminApi";
import useFetch from "../../hooks/useFetch";
import PageContainer from "../../components/layout/PageContainer";
import CategoryManager from "../../components/admin/CategoryManager";
import ReportsTable from "../../components/admin/ReportsTable";
import ReportActionModal from "../../components/admin/ReportActionModal";
import Tabs from "../../components/ui/Tabs";
import ErrorBanner from "../../components/ui/ErrorBanner";
import { toast } from "../../components/ui/toastStore";

function ReportsPanel() {
  const [reviewing, setReviewing] = useState(null);
  const { data, loading, error, refetch } = useFetch(() => getAdminReports({ status: "open" }), []);
  const reports = Array.isArray(data) ? data : data?.items || [];

  const resolve = async (status) => {
    await resolveReport(reviewing._id, status);
    toast.success(status === "dismissed" ? "Report dismissed" : "Report marked as actioned");
    refetch();
  };

  if (error) return <ErrorBanner message={error} onRetry={refetch} />;
  return (
    <>
      <ReportsTable reports={reports} loading={loading} onReview={setReviewing} />
      <ReportActionModal open={!!reviewing} report={reviewing} onClose={() => setReviewing(null)} onResolve={resolve} />
    </>
  );
}

export default function AdminCategories() {
  const [tab, setTab] = useState("categories");
  return (
    <PageContainer title="Categories & reports" className="!px-0 !py-0">
      <Tabs value={tab} onChange={setTab} tabs={[{ id: "categories", label: "Categories" }, { id: "reports", label: "Open reports" }]} />
      <div className="mt-6">{tab === "categories" ? <CategoryManager /> : <ReportsPanel />}</div>
    </PageContainer>
  );
}