import "server-only";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { isSupabasePublicConfigured } from "@/lib/supabase/env";
import type { AdminUserRow } from "@/lib/supabase/types";
import { logger } from "@/lib/observability/logger";

/**
 * Authorisation for the CRM.
 *
 * Being signed in is not enough — the user must also have an active row in
 * `admin_users`. Every admin page and every server action calls
 * `requireAdmin()`, so a route that forgets the check does not exist.
 */

export type AdminSession = {
  userId: string;
  email: string;
  profile: AdminUserRow;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isSupabasePublicConfigured) return null;

  const supabase = await getServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    logger.error("admin_profile_lookup_failed", { message: profileError.message });
    return null;
  }

  // A Supabase auth user without an admin_users row has no access at all.
  if (!profile || !profile.is_active) {
    logger.warn("admin_access_denied", { user_id: user.id, has_profile: Boolean(profile) });
    return null;
  }

  return { userId: user.id, email: user.email ?? profile.email, profile };
}

/** Redirects to the login page when the caller is not an active admin. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login?error=forbidden");
  return session;
}

/** True when the user may change data, as opposed to just reading it. */
export function canEdit(session: AdminSession): boolean {
  return session.profile.role === "admin" || session.profile.role === "advisor";
}
