"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SpotlightCard } from "@/components/dashboard/spotlight-card";
import {
  requestJson,
  type TikTokBusinessCenterRecord,
  type TikTokConnectionRecord,
} from "@/components/dashboard/tiktok-api";
import styles from "./tiktok-ops.module.css";

export function BusinessCentersPage() {
  const [connections, setConnections] = useState<TikTokConnectionRecord[]>([]);
  const [selectedConnectionId, setSelectedConnectionId] = useState("");
  const [businessCenters, setBusinessCenters] = useState<TikTokBusinessCenterRecord[]>([]);
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

  const loadBusinessCenters = useCallback(async (connectionId: string, sync = false) => {
    if (!connectionId) {
      setBusinessCenters([]);
      return;
    }

    const rows = await requestJson<TikTokBusinessCenterRecord[]>(
      `/api/tiktok/business-centers?connectionId=${connectionId}&sync=${String(sync)}`,
    );
    setBusinessCenters(rows);
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        setError(null);
        const connectionId = await loadConnections();
        if (connectionId) {
          await loadBusinessCenters(connectionId, false);
        }
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Falha ao carregar Business Centers.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [loadBusinessCenters, loadConnections]);

  useEffect(() => {
    if (!selectedConnectionId) {
      return;
    }

    void (async () => {
      try {
        setError(null);
        await loadBusinessCenters(selectedConnectionId, false);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Falha ao trocar a conexao.",
        );
      }
    })();
  }, [loadBusinessCenters, selectedConnectionId]);

  async function handleRefresh() {
    if (!selectedConnectionId) {
      return;
    }

    try {
      setSyncing(true);
      setError(null);
      await loadBusinessCenters(selectedConnectionId, true);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Falha ao sincronizar os BCs.",
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
      return businessCenters;
    }

    return businessCenters.filter((item) =>
      `${item.name} ${item.id}`.toLowerCase().includes(term),
    );
  }, [businessCenters, search]);

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>BCs</span>
          <h1>Business Centers.</h1>
          <p>
            Painel para visualizar as estruturas de Business Center sincronizadas
            por conexao. O foco aqui e leitura rapida, filtro claro e sync direto.
          </p>
        </div>

        <SpotlightCard
          className={styles.headerMeta}
          spotlightColor="rgba(207, 31, 63, 0.14)"
        >
          <span className={styles.headerMetaLabel}>Conexao ativa</span>
          <strong>{selectedConnection?.label ?? "Nenhuma conexao selecionada"}</strong>
          <span className={styles.tableSubtle}>
            {selectedConnection
              ? `${businessCenters.length} BCs carregados nesta leitura.`
              : "Conecte uma conta TikTok primeiro para listar os BCs."}
          </span>
        </SpotlightCard>
      </div>

      <div className={styles.summaryGrid}>
        <SpotlightCard className={styles.summaryCard} spotlightColor="rgba(207, 31, 63, 0.15)">
          <span>Total de BCs</span>
          <strong>{businessCenters.length}</strong>
          <p>Estruturas encontradas na conexao selecionada.</p>
        </SpotlightCard>

        <SpotlightCard className={styles.summaryCard} spotlightColor="rgba(207, 31, 63, 0.15)">
          <span>Conexoes</span>
          <strong>{connections.length}</strong>
          <p>Fontes TikTok disponiveis para alternar a leitura.</p>
        </SpotlightCard>

        <SpotlightCard className={styles.summaryCard} spotlightColor="rgba(207, 31, 63, 0.15)">
          <span>Resultado filtrado</span>
          <strong>{filteredRows.length}</strong>
          <p>Quantidade que bate com o termo digitado no filtro.</p>
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
          <span>Buscar BC</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nome ou ID do Business Center"
          />
        </label>

        <div className={styles.toolbarHint}>
          Troque de conexao para analisar outra estrutura ou sincronize para puxar
          a leitura mais recente da TikTok API.
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
          <h3>Carregando Business Centers...</h3>
          <p>A ArisHub esta buscando os BCs salvos e sincronizados.</p>
        </SpotlightCard>
      ) : !selectedConnectionId ? (
        <SpotlightCard className={styles.emptyCard} spotlightColor="rgba(207, 31, 63, 0.1)">
          <h3>Nenhuma conexao TikTok encontrada.</h3>
          <p>Primeiro conecte uma conta na aba Contas TikTok para listar os BCs.</p>
        </SpotlightCard>
      ) : (
        <SpotlightCard className={styles.tableCard} spotlightColor="rgba(207, 31, 63, 0.12)">
          <div className={styles.tableHeader}>
            <div>
              <h2>Business Centers sincronizados</h2>
              <p>Lista organizada para leitura e selecao operacional.</p>
            </div>
            <span className={styles.tableMeta}>{filteredRows.length} resultados</span>
          </div>

          {filteredRows.length === 0 ? (
            <div className={styles.emptyCard}>
              <h3>Nenhum BC encontrado.</h3>
              <p>Ajuste o filtro ou execute uma nova sincronizacao.</p>
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Business Center</th>
                    <th>ID</th>
                    <th>Conexao</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className={styles.tablePrimary}>
                          <strong>{item.name}</strong>
                          <span>Estrutura pronta para mapeamento operacional</span>
                        </div>
                      </td>
                      <td>{item.id}</td>
                      <td>{selectedConnection?.label ?? "-"}</td>
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
