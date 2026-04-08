import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder";

export default function DashboardActivityPage() {
  return (
    <DashboardPlaceholder
      eyebrow="Pulse"
      title="Pulse feed da operacao em tempo real."
      description="Essa area vai centralizar eventos importantes da stack: conexoes OAuth, pixels, review, apelos, atualizacao de criativos, fila e logs de automacao."
      points={[
        "Timeline com eventos relevantes da operacao inteira.",
        "Alertas de review, falha, reconnect e mudanca de status.",
        "Leitura rapida para saber o que aconteceu sem abrir cada modulo.",
      ]}
    />
  );
}
