export const controlSignals = [
  {
    label: "Modo operacional",
    value: "Multi-BC native",
  },
  {
    label: "Nucleo de seguranca",
    value: "Token vault isolado",
  },
  {
    label: "Motor principal",
    value: "Bulk launch orquestrado",
  },
];

export const architectureLayers = [
  {
    kicker: "Camada 01",
    title: "Dominio primeiro",
    description:
      "Business rules da ArisHub separadas de auth, banco, queue e host.",
  },
  {
    kicker: "Camada 02",
    title: "Adapters trocaveis",
    description:
      "Supabase pode iniciar o jogo, mas nao define o formato do produto.",
  },
  {
    kicker: "Camada 03",
    title: "Operacao auditavel",
    description:
      "Cada token, pixel, advertiser e launch fica pronto para rastreio.",
  },
  {
    kicker: "Camada 04",
    title: "Escala progressiva",
    description:
      "A plataforma pode subir de nivel sem reescrever o core quando crescer.",
  },
];

export const platformModules = [
  {
    kicker: "Control",
    title: "Multi-BC Command",
    description:
      "Mapa central de Business Centers, advertisers, owners, assets e permissoes com visao premium de operacao.",
    bullets: [
      "Onboarding de contas com OAuth 2.0",
      "Separacao de acesso por BC, advertiser e operador",
      "Leitura pronta para auditoria de ativos e ownership",
    ],
  },
  {
    kicker: "Security",
    title: "Advertiser Vault",
    description:
      "Cofre de credenciais e tokens para manter refresh, isolamento e seguranca sem gambiarra.",
    bullets: [
      "Envelope de token por conta e BC",
      "Rotacao e refresh controlados",
      "Base pronta para criptografia e logs de acesso",
    ],
  },
  {
    kicker: "Pixels",
    title: "Pixel Control",
    description:
      "Gerenciamento dedicado de pixels, vinculos, ownership e distribuicao entre estruturas.",
    bullets: [
      "Criacao, vinculacao e transferencias",
      "Mapa de associacao por advertiser",
      "Preparado para health check e alertas de tracking",
    ],
  },
  {
    kicker: "Creatives",
    title: "Creative Review Desk",
    description:
      "Biblioteca para criativos e acompanhamento de review, status e historico de distribuicao.",
    bullets: [
      "Versionamento por asset e campanha",
      "Status operacional para aprovacao e bloqueios",
      "Base para fluxo de appeal e evidence pack",
    ],
  },
  {
    kicker: "Scale",
    title: "Bulk Launch Engine",
    description:
      "O motor principal da plataforma: publicar a mesma estrutura em varias contas e BCs sem perder controle.",
    bullets: [
      "Blueprints reutilizaveis de campanha",
      "Fila por advertiser com retry e visibilidade",
      "Controle fino por criativo, pixel e destino",
    ],
  },
  {
    kicker: "Ops",
    title: "Trust and Audit Layer",
    description:
      "Trilha de decisao, risco e historico para deixar a operacao forte quando escalar time e budget.",
    bullets: [
      "Eventos centralizados de operacao",
      "Historico por conta, usuario e acao",
      "Base pronta para health score da estrutura",
    ],
  },
];

export const portabilityRules = [
  {
    kicker: "Produto",
    title: "A regra mora no core da ArisHub",
    description:
      "Fluxo de BC, advertiser, pixel, creative e launch vive em modulos internos, nao em funcoes coladas no provedor.",
  },
  {
    kicker: "Infra",
    title: "Provider vira adapter, nao fundacao",
    description:
      "Banco, auth, storage e queue entram por interfaces substituiveis para voce evoluir sem refazer a plataforma.",
  },
  {
    kicker: "Deploy",
    title: "Hospedagem troca, dominio continua",
    description:
      "Vercel hoje resolve deploy rapido. Amanhã pode virar outro runtime com a mesma camada de aplicacao.",
  },
  {
    kicker: "Escala",
    title: "Workers e jobs entram quando fizer sentido",
    description:
      "A v1 pode operar enxuta. Quando o volume pedir, a fila e os workers dedicados entram por extensao controlada.",
  },
];

export const launchSequence = [
  {
    title: "Selecionar blueprint",
    description: "Campanha, conjunto, anuncio e criativo reutilizaveis.",
  },
  {
    title: "Resolver assets",
    description: "Pixel, landing, ownership e tokens antes do disparo.",
  },
  {
    title: "Distribuir por fila",
    description: "Execucao segmentada por advertiser e BC com rastreio.",
  },
];
