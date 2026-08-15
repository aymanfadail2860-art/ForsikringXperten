import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./types";
import { supabaseUrl, supabaseAnonKey, isSupabasePublicConfigured } from "./env";

/**
 * Request-scoped client that carries the signed-in admin's session.
 *
 * Queries made through this client are subject to RLS — which is the point.
 * The CRM reads leads as the logged-in user, so a policy mistake shows up as
 * "no rows", not as a silent data leak.
 */
export async function getServerClient() {
  if (!isSupabasePublicConfigured) {
    throw new Error(
      "Supabase er ikke konfigureret. Sæt NEXT_PUBLIC_SUPABASE_URL og NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // Session refresh is handled in middleware instead.
        }
      },
    },
  });
}

export { isSupabasePublicConfigured };
