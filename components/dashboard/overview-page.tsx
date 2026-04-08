"use client";

import { useMemo, useState } from "react";
import { SpotlightCard } from "@/components/dashboard/spotlight-card";
import styles from "./overview-page.module.css";

type PeriodKey = "today" | "yesterday" | "sevenDays" | "thirtyDays" | "custom";

interface MetricsShape {
  spend: number;
  cpa: number;
  cpc: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

const businessCenters = [
  { value: "all", label: "Todas as Business Centers", factor: 1 },
  { value: "bc-prime", label: "BC Prime", factor: 0.46 },
  { value: "agency-desk", label: "Agency Desk", factor: 0.28 },
  { value: "scale-hub", label: "Scale Hub", factor: 0.17 },
  { value: "holding", label: "BC Holding", factor: 0.22 },
];

const periodOptions: Array<{ value: PeriodKey; label: string }> = [
  { value: "today", label: "Hoje" },
  { value: "yesterday", label: "Ontem" },
  { value: "sevenDays", label: "7 dias" },
  { value: "thirtyDays", label: "30 dias" },
  { value: "custom", label: "Personalizado" },
];

const baseMetricsByPeriod: Record<Exclude<PeriodKey, "custom">, MetricsShape> = {
  today: {
    spend: 2840,
    cpa: 18.4,
    cpc: 1.92,
    impressions: 128430,
    clicks: 1476,
    conversions: 154,
  },
  yesterday: {
    spend: 3194,
    cpa: 20.1,
    cpc: 2.04,
    impressions: 136950,
    clicks: 1566,
    conversions: 159,
  },
  sevenDays: {
    spend: 18644,
    cpa: 19.3,
    cpc: 1.88,
    impressions: 922470,
    clicks: 9912,
    conversions: 966,
  },
  thirtyDays: {
    spend: 78320,
    cpa: 21.1,
    cpc: 1.97,
    impressions: 3824130,
    clicks: 39870,
    conversions: 3710,
  },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCurrencyDecimal(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatInteger(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function getDateDiffInDays(startDate: string, endDate: string) {
  if (!startDate || !endDate) {
    return 7;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1;

  return Math.max(diff, 1);
}

function buildCustomMetrics(days: number): MetricsShape {
  const reference = baseMetricsByPeriod.sevenDays;
  const multiplier = days / 7;

  return {
    spend: reference.spend * multiplier,
    cpa: Math.max(11.8, reference.cpa - Math.min(days, 14) * 0.09),
    cpc: Math.max(1.2, reference.cpc - Math.min(days, 14) * 0.03),
    impressions: Math.round(reference.impressions * multiplier),
    clicks: Math.round(reference.clicks * multiplier),
    conversions: Math.round(reference.conversions * multiplier),
  };
}

function applyBusinessCenterFactor(metrics: MetricsShape, factor: number): MetricsShape {
  return {
    spend: metrics.spend * factor,
    cpa: metrics.cpa,
    cpc: metrics.cpc,
    impressions: Math.round(metrics.impressions * factor),
    clicks: Math.round(metrics.clicks * factor),
    conversions: Math.round(metrics.conversions * factor),
  };
}

function getPeriodLabel(period: PeriodKey, startDate: string, endDate: string) {
  if (period !== "custom") {
    return periodOptions.find((item) => item.value === period)?.label ?? "7 dias";
  }

  if (!startDate || !endDate) {
    return "Personalizado";
  }

  return `${new Date(startDate).toLocaleDateString("pt-BR")} - ${new Date(
    endDate,
  ).toLocaleDateString("pt-BR")}`;
}

export function OverviewPage() {
  const [draftBusinessCenter, setDraftBusinessCenter] = useState("all");
  const [draftPeriod, setDraftPeriod] = useState<PeriodKey>("sevenDays");
  const [draftStartDate, setDraftStartDate] = useState("");
  const [draftEndDate, setDraftEndDate] = useState("");

  const [appliedBusinessCenter, setAppliedBusinessCenter] = useState("all");
  const [appliedPeriod, setAppliedPeriod] = useState<PeriodKey>("sevenDays");
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState(() =>
    new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  );

  const selectedBusinessCenter = useMemo(
    () =>
      businessCenters.find((item) => item.value === appliedBusinessCenter) ??
      businessCenters[0],
    [appliedBusinessCenter],
  );

  const draftDatesIncomplete =
    draftPeriod === "custom" && (!draftStartDate || !draftEndDate);

  const metrics = useMemo(() => {
    const baseMetrics =
      appliedPeriod === "custom"
        ? buildCustomMetrics(getDateDiffInDays(appliedStartDate, appliedEndDate))
        : baseMetricsByPeriod[appliedPeriod];

    return applyBusinessCenterFactor(baseMetrics, selectedBusinessCenter.factor);
  }, [
    appliedEndDate,
    appliedPeriod,
    appliedStartDate,
    selectedBusinessCenter.factor,
  ]);

  const metricCards = [
    {
      label: "Gastos",
      value: formatCurrency(metrics.spend),
      detail: "Investimento total consolidado no recorte selecionado.",
    },
    {
      label: "CPA",
      value: formatCurrencyDecimal(metrics.cpa),
      detail: "Custo medio por aquisicao ou conversao registrada.",
    },
    {
      label: "CPC",
      value: formatCurrencyDecimal(metrics.cpc),
      detail: "Custo medio por clique na estrutura agregada.",
    },
    {
      label: "Impressoes",
      value: formatInteger(metrics.impressions),
      detail: "Volume total de entrega somado entre advertisers.",
    },
    {
      label: "Cliques",
      value: formatInteger(metrics.clicks),
      detail: "Cliques consolidados no periodo filtrado.",
    },
    {
      label: "Conversoes",
      value: formatInteger(metrics.conversions),
      detail: "Conversoes totais da visao selecionada.",
    },
  ];

  function handleApplyFilters() {
    if (draftDatesIncomplete) {
      return;
    }

    setAppliedBusinessCenter(draftBusinessCenter);
    setAppliedPeriod(draftPeriod);
    setAppliedStartDate(draftStartDate);
    setAppliedEndDate(draftEndDate);
    setLastUpdatedAt(
      new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerCopy}>
          <span className={styles.eyebrow}>Overview</span>
          <h1>Dashboard</h1>
          <p>Metricas agregadas por Business Center e periodo.</p>
        </div>

        <SpotlightCard
          className={styles.headerMeta}
          spotlightColor="rgba(207, 31, 63, 0.14)"
        >
          <span className={styles.headerMetaLine}>
            {selectedBusinessCenter.label} |{" "}
            {getPeriodLabel(appliedPeriod, appliedStartDate, appliedEndDate)}
          </span>
          <strong>Atualizado as {lastUpdatedAt}</strong>
        </SpotlightCard>
      </div>

      <SpotlightCard className={styles.filters} spotlightColor="rgba(207, 31, 63, 0.16)">
        <label className={styles.field}>
          <span>Business Center</span>
          <select
            value={draftBusinessCenter}
            onChange={(event) => setDraftBusinessCenter(event.target.value)}
          >
            {businessCenters.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.field}>
          <span>Periodo</span>
          <div className={styles.periods}>
            {periodOptions.map((item) => (
              <button
                key={item.value}
                type="button"
                className={`${styles.periodButton} ${
                  draftPeriod === item.value ? styles.periodButtonActive : ""
                }`}
                onClick={() => setDraftPeriod(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {draftPeriod === "custom" ? (
          <>
            <label className={styles.field}>
              <span>Data inicial</span>
              <input
                type="date"
                value={draftStartDate}
                onChange={(event) => setDraftStartDate(event.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span>Data final</span>
              <input
                type="date"
                value={draftEndDate}
                onChange={(event) => setDraftEndDate(event.target.value)}
              />
            </label>
          </>
        ) : null}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.updateButton}
            onClick={handleApplyFilters}
            disabled={draftDatesIncomplete}
          >
            Atualizar
          </button>
          <span className={styles.actionHint}>
            {draftPeriod === "custom"
              ? "Defina as duas datas para aplicar."
              : "Atualize para recalcular os agregados."}
          </span>
        </div>
      </SpotlightCard>

      <div className={styles.metricsGrid}>
        {metricCards.map((metric) => (
          <SpotlightCard
            className={styles.metricCard}
            key={metric.label}
            spotlightColor="rgba(207, 31, 63, 0.18)"
          >
            <div className={styles.metricTop}>
              <span>{metric.label}</span>
              <span className={styles.metricDot} />
            </div>
            <strong>{metric.value}</strong>
            <p>{metric.detail}</p>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}
