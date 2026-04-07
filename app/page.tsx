import { BrandMark } from "@/components/brand-mark";
import { FeatureCard } from "@/components/feature-card";
import { GlassPill } from "@/components/glass-pill";
import {
  architectureLayers,
  controlSignals,
  launchSequence,
  platformModules,
  portabilityRules,
} from "@/lib/site-data";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.ambientHalo} />

      <section className={styles.chrome} id="top">
        <header className={styles.nav}>
          <a className={styles.brand} href="#top">
            <BrandMark />
            <span className={styles.brandText}>ArisHub</span>
          </a>

          <nav className={styles.navLinks} aria-label="Navegacao principal">
            <a href="#modulos">Modulos</a>
            <a href="#arquitetura">Arquitetura</a>
            <a href="#escala">Escala</a>
          </nav>

          <a className={styles.navAction} href="#arquitetura">
            Ver base
          </a>
        </header>

        <div className={styles.hero}>
          <div className={styles.heroCopy}>
            <GlassPill>Control Tower para TikTok Ads em escala</GlassPill>

            <h1 className={styles.heroTitle}>
              Opera <span>BCs</span>, advertisers, pixels e lancamentos em massa
              numa camada premium.
            </h1>

            <p className={styles.heroLead}>
              A base da ArisHub nasce para organizar Multi-BC, vault de tokens,
              criativos, pixels e bulk launch sem prender o produto a um unico
              provedor de infra.
            </p>

            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href="#modulos">
                Explorar modulos
              </a>
              <a className={styles.secondaryAction} href="#arquitetura">
                Ver arquitetura portavel
              </a>
            </div>

            <div className={styles.signalGrid}>
              {controlSignals.map((signal) => (
                <article className={styles.signalCard} key={signal.label}>
                  <span>{signal.label}</span>
                  <strong>{signal.value}</strong>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.heroPanel} aria-hidden="true">
            <div className={styles.heroPanelTop}>
              <div className={styles.panelTag}>ArisHub Core</div>
              <div className={styles.panelStatus}>
                <span className={styles.panelStatusDot} />
                Sync operacional ativo
              </div>
            </div>

            <div className={styles.panelSplit}>
              <section className={styles.commandDeck}>
                <header className={styles.sectionLabel}>Bulk Launch Engine</header>
                <div className={styles.commandCard}>
                  <div>
                    <span className={styles.commandLabel}>Launch blueprint</span>
                    <strong>Creative Burst / Q2 Main Offer</strong>
                  </div>
                  <span className={styles.commandMeta}>48 advertisers</span>
                </div>
                <div className={styles.commandRows}>
                  {launchSequence.map((step) => (
                    <div className={styles.commandRow} key={step.title}>
                      <div className={styles.commandPulse} />
                      <div>
                        <strong>{step.title}</strong>
                        <span>{step.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className={styles.assetPanel}>
                <header className={styles.sectionLabel}>Asset Control</header>
                <div className={styles.assetList}>
                  <div className={styles.assetItem}>
                    <span>Pixels vinculados</span>
                    <strong>94 assets sincronizados</strong>
                  </div>
                  <div className={styles.assetItem}>
                    <span>Creative review watch</span>
                    <strong>7 itens em observacao</strong>
                  </div>
                  <div className={styles.assetItem}>
                    <span>Token vault</span>
                    <strong>Rotacao e refresh isolados</strong>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.metricsStrip}>
        {architectureLayers.map((layer) => (
          <article className={styles.metricCard} key={layer.title}>
            <span>{layer.kicker}</span>
            <strong>{layer.title}</strong>
            <p>{layer.description}</p>
          </article>
        ))}
      </section>

      <section className={styles.section} id="modulos">
        <div className={styles.sectionHeader}>
          <GlassPill>Modulo por modulo</GlassPill>
          <h2>O nucleo da ArisHub ja nasce pensado para escalar operacao.</h2>
          <p>
            O produto vai crescer em cima de dominio claro, automacao e
            rastreabilidade. Infra barata no inicio, regra de negocio protegida
            desde o primeiro commit.
          </p>
        </div>

        <div className={styles.featureGrid}>
          {platformModules.map((module) => (
            <FeatureCard key={module.title} {...module} />
          ))}
        </div>
      </section>

      <section className={styles.section} id="arquitetura">
        <div className={styles.sectionHeader}>
          <GlassPill>Arquitetura portavel</GlassPill>
          <h2>Vercel e Supabase entram como fase inicial, nao como prisao.</h2>
          <p>
            A ideia aqui e simples: usar o melhor do plano gratis agora, sem
            enterrar a ArisHub num desenho que te force a reescrever tudo quando
            o volume apertar.
          </p>
        </div>

        <div className={styles.architecturePanel}>
          <div className={styles.architectureGrid}>
            {portabilityRules.map((rule) => (
              <article className={styles.architectureCard} key={rule.title}>
                <span>{rule.kicker}</span>
                <strong>{rule.title}</strong>
                <p>{rule.description}</p>
              </article>
            ))}
          </div>

          <div className={styles.commandRail}>
            <div className={styles.railCard}>
              <span className={styles.railLabel}>Agora</span>
              <strong>Next.js + TypeScript + banco gratuito</strong>
              <p>
                Entrega rapida, auth simples, storage e deploy sem custo alto.
              </p>
            </div>
            <div className={styles.railCard}>
              <span className={styles.railLabel}>Depois</span>
              <strong>Swap de adapters sem quebrar dominio</strong>
              <p>
                Filas, workers dedicados, novo banco ou novo host entram sem
                redefinir os modulos da plataforma.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="escala">
        <div className={styles.sectionHeader}>
          <GlassPill>Escala guiada</GlassPill>
          <h2>A jornada de implementacao ja esta pronta para a v1.</h2>
          <p>
            A tela inicial resolve a presenca premium. A estrutura de codigo ja
            abre caminho para o painel, o vault e a orquestracao de campanha.
          </p>
        </div>

        <div className={styles.timeline}>
          <article className={styles.timelineCard}>
            <span>Fase 01</span>
            <strong>Foundation</strong>
            <p>
              Branding premium, layout responsivo, separacao de dominio e base
              pronta para auth, banco e APIs.
            </p>
          </article>
          <article className={styles.timelineCard}>
            <span>Fase 02</span>
            <strong>Control Tower</strong>
            <p>
              Dashboard de BCs, advertisers, pixels, ativos e tokens com trilha
              de auditoria.
            </p>
          </article>
          <article className={styles.timelineCard}>
            <span>Fase 03</span>
            <strong>Bulk Ops Engine</strong>
            <p>
              Templates, filas, retries, distribuicao em massa e monitoramento
              de status por conta, BC e criativo.
            </p>
          </article>
        </div>
      </section>

      <footer className={styles.footer}>
        <div>
          <span className={styles.footerTag}>ArisHub</span>
          <p>
            Base premium para o hub de TikTok Ads que voce quer escalar de
            verdade.
          </p>
        </div>
        <a className={styles.footerAction} href="#top">
          Voltar ao topo
        </a>
      </footer>
    </main>
  );
}
