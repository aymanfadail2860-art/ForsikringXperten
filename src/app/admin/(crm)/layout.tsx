import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/adminSession";
import { signOut } from "../actions";
import { Logo } from "@/components/layout/Logo";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

const nav = [
  { href: "/admin", label: "I dag" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/pipeline", label: "Pipeline" },
];

/**
 * CRM shell.
 *
 * `requireAdmin()` runs here for every page in the group — but each page and
 * action also checks for itself, because a layout is not a security boundary
 * in the App Router.
 */
export default async function CrmLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdmin();

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-ink-100 bg-surface">
        <div className="mx-auto flex h-16 max-w-wide items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Logo />
            <nav aria-label="Admin" className="hidden sm:block">
              <ul className="flex items-center gap-1">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-md px-3 py-2 text-small font-semibold text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-small text-ink-500 sm:inline">
              {session.profile.full_name ?? session.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-md border border-ink-200 px-3 py-1.5 text-small font-semibold text-ink-700 hover:bg-ink-50"
              >
                Log ud
              </button>
            </form>
          </div>
        </div>

        <nav aria-label="Admin mobil" className="border-t border-ink-100 sm:hidden">
          <ul className="mx-auto flex max-w-wide gap-1 px-5 py-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-1.5 text-small font-semibold text-ink-600"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-wide px-5 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
