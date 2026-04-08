import type { ReactNode } from "react";
import { DashboardAuthGate } from "@/components/dashboard/dashboard-auth-gate";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const config = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? null,
  };

  return <DashboardAuthGate config={config}>{children}</DashboardAuthGate>;
}
