import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import LiquidEther from "@/components/liquid-ether";
import { LiquidGlass } from "@/components/liquid-glass";
import {
  capabilityMetrics,
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

            <div className={styles.navRight}>
              <nav className={styles.navLinks} aria-label="Navegacao principal">
                {navItems.map((item) => (
                  <a key={item.href} href={item.href}>
                    {item.label}
                  </a>
                ))}
              </nav>

              <Link className={styles.navLogin} href="/login">
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className={styles.heroSection} id="top">
        <h1 className={styles.heroTitle} id="visao-geral">
          Controle <span>Business Centers</span>, criativos, pixels e
          campanhas em massa num unico sistema.
        </h1>
        <p className={styles.heroDescription}>
          A ArisHub foi criada para quem quer operar TikTok Ads com estrutura de
          verdade: Multi-BC, varias contas advertiser, bulk launch, mascarador
          de criativo, pixel hub, cloaker proprio e uma camada centralizada para
          a operacao inteira.
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
                Ver como a Aris escala
              </a>
            </LiquidGlass>

          <LiquidGlass
            className={`${styles.controlGlass} ${styles.controlLarge}`}
            contentClassName={styles.controlContent}
              interactive
              variant="pill"
            >
              <a className={styles.ghostControl} href="#casos">
                Conhecer os diferenciais
              </a>
            </LiquidGlass>
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
                  <strong>Offer Drop / Multi-BC / Creative Mask</strong>
                  <p>48 advertisers, 12 BCs, criativos organizados e mesma logica disparada em massa.</p>
                </div>

                <div className={styles.sidebarCard}>
                  <span className={styles.sidebarLabel}>Diferenciais reais</span>
                  <ul className={styles.sidebarList}>
                    <li>OAuth 2.0 isolado por advertiser</li>
                    <li>Mascarador de criativo e biblioteca operacional</li>
                    <li>Pixel hub, cloaker proprio e stack centralizada</li>
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
          <h2>Diferenciais que fazem a ArisHub valer mais que so um painel.</h2>
          <p>
            A proposta da ArisHub e simples: ser a camada que organiza, acelera
            e protege a sua operacao de TikTok Ads quando o volume comeca a subir.
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
          <h2>Feita para quem quer escalar sem depender de gambiarra.</h2>
          <p>
            A ArisHub nao foi desenhada para parecer tech. Ela foi desenhada para
            servir time de midia, estrutura interna e operacao high scale.
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
          <h2>Um fluxo so para conectar, preparar e escalar.</h2>
          <p>
            A experiencia da ArisHub e pensada para tirar a operacao do caos:
            conecta, organiza a stack e dispara em massa com visibilidade.
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
            <h2>Produto pensado para virar infraestrutura, nao so software bonito.</h2>
            <p>
              A ArisHub foi pensada para segurar operacao de verdade: conta,
              criativo, pixel, pagina, cloaker, fila e lancamento centralizados
              numa stack que pode crescer sem reescrever tudo.
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
                  Ver a visao geral
                </a>
              </LiquidGlass>

              <LiquidGlass
                className={`${styles.controlGlass} ${styles.controlLarge}`}
                contentClassName={styles.controlContent}
                interactive
                variant="pill"
              >
                <a className={styles.ghostControl} href="#recursos">
                  Explorar diferenciais
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
            <h2>A ArisHub nasce para ser o centro de comando da sua operacao de TikTok Ads.</h2>
            <p>
              Multi-BC, advertiser manager, pixel hub, bulk launch, mascarador
              de criativo e cloaker proprio num unico produto, com visual premium
              e stack pronta para escalar.
            </p>
          </div>
        </LiquidGlass>
      </section>
    </main>
  );
}
