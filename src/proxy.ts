import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * The proxy (formerly middleware) does two things:
 *  1. Refreshes the Supabase auth cookie so admin sessions do not expire mid-task.
 *  2. Blocks unauthenticated requests to /admin before any page code runs.
 *
 * This is a first gate, not the only one. Every admin page and server action
 * re-checks membership in `admin_users`, and RLS enforces it a third time at
 * the database. A middleware-only guard is exactly the "auth based purely on
 * frontend routes" that must be avoided.
 */
export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  if (!url || !key) {
    // Without Supabase there is no way to authenticate anyone — so the admin
    // area stays closed rather than open.
    if (isAdminRoute && !isLoginRoute) {
      return NextResponse.redirect(new URL("/admin/login?error=unconfigured", request.url));
    }
    return response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // getUser() revalidates the token with Supabase — getSession() would trust
  // a cookie the client could have tampered with.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminRoute && !isLoginRoute && !user) {
    const redirect = new URL("/admin/login", request.url);
    redirect.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirect);
  }

  if (isLoginRoute && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Everything except static assets and image optimisation — the session
     * cookie only needs refreshing on real navigations.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|txt|xml)$).*)",
  ],
};
