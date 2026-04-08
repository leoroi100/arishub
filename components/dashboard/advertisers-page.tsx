"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SpotlightCard } from "@/components/dashboard/spotlight-card";
import {
  requestJson,
  type TikTokAdvertiserRecord,
  type TikTokConnectionRecord,
} from "@/components/dashboard/tiktok-api";
import styles from "./tiktok-ops.module.css";

export function AdvertisersPage() {
  const [connections, setConnections] = useState<TikTokConnectionRecord[]>([]);
  const [selectedConnectionId, setSelectedConnectionId] = useState("");
  const [advertisers, setAdvertisers] = useState<TikTokAdvertiserRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConnections = useCallback(async () => {
    const nextConnections = await requestJson<TikTokConnectionRecord[]>(
      "/api/tiktok/connections",
    );
    setConnections(nextConnections);

    if (!selectedConnectionId && nextConnections[0]) {
      setSelectedConnectionId(nextConnections[0].id);
      return nextConnections[0].id;
    }

    return selectedConnectionId || nextConnections[0]?.id || "";
  }, [selectedConnectionId]);

  const loadAdvertisers = useCallback(async (connectionId: string, sync = false) => {
    if (!connectionId) {
      setAdvertisers([]);
      return;
    }

    const rows = await requestJson<TikTokAdvertiserRecord[]>(
      `/api/tiktok/advertisers?connectionId=${connectionId}&sync=${String(sync)}`,
    );
    setAdvertisers(rows);
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        setError(null);
        const connectionId = await loadConnections();
        if (connectionId) {
          await loadAdvertisers(connectionId, false);
        }
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Falha ao carregar advertisers.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [loadAdvertisers, loadConnections]);

  useEffect(() => {
    if (!selectedConnectionId) {
      return;
    }

    void (async () => {
      try {
        setError(null);
        await loadAdvertisers(selectedConnectionId, false);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Falha ao trocar a conexao.",
        );
      }
    })();
  }, [loadAdvertisers, selectedConnectionId]);

  async function handleRefresh() {
    if (!selectedConnectionId) {
      return;
    }

    try {
      setSyncing(true);
      setError(null);
      await loadAdvertisers(selectedConnectionId, true);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Falha ao sincronizar advertisers.",
      );
    } finally {
      setSyncing(false);
    }
  }

  const selectedConnection = useMemo(
    () => connections.find((item) => item.id === selectedConnectionId) ?? null,
    [connections, selectedConnectionId],
  );

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return advertisers;
    }

    return advertisers.filter((item) =>
      `${item.name} ${item.id} ${item.businessCenterId ?? ""}`
        .toLowerCase()
        .includes(term),
    );
  }, [advertisers, search]);

  const activeCount = useMemo(
    () => advertisers.filter((item) => item.status?.toLowerCase() !== "disable").length,
    [advertisers],
  );

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Contas de anuncios</span>
          <h1>Advertisers conectados.</h1>
          <p>
            Visao completa das contas de anuncio autorizadas pela conexao atual,
            com foco em leitura rapida, status e analise operacional.
          </p>
        </div>

        <SpotlightCard
          className={styles.headerMeta}
          spotlightColor="rgba(207, 31, 63, 0.14)"
        >
          <span className={styles.headerMetaLabel}>Conexao ativa</span>
          <strong>{selectedConnection?.label ?? "Nenhuma conexao selecionada"}</strong>
          <span className={styles.tableSubtle}>
            {advertisers.length} contas de anuncio carregadas para esta leitura.
          </span>
        </SpotlightCard>
      </div>

      <div className={styles.summaryGrid}>
        <SpotlightCard className={styles.summaryCard} spotlightColor="rgba(207, 31, 63, 0.15)">
          <span>Advertisers</span>
          <strong>{advertisers.length}</strong>
          <p>Total bruto de contas encontradas na conexao.</p>
        </SpotlightCard>
        <SpotlightCard className={styles.summaryCard} spotlightColor="rgba(207, 31, 63, 0.15)">
          <span>Ativos</span>
          <strong>{activeCount}</strong>
          <p>Contas com status operacional diferente de disable.</p>
        </SpotlightCard>
        <SpotlightCard className={styles.summaryCard} spotlightColor="rgba(207, 31, 63, 0.15)">
          <span>Filtrados</span>
          <strong>{filteredRows.length}</strong>
          <p>Linhas restantes depois da busca por nome, ID ou BC.</p>
        </SpotlightCard>
      </div>

      <SpotlightCard className={styles.toolbar} spotlightColor="rgba(207, 31, 63, 0.14)">
        <label className={styles.field}>
          <span>Conexao TikTok</span>
          <select
            value={selectedConnectionId}
            onChange={(event) => setSelectedConnectionId(event.target.value)}
          >
            {connections.length === 0 ? <option value="">Sem conexoes</option> : null}
            {connections.map((connection) => (
              <option key={connection.id} value={connection.id}>
                {connection.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Buscar advertiser</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nome, advertiser ID ou BC"
          />
        </label>

        <div className={styles.toolbarHint}>
          Essa tela vai virar a base de selecao das contas para pixels, bulk
          launch, criativos e operacao de massa.
        </div>

        <button
          type="button"
          className={styles.primaryButton}
          onClick={handleRefresh}
          disabled={!selectedConnectionId || syncing}
        >
          {syncing ? "Atualizando..." : "Atualizar"}
        </button>
      </SpotlightCard>

      {error ? (
        <SpotlightCard className={styles.noticeCard} spotlightColor="rgba(207, 31, 63, 0.1)">
          <h3>Falha na leitura</h3>
          <p className={styles.error}>{error}</p>
        </SpotlightCard>
      ) : null}

      {loading ? (
        <SpotlightCard className={styles.emptyCard} spotlightColor="rgba(207, 31, 63, 0.1)">
          <h3>Carregando contas de anuncios...</h3>
          <p>Aguarde enquanto a ArisHub organiza os advertisers da conexao.</p>
        </SpotlightCard>
      ) : !selectedConnectionId ? (
        <SpotlightCard className={styles.emptyCard} spotlightColor="rgba(207, 31, 63, 0.1)">
          <h3>Nenhuma conexao TikTok encontrada.</h3>
          <p>Conecte uma conta primeiro para listar as contas de anuncios.</p>
        </SpotlightCard>
      ) : (
        <SpotlightCard className={styles.tableCard} spotlightColor="rgba(207, 31, 63, 0.12)">
          <div className={styles.tableHeader}>
            <div>
              <h2>Contas de anuncios autorizadas</h2>
              <p>Advertisers agrupados por conexao e prontos para operacao.</p>
            </div>
            <span className={styles.tableMeta}>{filteredRows.length} contas</span>
          </div>

          {filteredRows.length === 0 ? (
            <div className={styles.emptyCard}>
              <h3>Nenhuma conta de anuncio encontrada.</h3>
              <p>Ajuste a busca ou execute uma nova sincronizacao.</p>
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Advertiser</th>
                    <th>BC</th>
                    <th>Status</th>
                    <th>Timezone</th>
                    <th>Moeda</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className={styles.tablePrimary}>
                          <strong>{item.name}</strong>
                          <span>{item.id}</span>
                        </div>
                      </td>
                      <td>{item.businessCenterId ?? "Sem BC vinculado"}</td>
                      <td>
                        <span className={`${styles.status} ${styles.statusGood}`}>
                          <span className={styles.statusDot} />
                          {item.status ?? "Ativa"}
                        </span>
                      </td>
                      <td>{item.timezone ?? "-"}</td>
                      <td>{item.currency ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SpotlightCard>
      )}
    </section>
  );
}
