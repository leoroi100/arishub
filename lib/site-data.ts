export const navItems = [
  { label: "Visão Geral", href: "#visao-geral" },
  { label: "Recursos", href: "#recursos" },
  { label: "Casos de Uso", href: "#casos" },
  { label: "Integração", href: "#integracao" },
  { label: "Arquitetura", href: "#arquitetura" },
];

export const heroSignals = [
  "OAuth 2.0 com isolamento por conta",
  "Multi-BC com gestão centralizada",
  "Vault de tokens criptografados",
];

export const heroTableRows = [
  {
    name: "Scale_BR_Main",
    bc: "BC Prime",
    status: "Ativo",
    statusTone: "success",
  },
  {
    name: "UGC_Offer_07",
    bc: "Agency Desk",
    status: "Review",
    statusTone: "warning",
  },
  {
    name: "Retarget_Q2",
    bc: "BC Holding",
    status: "Ativo",
    statusTone: "success",
  },
  {
    name: "Launch_Multi_48",
    bc: "Scale Hub",
    status: "Sincronizando",
    statusTone: "neutral",
  },
];

export const capabilityMetrics = [
  { value: "Multi-BC", label: "Operação nativa para múltiplos Business Centers" },
  { value: "OAuth 2.0", label: "Autorização segura para advertisers e assets" },
  { value: "Pixel Hub", label: "Gestão centralizada de pixels e vínculos" },
  { value: "Bulk Launch", label: "Mesma estrutura publicada em várias contas" },
];

export const platformHighlights = [
  {
    eyebrow: "Escala",
    title: "Campanhas em massa com a mesma lógica de lançamento",
    description:
      "Blueprints prontos para replicar campanhas, conjuntos e anúncios em várias contas sem perder rastreio.",
    points: [
      "Distribuição simultânea por advertiser e BC",
      "Fila com retries, status e trilha de execução",
      "Escolha de pixel, criativo e destino por lote",
    ],
  },
  {
    eyebrow: "Controle",
    title: "Command center para Business Centers e advertisers",
    description:
      "Uma camada única para visualizar estrutura, ownership, permissões, health e ativos conectados.",
    points: [
      "Mapa de BCs, advertisers e membros",
      "Permissões e ownership organizados",
      "Preparado para auditoria operacional",
    ],
  },
  {
    eyebrow: "Assets",
    title: "Pixel manager e creative desk no mesmo fluxo",
    description:
      "Pixels, criativos e status de review vivem no mesmo sistema para reduzir ruído na operação.",
    points: [
      "Criação, vínculo e transferência de pixels",
      "Biblioteca de assets e histórico de uso",
      "Base pronta para appeal e review tracking",
    ],
  },
  {
    eyebrow: "Segurança",
    title: "Vault de tokens com isolamento por conta",
    description:
      "Tokens e credenciais sensíveis organizados por advertiser, com renovação e acesso controlado.",
    points: [
      "Envelope por BC e advertiser",
      "Rotação segura e escopos explícitos",
      "Arquitetura pronta para criptografia forte",
    ],
  },
];

export const useCases = [
  {
    title: "Agências",
    description:
      "Centralize múltiplos clientes, contas e BCs sem misturar ativos nem permissões.",
    bullets: [
      "Separação por cliente",
      "Equipe com acesso granular",
      "Visão consolidada de operação",
    ],
  },
  {
    title: "Media Buyers",
    description:
      "Launch rápido, menos retrabalho e uma camada real para organizar campanhas em escala.",
    bullets: [
      "Blueprints reaproveitáveis",
      "Pixels e criativos no mesmo fluxo",
      "Lotes por oferta, geo ou conta",
    ],
  },
  {
    title: "Operações internas",
    description:
      "Padronize processos, monitore health e reduza gargalos entre time de criação e time de mídia.",
    bullets: [
      "Status operacional centralizado",
      "Histórico por ação e usuário",
      "Base pronta para automações",
    ],
  },
];

export const setupSteps = [
  {
    step: "01",
    title: "Conecte seus ativos",
    description:
      "Autorize advertisers e Business Centers com OAuth 2.0 e prepare a base de tokens.",
    detail: "Fluxo seguro, pronto para isolamento por estrutura.",
  },
  {
    step: "02",
    title: "Organize pixels e criativos",
    description:
      "Mapeie assets, domínios e criativos antes do lançamento para reduzir erro operacional.",
    detail: "Tudo centralizado num desk só.",
  },
  {
    step: "03",
    title: "Dispare campanhas em escala",
    description:
      "Use blueprints para publicar a mesma lógica em várias contas com rastreio de ponta a ponta.",
    detail: "Fila, status e visão de execução por lote.",
  },
];

export const portabilityPoints = [
  {
    title: "Domínio desacoplado",
    description:
      "A regra da ArisHub fica no core do produto, não presa à hospedagem nem ao banco escolhido agora.",
  },
  {
    title: "Infra trocável",
    description:
      "Vercel e Supabase entram como stack inicial barata, mas podem ser trocados sem reescrever a aplicação.",
  },
  {
    title: "Pronto para escalar",
    description:
      "Quando volume, fila e workers dedicados fizerem sentido, a plataforma cresce sem quebrar a base.",
  },
];
