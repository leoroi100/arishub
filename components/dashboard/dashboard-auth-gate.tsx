"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  type BrowserSupabaseConfig,
  getBrowserSupabase,
  hasBrowserSupabaseConfig,
} from "@/lib/supabase/client";

interface DashboardAuthGateProps {
  config: BrowserSupabaseConfig;
}

export function DashboardAuthGate({ config }: DashboardAuthGateProps) {
  const router = useRouter();
  const isConfigured = hasBrowserSupabaseConfig(config);
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "ready"; email: string }
    | { status: "missing-config" }
  >(() => (isConfigured ? { status: "loading" } : { status: "missing-config" }));

  useEffect(() => {
    if (!isConfigured) {
      return;
    }

    const supabase = getBrowserSupabase(config);

    void supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
        return;
      }

      setState({
        status: "ready",
        email: data.user.email ?? "conta@arishub.app",
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.replace("/login");
        return;
      }

      setState({
        status: "ready",
        email: session.user.email ?? "conta@arishub.app",
      });
    });

    return () => subscription.unsubscribe();
  }, [config, isConfigured, router]);

  if (state.status === "missing-config") {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#030303",
          color: "#fcfcfd",
          padding: "24px",
        }}
      >
        <div
          style={{
            width: "min(520px, 100%)",
            padding: "28px",
            borderRadius: "28px",
            border: "1px solid rgba(255,255,255,0.08)",
            background:
              "linear-gradient(180deg, rgba(18,18,20,0.92) 0%, rgba(8,8,10,0.98) 100%)",
          }}
        >
          <strong style={{ display: "block", marginBottom: "12px", fontSize: "1.12rem" }}>
            As envs publicas do Supabase nao chegaram no frontend.
          </strong>
          <p style={{ margin: 0, lineHeight: 1.8, color: "rgba(252,252,253,0.7)" }}>
            Confira `NEXT_PUBLIC_SUPABASE_URL` e
            `NEXT_PUBLIC_SUPABASE_ANON_KEY` na Vercel e gere um novo deploy.
          </p>
        </div>
      </main>
    );
  }

  if (state.status === "loading") {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#030303",
          color: "rgba(252,252,253,0.72)",
        }}
      >
        Carregando dashboard...
      </main>
    );
  }

  return <DashboardShell userEmail={state.email} config={config} />;
}
