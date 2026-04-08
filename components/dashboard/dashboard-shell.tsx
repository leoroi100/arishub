"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import LiquidEther from "@/components/liquid-ether";
import { DockNav, type DockNavItem } from "@/components/dashboard/dock-nav";
import { dashboardDockItems } from "@/lib/dashboard-data";
import {
  type BrowserSupabaseConfig,
  getBrowserSupabase,
} from "@/lib/supabase/client";
import styles from "./dashboard-shell.module.css";

function OverviewIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 11.5L12 4L20 11.5V20H4V11.5Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 20V13H15V20" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.7" />
      <rect x="14" y="4" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.7" />
      <rect x="4" y="14" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.7" />
      <rect x="14" y="14" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function QueueIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 7H18" stroke="currentColor" strokeWidth="1.7" />
      <path d="M6 12H14" stroke="currentColor" strokeWidth="1.7" />
      <path d="M6 17H11" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="18" cy="17" r="2" fill="currentColor" />
    </svg>
  );
}

function PulseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 12H7L10 7L14 17L17 12H21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExitIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 6H6V18H10" stroke="currentColor" strokeWidth="1.7" />
      <path d="M13 8L18 12L13 16" stroke="currentColor" strokeWidth="1.7" />
      <path d="M18 12H9" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

interface DashboardShellProps {
  config: BrowserSupabaseConfig;
  children: ReactNode;
}

export function DashboardShell({ config, children }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();

  const dockIcons = useMemo<Record<string, React.ReactNode>>(
    () => ({
      overview: <OverviewIcon />,
      modules: <GridIcon />,
      queue: <QueueIcon />,
      activity: <PulseIcon />,
      logout: <ExitIcon />,
    }),
    [],
  );

  const dockItems = useMemo<DockNavItem[]>(
    () =>
      dashboardDockItems.map((item) => ({
        ...item,
        icon: dockIcons[item.id],
      })),
    [dockIcons],
  );

  async function handleSignOut() {
    try {
      await getBrowserSupabase(config).auth.signOut();
      router.replace("/login");
      router.refresh();
    } catch {}
  }

  function handleDockSelect(id: string) {
    const item = dockItems.find((entry) => entry.id === id);

    if (id === "logout") {
      void handleSignOut();
      return;
    }

    if (item?.href) {
      router.push(item.href);
    }
  }

  const activeDock =
    dockItems.find((item) => item.href === pathname)?.id ?? "overview";

  return (
    <main className={styles.page}>
      <div aria-hidden="true" className={styles.etherLayer}>
        <LiquidEther
          autoDemo
          autoIntensity={2.2}
          autoSpeed={0.42}
          captureAllPointer
          colors={["#0a0608", "#4b0f20", "#b41f34"]}
          cursorSize={150}
          isBounce={false}
          isViscous
          iterationsPoisson={28}
          iterationsViscous={26}
          mouseForce={28}
          pauseOnHover={false}
          resolution={0.45}
          viscous={30}
        />
      </div>
      <div aria-hidden="true" className={styles.etherVeil} />

      <div className={styles.stage}>{children}</div>

      <DockNav items={dockItems} activeId={activeDock} onSelect={handleDockSelect} />
    </main>
  );
}
