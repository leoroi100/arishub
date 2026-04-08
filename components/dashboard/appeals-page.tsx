"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SpotlightCard } from "@/components/dashboard/spotlight-card";
import {
  parseIds,
  requestJson,
  type ReviewResultShape,
  type TikTokAdvertiserRecord,
  type TikTokConnectionRecord,
} from "@/components/dashboard/tiktok-api";
import styles from "./tiktok-ops.module.css";

type ReviewMode = "ads" | "materials";

export function AppealsPage() {
  const [connections, setConnections] = useState<TikTokConnectionRecord[]>([]);
  const [selectedConnectionId, setSelectedConnectionId] = useState("");
  const [advertisers, setAdvertisers] = useState<TikTokAdvertiserRecord[]>([]);
  const [selectedAdvertiserId, setSelectedAdvertiserId] = useState("");
  const [reviewMode, setReviewMode] = useState<ReviewMode>("ads");
  const [idsInput, setIdsInput] = useState("");
  const [lang, setLang] = useState("pt-BR");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReviewResultShape | null>(null);

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

  const loadAdvertisers = useCallback(async (connectionId: string) => {
    if (!connectionId) {
      setAdvertisers([]);
      setSelectedAdvertiserId("");
      return;
    }

    const rows = await requestJson<TikTokAdvertiserRecord[]>(
      `/api/tiktok/advertisers?connectionId=${connectionId}&sync=false`,
    );
    setAdvertisers(rows);

    const nextAdvertiserId =
      rows.find((item) => item.id === selectedAdvertiserId)?.id ?? rows[0]?.id ?? "";
    setSelectedAdvertiserId(nextAdvertiserId);
  }, [selectedAdvertiserId]);

  useEffect(() => {
    void (async () => {
      try {
        setError(null);
        const connectionId = await loadConnections();
        await loadAdvertisers(connectionId);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error ? caughtError.message : "Falha ao carregar apelos.",
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
        await loadAdvertisers(selectedConnectionId);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error ? caughtError.message : "Falha ao trocar conexao.",
        );
      }
    })();
  }, [loadAdvertisers, selectedConnectionId]);

  async function handleLookup() {
    const ids = parseIds(idsInput);

    if (!selectedConnectionId || !selectedAdvertiserId || ids.length === 0) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setResult(null);

      const query = new URLSearchParams({
        connectionId: selectedConnectionId,
        advertiserId: selectedAdvertiserId,
        lang,
      });

      const key = reviewMode === "ads" ? "smartPlusAdIds" : "materialIds";
      ids.forEach((id) => query.append(key, id));

      const response = await requestJson<ReviewResultShape>(
        `/api/tiktok/reviews?${query.toString()}`,
      );
      setResult(response);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "Falha ao consultar review.",
      );
    } finally {
      setSubmitting(false);
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

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Apelos</span>
          <h1>Review e operacao de apelos.</h1>
          <p>
            Central de consulta de review em massa e preparacao da camada de apelo
            operacional. Enquanto a app e aprovada, a tela ja fica pronta para o
            fluxo de ids, advertisers e leitura de resposta.
          </p>
        </div>

        <SpotlightCard
          className={styles.headerMeta}
          spotlightColor="rgba(207, 31, 63, 0.14)"
        >
          <span className={styles.headerMetaLabel}>Escopo atual</span>
          <strong>{selectedAdvertiser?.name ?? "Selecione advertiser e IDs"}</strong>
          <span className={styles.tableSubtle}>
            {selectedConnection?.label ?? "Sem conexao"} | modo{" "}
            {reviewMode === "ads" ? "review de ads" : "review de criativos"}
          </span>
        </SpotlightCard>
      </div>

      <div className={styles.summaryGrid}>
        <SpotlightCard className={styles.summaryCard} spotlightColor="rgba(207, 31, 63, 0.15)">
          <span>Conexoes</span>
          <strong>{connections.length}</strong>
          <p>Contas OAuth disponiveis para operar review e apelo.</p>
        </SpotlightCard>
        <SpotlightCard className={styles.summaryCard} spotlightColor="rgba(207, 31, 63, 0.15)">
          <span>Advertisers</span>
          <strong>{advertisers.length}</strong>
          <p>Escopos prontos para selecao do review em massa.</p>
        </SpotlightCard>
        <SpotlightCard className={styles.summaryCard} spotlightColor="rgba(207, 31, 63, 0.15)">
          <span>IDs no lote</span>
          <strong>{parseIds(idsInput).length}</strong>
          <p>Quantidade de ids preparada para consulta no lote atual.</p>
        </SpotlightCard>
      </div>

      {error ? (
        <SpotlightCard className={styles.noticeCard} spotlightColor="rgba(207, 31, 63, 0.1)">
          <h3>Falha no fluxo de review</h3>
          <p className={styles.error}>{error}</p>
        </SpotlightCard>
      ) : null}

      <div className={styles.splitGrid}>
        <SpotlightCard className={styles.splitCard} spotlightColor="rgba(207, 31, 63, 0.14)">
          <div>
            <span className={styles.eyebrow}>Consulta de review</span>
            <h3>Busque review info em massa.</h3>
            <p className={styles.tableSubtle}>
              Use essa tela para consultar review de Smart Plus ads ou materiais
              em lote com um advertiser selecionado.
            </p>
          </div>

          <div className={styles.formGrid}>
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

            <div className={styles.field}>
              <span>Tipo de consulta</span>
              <div className={styles.pillRow}>
                <button
                  type="button"
                  className={`${styles.pillButton} ${
                    reviewMode === "ads" ? styles.pillButtonActive : ""
                  }`}
                  onClick={() => setReviewMode("ads")}
                >
                  Ads
                </button>
                <button
                  type="button"
                  className={`${styles.pillButton} ${
                    reviewMode === "materials" ? styles.pillButtonActive : ""
                  }`}
                  onClick={() => setReviewMode("materials")}
                >
                  Criativos
                </button>
              </div>
            </div>

            <label className={styles.field}>
              <span>Idioma</span>
              <input value={lang} onChange={(event) => setLang(event.target.value)} />
            </label>

            <label className={styles.field}>
              <span>IDs do lote</span>
              <textarea
                value={idsInput}
                onChange={(event) => setIdsInput(event.target.value)}
                placeholder="Um ID por linha ou separado por virgula"
              />
            </label>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleLookup}
              disabled={
                loading ||
                submitting ||
                !selectedConnectionId ||
                !selectedAdvertiserId ||
                parseIds(idsInput).length === 0
              }
            >
              {submitting ? "Consultando..." : "Consultar review"}
            </button>
          </div>
        </SpotlightCard>

        <div className={styles.formGrid}>
          <SpotlightCard className={styles.resultCard} spotlightColor="rgba(207, 31, 63, 0.12)">
            <h3>Resposta da TikTok</h3>
            <p>
              Aqui entra o retorno bruto da consulta de review para voce avaliar o
              lote rapidamente.
            </p>
            <div className={styles.resultBox}>
              {result ? JSON.stringify(result, null, 2) : "Nenhuma consulta executada ainda."}
            </div>
          </SpotlightCard>

          <SpotlightCard className={styles.noticeCard} spotlightColor="rgba(207, 31, 63, 0.12)">
            <h3>Apelo em massa</h3>
            <p>
              A estrutura da pagina ja esta pronta para o modulo de apelos. O
              backend hoje ja consulta review info e possui operacao generica para
              Smart Plus appeal, mas a camada final de envio em massa vai ser
              ligada assim que a app estiver aprovada e o payload final validado.
            </p>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
