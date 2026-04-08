import { DashboardAuthGate } from "@/components/dashboard/dashboard-auth-gate";

export default async function DashboardPage() {
  return <DashboardAuthGate />;
}
