"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import LiquidEther from "@/components/liquid-ether";
import { DockNav, type DockNavItem } from "@/components/dashboard/dock-nav";
import { MetricCounter } from "@/components/dashboard/metric-counter";
import { SpotlightCard } from "@/components/dashboard/spotlight-card";
import {
  dashboardActivity,
  dashboardDockItems,
  dashboardMetrics,
  dashboardModules,
  dashboardQueue,
} from "@/lib/dashboard-data";
import { getBrowserSupabase } from "@/lib/supabase/client";
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
  userEmail: string;
}

export function DashboardShell({ userEmail }: DashboardShellProps) {
  const router = useRouter();
  const [activeDock, setActiveDock] = useState("overview");
  const [isSigningOut, setIsSigningOut] = useState(false);

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
    setIsSigningOut(true);

    try {
      await getBrowserSupabase().auth.signOut();
      router.replace("/login");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  }

  function handleDockSelect(id: string) {
    setActiveDock(id);

    if (id === "logout") {
      void handleSignOut();
      return;
    }

    const target = document.getElementById(id);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

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

      <header className={styles.header}>
        <div className={styles.brandWrap}>
          <BrandMark />
          <div>
            <span className={styles.brandName}>
              Aris<span>Hub</span>
            </span>
            <p className={styles.brandCaption}>Dashboard de operacao TikTok Ads</p>
          </div>
        </div>

        <div className={styles.headerMeta}>
          <div className={styles.headerStatus}>
            <span className={styles.statusDot} />
            Stack online
          </div>
          <div className={styles.userCard}>
            <span className={styles.userLabel}>Sessao ativa</span>
            <strong>{userEmail}</strong>
          </div>
          <button
            type="button"
            className={styles.signOutButton}
            onClick={() => void handleSignOut()}
            disabled={isSigningOut}
          >
            {isSigningOut ? "Saindo..." : "Sair"}
          </button>
        </div>
      </header>

      <section className={styles.hero} id="overview">
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>ArisHub OS</span>
          <h1>O centro de comando para Multi-BC, pixels, criativos e launch em massa.</h1>
          <p>
            Essa dashboard foi desenhada para virar a camada operacional da sua
            escala: controle de advertisers, biblioteca de criativos,
            mascarador, pixel hub, cloaker proprio e fila de publicacao numa
            interface premium, clara e feita para volume.
          </p>

          <div className={styles.heroPills}>
            <span>OAuth isolado</span>
            <span>Creative Mask</span>
            <span>Pixel Hub</span>
            <span>Cloaker proprio</span>
          </div>
        </div>

        <SpotlightCard className={styles.heroPanel}>
          <span className={styles.panelEyebrow}>Live Control</span>
          <h2>Offer Drop / Multi-BC / Q2 Scale</h2>
          <p>
            48 advertisers sincronizados, 12 BCs ativos e uma fila unica
            cuidando do disparo, dos criativos e da stack de tracking.
          </p>

          <div className={styles.heroPanelGrid}>
            <div>
              <strong>72%</strong>
              <span>Distribuido</span>
            </div>
            <div>
              <strong>13</strong>
              <span>Contas restantes</span>
            </div>
            <div>
              <strong>9</strong>
              <span>Creatives masked</span>
            </div>
            <div>
              <strong>3</strong>
              <span>Reviews em radar</span>
            </div>
          </div>
        </SpotlightCard>
      </section>

      <section className={styles.metricsSection}>
        {dashboardMetrics.map((metric) => (
          <MetricCounter key={metric.label} {...metric} />
        ))}
      </section>

      <section className={styles.section} id="modules">
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>Modulos</span>
          <h2>Ferramentas que explicam o valor real da ArisHub.</h2>
          <p>
            Nao e so um painel. E a interface da sua infraestrutura operacional
            para escalar TikTok Ads de um jeito organizado e agressivo.
          </p>
        </div>

        <div className={styles.moduleGrid}>
          {dashboardModules.map((module) => (
            <SpotlightCard key={module.title} className={styles.moduleCard}>
              <span className={styles.panelEyebrow}>{module.eyebrow}</span>
              <h3>{module.title}</h3>
              <p>{module.description}</p>
              <ul className={styles.moduleList}>
                {module.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </SpotlightCard>
          ))}
        </div>
      </section>

      <section className={styles.bottomSection}>
        <SpotlightCard className={styles.queueCard}>
          <div className={styles.cardHeader}>
            <div>
              <span className={styles.panelEyebrow}>Fila operacional</span>
              <h3 id="queue">Lotes, status e prioridade de disparo</h3>
            </div>
            <span className={styles.inlineStatus}>Workers online</span>
          </div>

          <div className={styles.queueList}>
            {dashboardQueue.map((item) => (
              <article className={styles.queueItem} key={item.label}>
                <div className={styles.queueTop}>
                  <strong>{item.label}</strong>
                  <span>{item.status}</span>
                </div>
                <div className={styles.queueTrack}>
                  <div
                    className={styles.queueBar}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <div className={styles.queueMeta}>
                  <span>{item.progress}% concluido</span>
                  <span>{item.meta}</span>
                </div>
              </article>
            ))}
          </div>
        </SpotlightCard>

        <SpotlightCard className={styles.activityCard}>
          <div className={styles.cardHeader}>
            <div>
              <span className={styles.panelEyebrow}>Pulse feed</span>
              <h3 id="activity">O que aconteceu na stack agora</h3>
            </div>
            <span className={styles.inlineStatus}>Tempo real</span>
          </div>

          <div className={styles.activityList}>
            {dashboardActivity.map((item) => (
              <article className={styles.activityItem} key={item.title}>
                <span
                  className={`${styles.activityDot} ${
                    item.tone === "success"
                      ? styles.toneSuccess
                      : item.tone === "warning"
                        ? styles.toneWarning
                        : item.tone === "accent"
                          ? styles.toneAccent
                          : styles.toneNeutral
                  }`}
                />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.time}</span>
                </div>
              </article>
            ))}
          </div>
        </SpotlightCard>
      </section>

      <DockNav items={dockItems} activeId={activeDock} onSelect={handleDockSelect} />
    </main>
  );
}
