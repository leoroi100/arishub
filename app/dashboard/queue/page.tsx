import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder";

export default function DashboardQueuePage() {
  return (
    <DashboardPlaceholder
      eyebrow="Fila"
      title="Fila operacional e distribuicao de disparos."
      description="Essa pagina vai concentrar lotes, prioridade, retry, falhas, status de sync e a sequencia real de publicacao entre Business Centers e advertisers."
      points={[
        "Visao por lote, oferta, advertiser e BC.",
        "Controle de prioridade e retentativa por automacao.",
        "Historico completo da fila para a operacao nao perder contexto.",
      ]}
    />
  );
}
