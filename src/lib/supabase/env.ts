/**
 * Supabase environment access.
 *
 * The site must build and render without Supabase configured — marketing pages
 * do not depend on it. Only the paths that actually need the database fail, and
 * they fail with a message that says what is missing.
 */

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True when the public (browser-safe) credentials are present. */
export const isSupabasePublicConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * True when server-side writes are possible. The service role key is read
 * lazily and only in server contexts — it must never be imported into a file
 * that can end up in the browser bundle.
 */
export function getServiceRoleKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
}

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(supabaseUrl && getServiceRoleKey());
}
