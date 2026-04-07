export const navItems = [
  { label: "Visao Geral", href: "#visao-geral" },
  { label: "Diferenciais", href: "#recursos" },
  { label: "Para Quem", href: "#casos" },
  { label: "Como Funciona", href: "#integracao" },
  { label: "Infra", href: "#arquitetura" },
];

export const heroSignals = [
  "Multi-BC e multiplas contas advertiser no mesmo painel",
  "Mascarador de criativo, pixel hub e bulk launch",
  "Cloaker proprio, tokens criptografados e operacao centralizada",
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
  { value: "Multi-BC", label: "Operacao nativa para varios Business Centers e advertisers" },
  { value: "Creative Mask", label: "Mascarador de criativo para organizar variacoes e escala" },
  { value: "Pixel Hub", label: "Gestao de pixels, vinculos, historico e estrutura de assets" },
  { value: "Bulk Launch", label: "Mesmo setup disparado em varias contas com controle real" },
];

export const platformHighlights = [
  {
    eyebrow: "Escala",
    title: "Bulk launch de verdade para publicar em massa sem virar caos",
    description:
      "Crie uma vez e replique a mesma estrutura em varias contas, varios anunciantes e varios Business Centers com visao total do que foi disparado.",
    points: [
      "Distribuicao simultanea por advertiser, BC, oferta ou geo",
      "Fila com retries, status, logs e rastreio de execucao por lote",
      "Escolha de pixel, criativo, dominio e destino em cada disparo",
    ],
  },
  {
    eyebrow: "Controle",
    title: "Command center para Business Centers, advertisers e equipe",
    description:
      "A ArisHub centraliza a operacao inteira num unico lugar: BCs, advertisers, membros, acessos, ativos, status e health operacional.",
    points: [
      "Mapa completo de BCs, advertisers, membros e ownership",
      "Permissoes granulares para operacao, criativo, pixel e lancamento",
      "Auditoria por usuario, acao e estrutura conectada",
    ],
  },
  {
    eyebrow: "Criativo",
    title: "Creative desk com mascarador de criativo e biblioteca operacional",
    description:
      "Criativos deixam de ficar espalhados. A plataforma organiza biblioteca, variacoes, mascarador e historico de uso para acelerar escala sem bagunca.",
    points: [
      "Mascarador de criativo com versoes e organizacao por oferta",
      "Biblioteca de assets com historico de uso e reaproveitamento",
      "Base pronta para review tracking, appeal e operacao criativa",
    ],
  },
  {
    eyebrow: "Infra",
    title: "Pixel hub, cloaker proprio e camada privada de operacao",
    description:
      "A ArisHub nao para na criacao de campanha. Ela conecta pixel, paginas, destinos e uma camada propria de roteamento para a operacao rodar com mais controle.",
    points: [
      "Gestao de pixels, vinculos, transferencia e historico por estrutura",
      "Cloaker proprio e camada de roteamento para operacao centralizada",
      "Vault de tokens com isolamento, rotacao e criptografia por conta",
    ],
  },
];

export const useCases = [
  {
    title: "Agencias",
    description:
      "Atenda varios clientes sem misturar ativos, acessos, criativos, pixels ou Business Centers.",
    bullets: [
      "Separacao real por cliente e operacao",
      "Equipe com acessos organizados por responsabilidade",
      "Visao consolidada para lideranca e execucao",
    ],
  },
  {
    title: "Media Buyers",
    description:
      "Mais velocidade para subir ofertas, testar criativos e escalar contas sem depender de processo manual torto.",
    bullets: [
      "Blueprints reaproveitaveis por oferta, geo ou conta",
      "Criativos, pixels e paginas no mesmo fluxo de lancamento",
      "Menos retrabalho e menos erro operacional na escala",
    ],
  },
  {
    title: "Operacao high scale",
    description:
      "Para quem roda volume alto e precisa de estrutura, fila, controle e stack propria para nao travar a operacao.",
    bullets: [
      "Mascarador de criativo e stack pronta para volume",
      "Cloaker proprio e roteamento centralizado na operacao",
      "Historico, health, status e automacao no mesmo painel",
    ],
  },
];

export const setupSteps = [
  {
    step: "01",
    title: "Conecte BCs, advertisers e acessos",
    description:
      "Autorize advertisers e Business Centers com OAuth 2.0 e monte sua base de operacao sem perder isolamento por conta.",
    detail: "Tudo entra organizado, segregado e pronto para escalar.",
  },
  {
    step: "02",
    title: "Monte a stack de criativos, pixels e paginas",
    description:
      "Centralize mascarador de criativo, pixel hub, dominios, paginas e destinos antes de disparar.",
    detail: "Criativo, tracking e entrega rodando no mesmo fluxo.",
  },
  {
    step: "03",
    title: "Dispare em massa com monitoramento real",
    description:
      "Publique a mesma logica em varias contas e BCs com fila, controle, status e rastreio de ponta a ponta.",
    detail: "Escala com organizacao, logs e execucao visivel.",
  },
];

export const portabilityPoints = [
  {
    title: "Stack propria de operacao",
    description:
      "A ArisHub foi pensada como camada proprietaria para gerir conta, criativo, pixel, paginas e lancamento sem depender de remendo.",
  },
  {
    title: "Infra flexivel e escalavel",
    description:
      "A stack inicial e enxuta, mas a base ja nasce preparada para fila dedicada, workers, servicos separados e crescimento real.",
  },
  {
    title: "Pensado para o lead virar operacao",
    description:
      "Nao e so uma dashboard bonita. A proposta da ArisHub e virar o centro de comando da sua operacao de TikTok Ads.",
  },
];
