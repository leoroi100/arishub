"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SpotlightCard } from "@/components/dashboard/spotlight-card";
import {
  formatDateTime,
  requestJson,
  type TikTokAdvertiserRecord,
  type TikTokBusinessCenterRecord,
  type TikTokConfigState,
  type TikTokConnectionRecord,
} from "@/components/dashboard/tiktok-api";
import styles from "./tiktok-ops.module.css";

interface ConnectionStats {
  advertisers: number;
  businessCenters: number;
  syncedAt: string;
}

interface OAuthStartResponse {
  authorizationUrl: string;
}

export function TikTokAccountsPage() {
  const searchParams = useSearchParams();
  const [config, setConfig] = useState<TikTokConfigState | null>(null);
  const [connections, setConnections] = useState<TikTokConnectionRecord[]>([]);
  const [stats, setStats] = useState<Record<string, ConnectionStats>>({});
  const [label, setLabel] = useState("ArisHub Main");
  const [loading, setLoading] = useState(true);
  const [syncingAll, setSyncingAll] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [busyConnectionId, setBusyConnectionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadConnectionStats = useCallback(async (connectionId: string, sync = false) => {
    const [advertisers, businessCenters] = await Promise.all([
      requestJson<TikTokAdvertiserRecord[]>(
        `/api/tiktok/advertisers?connectionId=${connectionId}&sync=${String(sync)}`,
      ),
      requestJson<TikTokBusinessCenterRecord[]>(
        `/api/tiktok/business-centers?connectionId=${connectionId}&sync=${String(sync)}`,
      ),
    ]);

    return {
      advertisers: advertisers.length,
      businessCenters: businessCenters.length,
      syncedAt: new Date().toISOString(),
    } satisfies ConnectionStats;
  }, []);

  const loadConnections = useCallback(async (sync = false) => {
    setError(null);

    const [configState, connectionRows] = await Promise.all([
      requestJson<TikTokConfigState>("/api/tiktok/config"),
      requestJson<TikTokConnectionRecord[]>("/api/tiktok/connections"),
    ]);

    setConfig(configState);
    setConnections(connectionRows);

    const statEntries = await Promise.all(
      connectionRows.map(async (connection) => [
        connection.id,
        await loadConnectionStats(connection.id, sync),
      ]),
    );

    setStats(Object.fromEntries(statEntries));
  }, [loadConnectionStats]);

  useEffect(() => {
    void (async () => {
      try {
        await loadConnections(false);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Falha ao carregar conexoes TikTok.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [loadConnections]);

  async function handleConnect() {
    try {
      setConnecting(true);
      setError(null);
      const data = await requestJson<OAuthStartResponse>(
        `/api/tiktok/oauth/start?redirectTo=/dashboard/tiktok-accounts&label=${encodeURIComponent(
          label.trim() || "ArisHub Main",
        )}`,
      );
      window.location.href = data.authorizationUrl;
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Falha ao iniciar o OAuth da TikTok.",
      );
      setConnecting(false);
    }
  }

  async function handleSyncConnection(connectionId: string) {
    try {
      setBusyConnectionId(connectionId);
      setError(null);
      const nextStats = await loadConnectionStats(connectionId, true);
      setStats((current) => ({
        ...current,
        [connectionId]: nextStats,
      }));
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Falha ao sincronizar a conexao.",
      );
    } finally {
      setBusyConnectionId(null);
    }
  }

  async function handleSyncAll() {
    try {
      setSyncingAll(true);
      setError(null);
      await loadConnections(true);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Falha ao sincronizar as conexoes.",
      );
    } finally {
      setSyncingAll(false);
    }
  }

  const totals = useMemo(() => {
    return Object.values(stats).reduce(
      (accumulator, item) => ({
        advertisers: accumulator.advertisers + item.advertisers,
        businessCenters: accumulator.businessCenters + item.businessCenters,
      }),
      { advertisers: 0, businessCenters: 0 },
    );
  }, [stats]);

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Contas TikTok</span>
          <h1>Conexoes TikTok Ads.</h1>
          <p>
            Aqui voce conecta, identifica e gerencia as contas TikTok autorizadas
            pela app. Quando o OAuth estiver aprovado, esse painel vira a porta
            de entrada de toda a operacao.
          </p>
        </div>

        <SpotlightCard
          className={styles.headerMeta}
          spotlightColor="rgba(207, 31, 63, 0.14)"
        >
          <span className={styles.headerMetaLabel}>Status da stack</span>
          <strong>
            {config?.tiktokConfigured
              ? "TikTok API configurada para OAuth."
              : "Falta finalizar a configuracao da TikTok API."}
          </strong>
          <span className={styles.tableSubtle}>
            {searchParams.get("tiktok") === "connected"
              ? "Nova conexao recebida via callback."
              : "A app pode ser aprovada enquanto a UI operacional ja fica pronta."}
          </span>
        </SpotlightCard>
      </div>

      <div className={styles.summaryGrid}>
        <SpotlightCard className={styles.summaryCard} spotlightColor="rgba(207, 31, 63, 0.15)">
          <span>Conexoes</span>
          <strong>{connections.length}</strong>
          <p>Contas OAuth cadastradas e prontas para sincronizar estruturas.</p>
        </SpotlightCard>

        <SpotlightCard className={styles.summaryCard} spotlightColor="rgba(207, 31, 63, 0.15)">
          <span>Advertisers</span>
          <strong>{totals.advertisers}</strong>
          <p>Contas de anuncios encontradas nas conexoes ja criadas.</p>
        </SpotlightCard>

        <SpotlightCard className={styles.summaryCard} spotlightColor="rgba(207, 31, 63, 0.15)">
          <span>Business Centers</span>
          <strong>{totals.businessCenters}</strong>
          <p>Estruturas de BC sincronizadas no banco da ArisHub.</p>
        </SpotlightCard>
      </div>

      <SpotlightCard className={styles.toolbarSingle} spotlightColor="rgba(207, 31, 63, 0.14)">
        <label className={styles.field}>
          <span>Rotulo da conexao</span>
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Ex.: Agency Desk Main"
          />
        </label>

        <div className={styles.toolbarHint}>
          Use um rotulo claro para identificar a conexao no painel. Depois do
          OAuth, a ArisHub vai carregar advertisers e BCs ligados a esse acesso.
        </div>

        <div className={styles.inlineButtons}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleConnect}
            disabled={connecting || !config?.tiktokConfigured}
          >
            {connecting ? "Redirecionando..." : "Conectar via OAuth"}
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={handleSyncAll}
            disabled={syncingAll || connections.length === 0}
          >
            {syncingAll ? "Sincronizando..." : "Sincronizar tudo"}
          </button>
        </div>
      </SpotlightCard>

      {error ? (
        <SpotlightCard className={styles.noticeCard} spotlightColor="rgba(207, 31, 63, 0.1)">
          <h3>Falha na operacao</h3>
          <p className={styles.error}>{error}</p>
        </SpotlightCard>
      ) : null}

      {loading ? (
        <SpotlightCard className={styles.emptyCard} spotlightColor="rgba(207, 31, 63, 0.1)">
          <h3>Carregando conexoes...</h3>
          <p>Aguarde enquanto a ArisHub consulta o vault e a estrutura salva.</p>
        </SpotlightCard>
      ) : connections.length === 0 ? (
        <SpotlightCard className={styles.emptyCard} spotlightColor="rgba(207, 31, 63, 0.1)">
          <h3>Nenhuma conta TikTok conectada.</h3>
          <p>
            Assim que a app TikTok for aprovada, voce podera iniciar o OAuth aqui
            e trazer as contas para dentro da ArisHub.
          </p>
        </SpotlightCard>
      ) : (
        <SpotlightCard className={styles.tableCard} spotlightColor="rgba(207, 31, 63, 0.12)">
          <div className={styles.tableHeader}>
            <div>
              <h2>Conexoes autorizadas</h2>
              <p>Mapa de contas TikTok autenticadas pela plataforma.</p>
            </div>
            <span className={styles.tableMeta}>{connections.length} contas</span>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Conta</th>
                  <th>Status</th>
                  <th>Advertisers</th>
                  <th>BCs</th>
                  <th>Criada em</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {connections.map((connection) => {
                  const connectionStats = stats[connection.id];

                  return (
                    <tr key={connection.id}>
                      <td>
                        <div className={styles.tablePrimary}>
                          <strong>{connection.label}</strong>
                          <span>{connection.id}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.status} ${styles.statusGood}`}>
                          <span className={styles.statusDot} />
                          Ativa
                        </span>
                      </td>
                      <td>{connectionStats?.advertisers ?? 0}</td>
                      <td>{connectionStats?.businessCenters ?? 0}</td>
                      <td>{formatDateTime(connection.createdAt)}</td>
                      <td>
                        <div className={styles.rowActions}>
                          <button
                            type="button"
                            className={styles.ghostButton}
                            onClick={() => handleSyncConnection(connection.id)}
                            disabled={busyConnectionId === connection.id}
                          >
                            {busyConnectionId === connection.id ? "Sincronizando..." : "Sync"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SpotlightCard>
      )}
    </section>
  );
}
