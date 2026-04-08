"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SpotlightCard } from "@/components/dashboard/spotlight-card";
import {
  requestJson,
  type TikTokAdvertiserRecord,
  type TikTokConnectionRecord,
  type TikTokPixelRecord,
} from "@/components/dashboard/tiktok-api";
import styles from "./tiktok-ops.module.css";

export function PixelsPage() {
  const [connections, setConnections] = useState<TikTokConnectionRecord[]>([]);
  const [selectedConnectionId, setSelectedConnectionId] = useState("");
  const [advertisers, setAdvertisers] = useState<TikTokAdvertiserRecord[]>([]);
  const [selectedAdvertiserId, setSelectedAdvertiserId] = useState("");
  const [pixels, setPixels] = useState<TikTokPixelRecord[]>([]);
  const [search, setSearch] = useState("");
  const [pixelName, setPixelName] = useState("");
  const [pixelCategory, setPixelCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [creating, setCreating] = useState(false);
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
      setSelectedAdvertiserId("");
      return "";
    }

    const rows = await requestJson<TikTokAdvertiserRecord[]>(
      `/api/tiktok/advertisers?connectionId=${connectionId}&sync=${String(sync)}`,
    );
    setAdvertisers(rows);

    const nextAdvertiserId =
      rows.find((item) => item.id === selectedAdvertiserId)?.id ?? rows[0]?.id ?? "";
    setSelectedAdvertiserId(nextAdvertiserId);
    return nextAdvertiserId;
  }, [selectedAdvertiserId]);

  const loadPixels = useCallback(async (connectionId: string, advertiserId: string, sync = false) => {
    if (!connectionId || !advertiserId) {
      setPixels([]);
      return;
    }

    const rows = await requestJson<TikTokPixelRecord[]>(
      `/api/tiktok/pixels?connectionId=${connectionId}&advertiserId=${advertiserId}&sync=${String(sync)}`,
    );
    setPixels(rows);
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        setError(null);
        const connectionId = await loadConnections();
        const advertiserId = await loadAdvertisers(connectionId, false);
        await loadPixels(connectionId, advertiserId, false);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error ? caughtError.message : "Falha ao carregar pixels.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [loadAdvertisers, loadConnections, loadPixels]);

  useEffect(() => {
    if (!selectedConnectionId) {
      return;
    }

    void (async () => {
      try {
        setError(null);
        const advertiserId = await loadAdvertisers(selectedConnectionId, false);
        await loadPixels(selectedConnectionId, advertiserId, false);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error ? caughtError.message : "Falha ao trocar conexao.",
        );
      }
    })();
  }, [loadAdvertisers, loadPixels, selectedConnectionId]);

  useEffect(() => {
    if (!selectedConnectionId || !selectedAdvertiserId) {
      return;
    }

    void (async () => {
      try {
        setError(null);
        await loadPixels(selectedConnectionId, selectedAdvertiserId, false);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error ? caughtError.message : "Falha ao trocar advertiser.",
        );
      }
    })();
  }, [loadPixels, selectedAdvertiserId, selectedConnectionId]);

  async function handleRefresh() {
    if (!selectedConnectionId) {
      return;
    }

    try {
      setSyncing(true);
      setError(null);
      const advertiserId = await loadAdvertisers(selectedConnectionId, true);
      await loadPixels(selectedConnectionId, advertiserId, true);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "Falha ao atualizar pixels.",
      );
    } finally {
      setSyncing(false);
    }
  }

  async function handleCreatePixel() {
    if (!selectedConnectionId || !selectedAdvertiserId || !pixelName.trim()) {
      return;
    }

    try {
      setCreating(true);
      setError(null);
      await requestJson<Record<string, unknown>>("/api/tiktok/pixels", {
        method: "POST",
        body: JSON.stringify({
          connectionId: selectedConnectionId,
          advertiserId: selectedAdvertiserId,
          pixelName: pixelName.trim(),
          pixelCategory: pixelCategory.trim() || undefined,
        }),
      });
      setPixelName("");
      setPixelCategory("");
      await loadPixels(selectedConnectionId, selectedAdvertiserId, true);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "Falha ao criar pixel.",
      );
    } finally {
      setCreating(false);
    }
  }

  const selectedConnection = useMemo(
    () => connections.find((item) => item.id === selectedConnectionId) ?? null,
    [connections, selectedConnectionId],
  );
  const selectedAdvertiser = useMemo(
    () => advertisers.find((item) => item.id === selectedAdvertiserId) ?? null,
    [advertisers, selectedAdvertiserId],
  );

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return pixels;
    }

    return pixels.filter((item) =>
      `${item.name} ${item.id} ${item.code ?? ""}`.toLowerCase().includes(term),
    );
  }, [pixels, search]);

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Pixels</span>
          <h1>Pixel hub operacional.</h1>
          <p>
            Leitura e criacao de pixels por advertiser, com fluxo preparado para
            vinculo, transferencia e organizacao centralizada da stack.
          </p>
        </div>

        <SpotlightCard
          className={styles.headerMeta}
          spotlightColor="rgba(207, 31, 63, 0.14)"
        >
          <span className={styles.headerMetaLabel}>Escopo atual</span>
          <strong>{selectedAdvertiser?.name ?? "Escolha um advertiser"}</strong>
          <span className={styles.tableSubtle}>
            {selectedConnection?.label ?? "Sem conexao"} | {pixels.length} pixels carregados
          </span>
        </SpotlightCard>
      </div>

      <div className={styles.summaryGrid}>
        <SpotlightCard className={styles.summaryCard} spotlightColor="rgba(207, 31, 63, 0.15)">
          <span>Pixels</span>
          <strong>{pixels.length}</strong>
          <p>Total carregado no advertiser selecionado.</p>
        </SpotlightCard>
        <SpotlightCard className={styles.summaryCard} spotlightColor="rgba(207, 31, 63, 0.15)">
          <span>Advertisers</span>
          <strong>{advertisers.length}</strong>
          <p>Contas de anuncio disponiveis para navegar no pixel hub.</p>
        </SpotlightCard>
        <SpotlightCard className={styles.summaryCard} spotlightColor="rgba(207, 31, 63, 0.15)">
          <span>Filtrados</span>
          <strong>{filteredRows.length}</strong>
          <p>Quantidade restante depois da busca local.</p>
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
          <span>Advertiser</span>
          <select
            value={selectedAdvertiserId}
            onChange={(event) => setSelectedAdvertiserId(event.target.value)}
          >
            {advertisers.length === 0 ? <option value="">Sem advertisers</option> : null}
            {advertisers.map((advertiser) => (
              <option key={advertiser.id} value={advertiser.id}>
                {advertiser.name}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Buscar pixel</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nome, pixel ID ou codigo"
          />
        </label>

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
          <h3>Falha no pixel hub</h3>
          <p className={styles.error}>{error}</p>
        </SpotlightCard>
      ) : null}

      <div className={styles.splitGrid}>
        <SpotlightCard className={styles.tableCard} spotlightColor="rgba(207, 31, 63, 0.12)">
          <div className={styles.tableHeader}>
            <div>
              <h2>Pixels do advertiser</h2>
              <p>Biblioteca de pixels ja encontrada para o escopo atual.</p>
            </div>
            <span className={styles.tableMeta}>{filteredRows.length} pixels</span>
          </div>

          {loading ? (
            <div className={styles.emptyCard}>
              <h3>Carregando pixels...</h3>
              <p>Aguarde enquanto a ArisHub consulta o advertiser atual.</p>
            </div>
          ) : !selectedConnectionId || !selectedAdvertiserId ? (
            <div className={styles.emptyCard}>
              <h3>Selecione conexao e advertiser.</h3>
              <p>O pixel hub depende de um advertiser definido para listar os pixels.</p>
            </div>
          ) : filteredRows.length === 0 ? (
            <div className={styles.emptyCard}>
              <h3>Nenhum pixel encontrado.</h3>
              <p>Crie um novo pixel ao lado ou rode uma sincronizacao manual.</p>
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Pixel</th>
                    <th>ID</th>
                    <th>Codigo</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((pixel) => (
                    <tr key={pixel.id}>
                      <td>
                        <div className={styles.tablePrimary}>
                          <strong>{pixel.name}</strong>
                          <span>Pronto para vinculo e operacao</span>
                        </div>
                      </td>
                      <td>{pixel.id}</td>
                      <td>{pixel.code ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SpotlightCard>

        <SpotlightCard className={styles.splitCard} spotlightColor="rgba(207, 31, 63, 0.14)">
          <div>
            <span className={styles.eyebrow}>Criar pixel</span>
            <h3>Novo pixel no advertiser atual.</h3>
            <p className={styles.tableSubtle}>
              Use essa lateral para abrir a criacao basica enquanto o resto do
              fluxo operacional vai sendo ligado.
            </p>
          </div>

          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Nome do pixel</span>
              <input
                value={pixelName}
                onChange={(event) => setPixelName(event.target.value)}
                placeholder="Ex.: Pixel Main BR"
              />
            </label>

            <label className={styles.field}>
              <span>Categoria</span>
              <input
                value={pixelCategory}
                onChange={(event) => setPixelCategory(event.target.value)}
                placeholder="Opcional"
              />
            </label>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleCreatePixel}
              disabled={!selectedConnectionId || !selectedAdvertiserId || !pixelName.trim() || creating}
            >
              {creating ? "Criando..." : "Criar pixel"}
            </button>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
