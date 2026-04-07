export const navItems = [
  { label: "Visao Geral", href: "#visao-geral" },
  { label: "Recursos", href: "#recursos" },
  { label: "Casos de Uso", href: "#casos" },
  { label: "Integracao", href: "#integracao" },
  { label: "Arquitetura", href: "#arquitetura" },
];

export const heroSignals = [
  "OAuth 2.0 com isolamento por conta",
  "Multi-BC com gestao centralizada",
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
  { value: "Multi-BC", label: "Operacao nativa para multiplos Business Centers" },
  { value: "OAuth 2.0", label: "Autorizacao segura para advertisers e assets" },
  { value: "Pixel Hub", label: "Gestao centralizada de pixels e vinculos" },
  { value: "Bulk Launch", label: "Mesma estrutura publicada em varias contas" },
];

export const platformHighlights = [
  {
    eyebrow: "Escala",
    title: "Campanhas em massa com a mesma logica de lancamento",
    description:
      "Blueprints prontos para replicar campanhas, conjuntos e anuncios em varias contas sem perder rastreio.",
    points: [
      "Distribuicao simultanea por advertiser e BC",
      "Fila com retries, status e trilha de execucao",
      "Escolha de pixel, criativo e destino por lote",
    ],
  },
  {
    eyebrow: "Controle",
    title: "Command center para Business Centers e advertisers",
    description:
      "Uma camada unica para visualizar estrutura, ownership, permissoes, health e ativos conectados.",
    points: [
      "Mapa de BCs, advertisers e membros",
      "Permissoes e ownership organizados",
      "Preparado para auditoria operacional",
    ],
  },
  {
    eyebrow: "Assets",
    title: "Pixel manager e creative desk no mesmo fluxo",
    description:
      "Pixels, criativos e status de review vivem no mesmo sistema para reduzir ruido na operacao.",
    points: [
      "Criacao, vinculo e transferencia de pixels",
      "Biblioteca de assets e historico de uso",
      "Base pronta para appeal e review tracking",
    ],
  },
  {
    eyebrow: "Seguranca",
    title: "Vault de tokens com isolamento por conta",
    description:
      "Tokens e credenciais sensiveis organizados por advertiser, com renovacao e acesso controlado.",
    points: [
      "Envelope por BC e advertiser",
      "Rotacao segura e escopos explicitos",
      "Arquitetura pronta para criptografia forte",
    ],
  },
];

export const useCases = [
  {
    title: "Agencias",
    description:
      "Centralize multiplos clientes, contas e BCs sem misturar ativos nem permissoes.",
    bullets: [
      "Separacao por cliente",
      "Equipe com acesso granular",
      "Visao consolidada de operacao",
    ],
  },
  {
    title: "Media Buyers",
    description:
      "Launch rapido, menos retrabalho e uma camada real para organizar campanhas em escala.",
    bullets: [
      "Blueprints reaproveitaveis",
      "Pixels e criativos no mesmo fluxo",
      "Lotes por oferta, geo ou conta",
    ],
  },
  {
    title: "Operacoes internas",
    description:
      "Padronize processos, monitore health e reduza gargalos entre time de criacao e time de midia.",
    bullets: [
      "Status operacional centralizado",
      "Historico por acao e usuario",
      "Base pronta para automacoes",
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
      "Mapeie assets, dominios e criativos antes do lancamento para reduzir erro operacional.",
    detail: "Tudo centralizado num desk so.",
  },
  {
    step: "03",
    title: "Dispare campanhas em escala",
    description:
      "Use blueprints para publicar a mesma logica em varias contas com rastreio de ponta a ponta.",
    detail: "Fila, status e visao de execucao por lote.",
  },
];

export const portabilityPoints = [
  {
    title: "Dominio desacoplado",
    description:
      "A regra da ArisHub fica no core do produto, nao presa a hospedagem nem ao banco escolhido agora.",
  },
  {
    title: "Infra trocavel",
    description:
      "Vercel e Supabase entram como stack inicial barata, mas podem ser trocados sem reescrever a aplicacao.",
  },
  {
    title: "Pronto para escalar",
    description:
      "Quando volume, fila e workers dedicados fizerem sentido, a plataforma cresce sem quebrar a base.",
  },
];
