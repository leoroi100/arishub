import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export interface BrowserSupabaseConfig {
  supabaseUrl: string | null;
  supabaseAnonKey: string | null;
}

export function hasBrowserSupabaseConfig(config: BrowserSupabaseConfig) {
  return Boolean(config.supabaseUrl && config.supabaseAnonKey);
}

export function getBrowserSupabase(config: BrowserSupabaseConfig) {
  if (browserClient) {
    return browserClient;
  }

  const supabaseUrl = config.supabaseUrl;
  const supabaseAnonKey = config.supabaseAnonKey;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase nao configurado no frontend. Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);

  return browserClient;
}
