import {
  badRequest,
  configError,
  notFound,
  upstreamError,
} from "@/lib/server/app-error";
import { assertTikTokConfigured, getServerEnv } from "@/lib/server/env";
import { findTikTokOperation } from "@/lib/integrations/tiktok/catalog";
import { sdkBcGet, sdkOauth2AccessToken, sdkOauth2AdvertiserGet } from "@/lib/integrations/tiktok/sdk";
import {
  HttpMethod,
  TikTokApiEnvelope,
  TikTokOperationDescriptor,
} from "@/lib/integrations/tiktok/types";

const TIKTOK_API_BASE_URL = "https://business-api.tiktok.com";

function serializeQueryValue(value: unknown): string {
  if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
    return JSON.stringify(value);
  }

  return String(value);
}

function buildSearchParams(query?: Record<string, unknown>) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    search.set(key, serializeQueryValue(value));
  }

  return search;
}

async function parseTikTokResponse<T>(response: Response): Promise<TikTokApiEnvelope<T>> {
  const payload = (await response.json()) as TikTokApiEnvelope<T>;

  if (!response.ok) {
    throw upstreamError("Falha ao chamar a TikTok API.", payload, response.status);
  }

  if (payload.code !== 0) {
    throw upstreamError(
      payload.message || "TikTok API retornou erro.",
      payload,
      502,
      "tiktok_api_error",
    );
  }

  return payload;
}

export async function tiktokRequest<T>(options: {
  method: HttpMethod;
  path: string;
  accessToken?: string;
  query?: Record<string, unknown>;
  body?: unknown;
  formData?: FormData;
}) {
  const url = new URL(options.path, TIKTOK_API_BASE_URL);
  const search = buildSearchParams(options.query);
  url.search = search.toString();

  const headers = new Headers({
    Accept: "application/json",
    "Business-SDK": "1",
    "SDK-Language": "Node",
    "SDK-Version": "1.0.0",
  });

  if (options.accessToken) {
    headers.set("Access-Token", options.accessToken);
  }

  const init: RequestInit = {
    method: options.method,
    headers,
    cache: "no-store",
  };

  if (options.formData) {
    init.body = options.formData;
  } else if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
    init.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, init);
  return parseTikTokResponse<T>(response);
}

export function buildTikTokAuthorizationUrl(state: string) {
  const env = assertTikTokConfigured();
  const url = new URL(env.tiktokAuthUrl);

  url.searchParams.set("app_id", env.tiktokAppId!);
  url.searchParams.set("redirect_uri", env.tiktokRedirectUri!);
  url.searchParams.set("state", state);

  return url.toString();
}

export async function exchangeAuthCode(authCode: string) {
  const env = assertTikTokConfigured();
  return sdkOauth2AccessToken({
    app_id: env.tiktokAppId,
    auth_code: authCode,
    secret: env.tiktokAppSecret,
  });
}

export async function getAuthorizedAdvertisers(accessToken: string) {
  const env = assertTikTokConfigured();

  return sdkOauth2AdvertiserGet({
    appId: env.tiktokAppId!,
    secret: env.tiktokAppSecret!,
    accessToken,
  });
}

export async function getBusinessCenters(accessToken: string) {
  return sdkBcGet(accessToken);
}

export async function callTikTokOperation<T>(
  descriptor: TikTokOperationDescriptor,
  args: {
    accessToken?: string;
    query?: Record<string, unknown>;
    body?: unknown;
  },
) {
  if (descriptor.needsAccessToken && !args.accessToken) {
    throw badRequest("connectionId invalido ou token nao encontrado.");
  }

  return tiktokRequest<T>({
    method: descriptor.method,
    path: descriptor.path,
    accessToken: args.accessToken,
    query: args.query,
    body: args.body,
  });
}

export async function uploadTikTokAsset(args: {
  path: string;
  accessToken: string;
  formData: FormData;
}) {
  if (!args.accessToken) {
    throw badRequest("Token de acesso ausente para upload de asset.");
  }

  return tiktokRequest<Record<string, unknown>>({
    method: "POST",
    path: args.path,
    accessToken: args.accessToken,
    formData: args.formData,
  });
}

export function extractArrayPayload<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  for (const value of Object.values(data)) {
    if (Array.isArray(value)) {
      return value as T[];
    }
  }

  return [];
}

export function getConfiguredRedirectUri(fallbackOrigin?: string) {
  const env = getServerEnv();
  if (env.tiktokRedirectUri) {
    return env.tiktokRedirectUri;
  }

  if (fallbackOrigin) {
    return `${fallbackOrigin}/api/tiktok/oauth/callback`;
  }

  throw configError("TIKTOK_REDIRECT_URI nao configurado.");
}

export function requireOperation(operationId: string) {
  const descriptor = findTikTokOperation(operationId);
  if (!descriptor) {
    throw notFound(`Operacao TikTok nao suportada: ${operationId}`);
  }

  return descriptor;
}
