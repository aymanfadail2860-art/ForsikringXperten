import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { supabaseUrl, getServiceRoleKey, isSupabaseAdminConfigured } from "./env";

/**
 * Service-role client — bypasses RLS.
 *
 * Only for server code that has already validated and authorised the request:
 * the lead intake route and admin server actions. `import "server-only"` makes
 * it a build error to pull this into a client component.
 */
let cached: SupabaseClient<Database> | null = null;

export function getAdminClient(): SupabaseClient<Database> {
  if (!isSupabaseAdminConfigured()) {
    throw new Error(
      "Supabase er ikke konfigureret. Sæt NEXT_PUBLIC_SUPABASE_URL og SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  if (cached) return cached;

  cached = createClient<Database>(supabaseUrl, getServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application-name": "forsikringxperten-server" } },
  });
  return cached;
}

export { isSupabaseAdminConfigured };
