import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import { Dashboard } from "@/actions/dashboard";
import DashboardView from "./_components/dashboard-view";

export default async function IndustryInsightPage() {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (!isOnboarded) redirect("/onboarding");

  const insights = await Dashboard();

  return (
    <div className="container mx-auto">
      <DashboardView insights={insights} />
    </div>
  );
}
