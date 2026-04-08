import type {
  TikTokAdvertiserRecord,
  TikTokBusinessCenterRecord,
  TikTokConnectionRecord,
  TikTokPixelRecord,
} from "@/lib/integrations/tiktok/types";

interface ApiErrorShape {
  error?: {
    message?: string;
  };
}

interface ApiSuccessShape<T> {
  ok: true;
  data: T;
}

type ApiResponse<T> = ApiSuccessShape<T> | ({ ok: false } & ApiErrorShape);

export interface TikTokConfigState {
  appUrlConfigured: boolean;
  supabaseConfigured: boolean;
  tiktokConfigured: boolean;
  tiktokAuthUrl: string;
}

export interface ReviewResultShape {
  code: number;
  data: Record<string, unknown>;
  message: string;
  request_id?: string;
}

export async function requestJson<T>(input: string, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.ok) {
    throw new Error(
      payload.ok === false
        ? payload.error?.message || "Falha ao carregar dados da TikTok API."
        : "Falha ao carregar dados da TikTok API.",
    );
  }

  return payload.data;
}

export function formatDateTime(value: string | null) {
  if (!value) {
    return "Nao informado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function parseIds(input: string) {
  return input
    .split(/[\n,;\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export type {
  TikTokAdvertiserRecord,
  TikTokBusinessCenterRecord,
  TikTokConnectionRecord,
  TikTokPixelRecord,
};
