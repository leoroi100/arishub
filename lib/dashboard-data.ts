export const dashboardMetrics = [
  {
    label: "Advertisers ativos",
    value: 48,
    suffix: "+",
    detail: "Contas prontas para disparo em massa",
  },
  {
    label: "Business Centers",
    value: 12,
    suffix: "",
    detail: "Estruturas separadas com token vault",
  },
  {
    label: "Pixels vinculados",
    value: 126,
    suffix: "",
    detail: "Historico e vinculo por advertiser",
  },
  {
    label: "Criativos prontos",
    value: 312,
    suffix: "",
    detail: "Biblioteca com mask e reuso operacional",
  },
];

export const dashboardModules = [
  {
    eyebrow: "Launch Control",
    title: "Bulk launch com visao de lote e fila real",
    description:
      "Dispare a mesma estrutura em varios advertisers e BCs, com fila, retry, prioridade e status consolidado.",
    points: [
      "Fila separada por oferta, geo ou estrutura",
      "Logs de execucao e rastreio por lote",
      "Blueprint reaproveitavel com criativo, pixel e destino",
    ],
  },
  {
    eyebrow: "Creative Mask",
    title: "Mascarador de criativo e biblioteca central",
    description:
      "Organize variacoes, ativos, naming, aprovacao e historico de uso para subir criativo sem caos.",
    points: [
      "Variacoes com operacao por oferta",
      "Biblioteca pronta para review tracking",
      "Reuso rapido entre advertisers e equipes",
    ],
  },
  {
    eyebrow: "Pixel Hub",
    title: "Pixels, vinculos e tracking dentro do mesmo fluxo",
    description:
      "Gerencie criacao, vinculo, transferencia e historico de pixel no mesmo painel da operacao.",
    points: [
      "Pixel por advertiser, BC ou cliente",
      "Historico de vinculo e ownership",
      "Estrutura pronta para tracking stack privada",
    ],
  },
  {
    eyebrow: "Cloaker",
    title: "Cloaker proprio e camada privada de entrega",
    description:
      "Controle paginas, destinos e roteamento na mesma camada usada para subir as campanhas.",
    points: [
      "Estrutura centralizada por oferta",
      "Separacao entre operacao e ativos publicos",
      "Base pronta para automacao futura",
    ],
  },
];

export const dashboardQueue = [
  {
    label: "Offer Drop / Multi-BC / Creative Mask",
    progress: 72,
    status: "Em execucao",
    meta: "13 contas restantes",
  },
  {
    label: "Escala Q2 / Pixel rotation / BR",
    progress: 91,
    status: "Finalizando",
    meta: "2 revisoes pendentes",
  },
  {
    label: "Teste UGC / Agency Desk / MX",
    progress: 44,
    status: "Sincronizando",
    meta: "9 criativos em preparo",
  },
];

export const dashboardActivity = [
  {
    title: "OAuth conectado em BC Prime",
    time: "Ha 3 min",
    tone: "success",
  },
  {
    title: "Novo pixel vinculado em Agency Desk",
    time: "Ha 11 min",
    tone: "neutral",
  },
  {
    title: "Criativo mascarado enviado para biblioteca",
    time: "Ha 24 min",
    tone: "accent",
  },
  {
    title: "Review encontrado em Launch_Multi_48",
    time: "Ha 39 min",
    tone: "warning",
  },
];

export const dashboardDockItems = [
  { id: "overview", label: "Overview", href: "/dashboard" },
  { id: "tiktok-accounts", label: "Contas TikTok", href: "/dashboard/tiktok-accounts" },
  { id: "business-centers", label: "BCs", href: "/dashboard/business-centers" },
  { id: "advertisers", label: "Contas de anuncios", href: "/dashboard/advertisers" },
  { id: "pixels", label: "Pixels", href: "/dashboard/pixels" },
  { id: "appeals", label: "Apelos", href: "/dashboard/appeals" },
  { id: "logout", label: "Sair" },
];
