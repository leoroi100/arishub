import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder";

export default function DashboardModulesPage() {
  return (
    <DashboardPlaceholder
      eyebrow="Modulos"
      title="Arquitetura de modulos operacionais."
      description="Aqui entra a visao detalhada de cada modulo da ArisHub: BC manager, advertiser control, pixel hub, creative mask, cloaker e bulk launch."
      points={[
        "Mapa completo dos modulos ativos e dependencias operacionais.",
        "Status por camada da stack antes de subir campanhas em massa.",
        "Base pronta para ligar os modulos reais sem redesenhar a experiencia.",
      ]}
    />
  );
}
