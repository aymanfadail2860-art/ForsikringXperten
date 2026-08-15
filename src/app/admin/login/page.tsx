import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import { Logo } from "@/components/layout/Logo";

export const metadata: Metadata = {
  title: "Log ind",
  robots: { index: false, follow: false },
};

const errorMessages: Record<string, string> = {
  forbidden: "Du har ikke adgang til systemet med den bruger.",
  unconfigured: "Systemet mangler databaseopsætning, så login er slået fra.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const notice = params.error ? errorMessages[params.error] : undefined;
  // Only allow internal redirects — an open redirect here would be a
  // credible phishing vector against staff.
  const next =
    params.next && params.next.startsWith("/admin") ? params.next : "/admin";

  return (
    <div className="grid min-h-dvh place-items-center bg-canvas p-5">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="mt-8 rounded-xl border border-ink-100 bg-surface p-7 shadow-sm">
          <h1 className="text-h2">Log ind</h1>
          <p className="mt-2 text-small text-ink-600">
            Adgang til leads og pipeline.
          </p>
          <LoginForm next={next} notice={notice} />
        </div>
      </div>
    </div>
  );
}
