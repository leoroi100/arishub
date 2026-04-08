import { createClient } from "@supabase/supabase-js";
import { assertSupabaseConfigured } from "@/lib/server/env";

export function getServiceSupabase() {
  const env = assertSupabaseConfigured();

  return createClient(env.supabaseUrl!, env.supabaseServiceRoleKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
