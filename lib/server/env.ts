import { configError } from "@/lib/server/app-error";

export interface ServerEnv {
  appUrl: string | null;
  supabaseUrl: string | null;
  supabaseAnonKey: string | null;
  supabaseServiceRoleKey: string | null;
  tiktokAppId: string | null;
  tiktokAppSecret: string | null;
  tiktokRedirectUri: string | null;
  tiktokEncryptionKey: string | null;
  tiktokAuthUrl: string;
}

export function getServerEnv(): ServerEnv {
  return {
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? null,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? null,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? null,
    tiktokAppId: process.env.TIKTOK_APP_ID ?? null,
    tiktokAppSecret: process.env.TIKTOK_APP_SECRET ?? null,
    tiktokRedirectUri: process.env.TIKTOK_REDIRECT_URI ?? null,
    tiktokEncryptionKey: process.env.TIKTOK_ENCRYPTION_KEY ?? null,
    tiktokAuthUrl:
      process.env.TIKTOK_AUTH_URL ?? "https://ads.tiktok.com/marketing_api/auth",
  };
}

export function assertSupabaseConfigured() {
  const env = getServerEnv();
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    throw configError(
      "Supabase nao configurado. Preencha NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return env;
}

export function assertTikTokConfigured() {
  const env = getServerEnv();
  if (
    !env.tiktokAppId ||
    !env.tiktokAppSecret ||
    !env.tiktokRedirectUri ||
    !env.tiktokEncryptionKey
  ) {
    throw configError(
      "TikTok API nao configurada. Preencha TIKTOK_APP_ID, TIKTOK_APP_SECRET, TIKTOK_REDIRECT_URI e TIKTOK_ENCRYPTION_KEY.",
    );
  }

  return env;
}

export function getPublicConfigurationState() {
  const env = getServerEnv();

  return {
    appUrlConfigured: Boolean(env.appUrl),
    supabaseConfigured: Boolean(env.supabaseUrl && env.supabaseServiceRoleKey),
    tiktokConfigured: Boolean(
      env.tiktokAppId &&
        env.tiktokAppSecret &&
        env.tiktokRedirectUri &&
        env.tiktokEncryptionKey,
    ),
    tiktokAuthUrl: env.tiktokAuthUrl,
  };
}
