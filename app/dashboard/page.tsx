import { DashboardAuthGate } from "@/components/dashboard/dashboard-auth-gate";

export default async function DashboardPage() {
  const config = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? null,
  };

  return <DashboardAuthGate config={config} />;
}
