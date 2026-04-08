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
      <path d="M7 6H17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M7 12H17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M7 18H13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 19V8.2C4 7.54 4.54 7 5.2 7H18.8C19.46 7 20 7.54 20 8.2V19" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 7V19" stroke="currentColor" strokeWidth="1.7" />
      <path d="M15 7V19" stroke="currentColor" strokeWidth="1.7" />
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
      <rect x="5" y="5" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 9H15V15H9V9Z" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.5 5C14.9 6.4 16 7.6 17.4 8.1C18.2 8.4 18.9 8.5 19.5 8.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M14.5 5V14.8C14.5 17.3 12.5 19.3 10 19.3C7.5 19.3 5.5 17.3 5.5 14.8C5.5 12.4 7.4 10.4 9.8 10.3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
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
      "tiktok-accounts": <TikTokIcon />,
      "business-centers": <GridIcon />,
      advertisers: <OverviewIcon />,
      pixels: <PulseIcon />,
      appeals: <QueueIcon />,
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

      <div className={styles.frame}>
        <aside className={styles.railLane} aria-label="Dashboard navigation">
          <div className={styles.railSticky}>
            <DockNav items={dockItems} activeId={activeDock} onSelect={handleDockSelect} />
          </div>
        </aside>

        <div className={styles.stage}>{children}</div>
      </div>
    </main>
  );
}
