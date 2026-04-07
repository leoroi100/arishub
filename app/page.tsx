import { BrandMark } from "@/components/brand-mark";
import LiquidEther from "@/components/liquid-ether";
import { LiquidGlass } from "@/components/liquid-glass";
import {
  capabilityMetrics,
  heroSignals,
  heroTableRows,
  navItems,
  platformHighlights,
  portabilityPoints,
  setupSteps,
  useCases,
} from "@/lib/site-data";
import styles from "./page.module.css";

const statusClassMap = {
  success: styles.statusSuccess,
  warning: styles.statusWarning,
  neutral: styles.statusNeutral,
} as const;

export default function Home() {
  return (
    <main className={styles.page}>
      <div aria-hidden="true" className={styles.pageEther}>
        <LiquidEther
          autoDemo
          autoIntensity={3.4}
          autoSpeed={0.5}
          captureAllPointer
          colors={["#12070c", "#6f1634", "#d44474"]}
          cursorSize={170}
          isBounce={false}
          isViscous
          iterationsPoisson={32}
          iterationsViscous={32}
          mouseForce={42}
          pauseOnHover={false}
          resolution={0.5}
          viscous={30}
        />
      </div>
      <div aria-hidden="true" className={styles.pageEtherVeil} />
      <div aria-hidden="true" className={styles.pageGlow} />

      <header className={styles.navbar}>
        <div className={styles.navShell}>
          <div className={styles.navShellContent}>
            <a className={styles.brand} href="#top">
              <BrandMark />
              <span className={styles.brandText}>
                Aris<span>Hub</span>
              </span>
            </a>

            <nav className={styles.navLinks} aria-label="Navegacao principal">
              {navItems.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <section className={styles.heroSection} id="top">
        <LiquidGlass
          className={`${styles.eyebrowGlass} ${styles.controlAccent}`}
          contentClassName={styles.eyebrowContent}
          tone="accent"
          variant="pill"
        >
          <span className={styles.eyebrow}>Plataforma premium para TikTok Ads</span>
        </LiquidGlass>

        <h1 className={styles.heroTitle} id="visao-geral">
          Controle <span>Business Centers</span>, advertisers e campanhas em
          massa sem perder precisao.
        </h1>
        <p className={styles.heroDescription}>
          A ArisHub nasce para centralizar Multi-BC, OAuth 2.0, vault de tokens,
          pixels, criativos e lancamentos simultaneos numa operacao realmente
          organizada.
        </p>

        <div className={styles.heroActions}>
          <LiquidGlass
            className={`${styles.controlGlass} ${styles.controlLarge} ${styles.controlAccent}`}
            contentClassName={styles.controlContent}
            interactive
            tone="accent"
            variant="pill"
          >
            <a className={styles.primaryControl} href="#integracao">
              Comecar pela base
            </a>
          </LiquidGlass>

          <LiquidGlass
            className={`${styles.controlGlass} ${styles.controlLarge}`}
            contentClassName={styles.controlContent}
            interactive
            variant="pill"
          >
            <a className={styles.ghostControl} href="#casos">
              Ver casos de uso
            </a>
          </LiquidGlass>
        </div>

        <div className={styles.signalRow}>
          {heroSignals.map((signal) => (
            <LiquidGlass
              className={styles.signalGlass}
              contentClassName={styles.signalContent}
              key={signal}
              variant="pill"
            >
              <span className={styles.signalChip}>{signal}</span>
            </LiquidGlass>
          ))}
        </div>
      </section>

      <section className={styles.consoleSection}>
        <LiquidGlass
          className={styles.consoleGlass}
          contentClassName={styles.consoleGlassContent}
          variant="panel"
        >
          <div className={styles.consoleShell}>
            <div className={styles.consoleTopbar}>
              <div className={styles.consoleDots}>
                <span />
                <span />
                <span />
              </div>
              <span className={styles.consoleUrl}>launch.arishub.app</span>
              <span className={styles.consoleState}>Operacao ao vivo</span>
            </div>

            <div className={styles.consoleBody}>
              <div className={styles.consoleTable}>
                <div className={styles.tableHeader}>
                  <span>Campanha</span>
                  <span>Business Center</span>
                  <span>Status</span>
                </div>

                {heroTableRows.map((row) => (
                  <div className={styles.tableRow} key={row.name}>
                    <strong>{row.name}</strong>
                    <span>{row.bc}</span>
                    <span
                      className={`${styles.statusPill} ${
                        statusClassMap[row.statusTone as keyof typeof statusClassMap]
                      }`}
                    >
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>

              <aside className={styles.consoleSidebar}>
                <div className={styles.sidebarCard}>
                  <span className={styles.sidebarLabel}>Blueprint ativo</span>
                  <strong>Offer Drop / Full Multi-BC</strong>
                  <p>48 advertisers, 12 BCs e 1 logica de lancamento.</p>
                </div>

                <div className={styles.sidebarCard}>
                  <span className={styles.sidebarLabel}>Controle central</span>
                  <ul className={styles.sidebarList}>
                    <li>OAuth 2.0 isolado por advertiser</li>
                    <li>Token vault criptografado</li>
                    <li>Pixel manager integrado ao launch</li>
                  </ul>
                </div>

                <div className={styles.sidebarCard}>
                  <span className={styles.sidebarLabel}>Execucao</span>
                  <div className={styles.progressBlock}>
                    <div className={styles.progressTrack}>
                      <div className={styles.progressBar} />
                    </div>
                    <div className={styles.progressMeta}>
                      <span>72% distribuido</span>
                      <span>13 contas restantes</span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </LiquidGlass>
      </section>

      <section className={styles.metricsBar}>
        {capabilityMetrics.map((metric) => (
          <LiquidGlass
            className={styles.metricGlass}
            contentClassName={styles.metricGlassContent}
            key={metric.value}
            variant="panel"
          >
            <article className={styles.metricCard}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </article>
          </LiquidGlass>
        ))}
      </section>

      <section className={styles.section} id="recursos">
        <div className={styles.sectionHeading}>
          <span className={styles.sectionEyebrow}>Recursos</span>
          <h2>Recursos que seguram a operacao quando o volume sobe.</h2>
          <p>
            A proposta aqui e simples: menos improviso, mais controle. Cada
            modulo precisa servir a escala real da operacao no TikTok Ads.
          </p>
        </div>

        <div className={styles.highlightGrid}>
          {platformHighlights.map((item) => (
            <article className={styles.highlightCard} key={item.title}>
              <span className={styles.cardEyebrow}>{item.eyebrow}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="casos">
        <div className={styles.sectionHeading}>
          <span className={styles.sectionEyebrow}>Casos de uso</span>
          <h2>Estrutura pensada para quem vive de performance.</h2>
          <p>
            A ArisHub nao e so uma vitrine de API. Ela precisa servir time de
            midia, operacao e escala com clareza.
          </p>
        </div>

        <div className={styles.useCaseGrid}>
          {useCases.map((item) => (
            <article className={styles.useCaseCard} key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ul>
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="integracao">
        <div className={styles.sectionHeading}>
          <span className={styles.sectionEyebrow}>Integracao</span>
          <h2>Base pronta para conectar, organizar e lancar.</h2>
          <p>
            O fluxo da home ja espelha a logica do produto: conectar ativos,
            organizar estrutura e escalar a publicacao.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          {setupSteps.map((item) => (
            <article className={styles.stepCard} key={item.step}>
              <div className={styles.stepTop}>
                <span className={styles.stepNumber}>{item.step}</span>
                <span className={styles.stepLine} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <strong>{item.detail}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="arquitetura">
        <div className={styles.architecturePanel}>
          <div className={styles.architectureCopy}>
            <span className={styles.sectionEyebrow}>Arquitetura</span>
            <h2>Infra barata agora, produto preparado para crescer depois.</h2>
            <p>
              Vercel e Supabase entram como ponto de partida. A ArisHub nao vai
              ficar presa neles. O desenho atual ja esta orientado a adapters,
              dominio proprio e evolucao por etapas.
            </p>

            <div className={styles.heroActions}>
              <LiquidGlass
                className={`${styles.controlGlass} ${styles.controlLarge} ${styles.controlAccent}`}
                contentClassName={styles.controlContent}
                interactive
                tone="accent"
                variant="pill"
              >
                <a className={styles.primaryControl} href="#top">
                  Voltar ao topo
                </a>
              </LiquidGlass>

              <LiquidGlass
                className={`${styles.controlGlass} ${styles.controlLarge}`}
                contentClassName={styles.controlContent}
                interactive
                variant="pill"
              >
                <a className={styles.ghostControl} href="#recursos">
                  Revisar modulos
                </a>
              </LiquidGlass>
            </div>
          </div>

          <div className={styles.architectureGrid}>
            {portabilityPoints.map((item) => (
              <article className={styles.architectureCard} key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <LiquidGlass
          className={styles.ctaGlass}
          contentClassName={styles.ctaGlassContent}
          variant="panel"
        >
          <div className={styles.ctaPanel}>
            <span className={styles.sectionEyebrow}>ArisHub</span>
            <h2>A base agora esta mais proxima do nivel premium que esse produto precisa.</h2>
            <p>
              O proximo passo e transformar essa home em fluxo real de produto:
              auth, dashboard de BCs, advertisers, pixels e bulk launch.
            </p>
          </div>
        </LiquidGlass>
      </section>
    </main>
  );
}
