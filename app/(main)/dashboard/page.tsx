import { getUserOnboardingStatus } from "@/actions/user"
import { redirect } from "next/navigation"
import { Dashboard } from "@/actions/dashboard"
import DashboardView from "./_components/dashboard-view"

const IndustryInsightPage = async () => {
  const status = await getUserOnboardingStatus();

  if (!status.isOnboarded) {
    return redirect("/onboarding");
  }

  const insights = await Dashboard();

  return (
    <div className="container mx-auto">
       
      <DashboardView insights={insights} />
    </div>
  );
};

export default IndustryInsightPage;
