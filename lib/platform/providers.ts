export type PlatformLayer =
  | "database"
  | "auth"
  | "storage"
  | "queue"
  | "runtime";

export interface AdapterDescriptor {
  layer: PlatformLayer;
  activeProvider: string;
  portabilityNote: string;
}

export interface PlatformBindings {
  database: AdapterDescriptor;
  auth: AdapterDescriptor;
  storage: AdapterDescriptor;
  queue: AdapterDescriptor;
  runtime: AdapterDescriptor;
}

export const starterBindings: PlatformBindings = {
  database: {
    layer: "database",
    activeProvider: "Supabase Postgres",
    portabilityNote: "Pode ser trocado por Postgres gerenciado sem mexer no dominio.",
  },
  auth: {
    layer: "auth",
    activeProvider: "Supabase Auth",
    portabilityNote: "Fluxo de usuario nao deve depender de helper acoplado ao provedor.",
  },
  storage: {
    layer: "storage",
    activeProvider: "Supabase Storage",
    portabilityNote: "Assets e evidencias podem migrar para bucket dedicado depois.",
  },
  queue: {
    layer: "queue",
    activeProvider: "Application-managed queue",
    portabilityNote: "Fila pode nascer simples e depois migrar para worker dedicado.",
  },
  runtime: {
    layer: "runtime",
    activeProvider: "Vercel",
    portabilityNote: "Hospedagem de partida, nao contrato permanente da app.",
  },
};
