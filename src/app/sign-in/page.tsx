import Link from "next/link";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { FixpassMark, FIXPASS_TAGLINE } from "@/components/brand/fixpass-mark";
import { isRealWebAuthEnabled } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const errorMessages: Record<string, string> = {
  credentials: "The email or password did not match a valid Fixpass account.",
  role: "This account is authenticated but not linked to a Fixpass web role yet.",
  config: "Web authentication is not configured correctly in this environment.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  await isRealWebAuthEnabled();

  return (
    <main className="relative">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-12 lg:py-20">
        {/* --- Left: brand / promise panel ---------------------------- */}
        <section className="surface-dark relative overflow-hidden rounded-[36px] p-8 sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-electric/20 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-honey/12 blur-3xl" aria-hidden />

          <div className="relative flex items-center justify-between">
            <FixpassMark size={48} color="#F7F5F0" strokeWidth={6} />
            <Link
              href="/"
              className="text-[11px] font-semibold uppercase tracking-[0.22em] text-parchment/60 transition hover:text-parchment"
            >
              ← Back home
            </Link>
          </div>

          <div className="relative mt-14">
            <span className="eyebrow-light">Secure access</span>
            <h1 className="display-hero mt-4 text-4xl text-parchment sm:text-5xl lg:text-6xl">
              Sign in once.
              <br />
              We route you to the right workspace.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-parchment/75">
              Use the same Fixpass credentials you use in the app. Customer,
              technician, and operations accounts are routed automatically
              based on role.
            </p>
          </div>

          <div className="relative mt-12 grid gap-3 sm:grid-cols-3">
            {[
              ["Customer", "Request, track, and pay."],
              ["Technician", "Today&apos;s route &amp; jobs."],
              ["Operations", "Assign, quote, oversee."],
            ].map(([role, copy]) => (
              <div
                key={role}
                className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-5 text-sm backdrop-blur"
              >
                <p className="font-semibold text-parchment">{role}</p>
                <p
                  className="mt-2 text-xs text-parchment/65"
                  dangerouslySetInnerHTML={{ __html: copy }}
                />
              </div>
            ))}
          </div>

          <div className="relative mt-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-xs text-parchment/70 backdrop-blur">
            <ShieldCheck size={18} />
            <span>
              End-to-end encrypted. Billing and payments handled by Stripe.
            </span>
          </div>

          <p className="relative mt-14 text-[11px] font-semibold uppercase tracking-[0.24em] text-parchment/40">
            {FIXPASS_TAGLINE}
          </p>
        </section>

        {/* --- Right: sign-in form ------------------------------------ */}
        <section className="surface-card rounded-[36px] p-8 sm:p-10 lg:p-12">
          <div className="flex items-center gap-3 border-b border-ink/8 pb-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-parchment">
              <Lock size={18} />
            </div>
            <div>
              <p className="eyebrow">Account sign in</p>
              <h2 className="mt-1 font-display text-2xl font-bold text-ink">
                Open your Fixpass account
              </h2>
            </div>
          </div>

          <form method="post" action="/api/auth/login" className="mt-7 grid gap-5">
            <input type="hidden" name="next" value={next ?? ""} />

            <label className="grid gap-2 text-sm font-medium text-ink/80">
              Email
              <input
                name="email"
                type="email"
                className="fp-input"
                placeholder="you@fixpass.com"
                autoComplete="email"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-ink/80">
              <span className="flex items-center justify-between">
                Password
                <Link
                  href="/support"
                  className="text-xs font-semibold text-royal hover:underline"
                >
                  Forgot?
                </Link>
              </span>
              <input
                name="password"
                type="password"
                className="fp-input"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </label>

            {error ? (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessages[error] ?? "Sign in failed."}
              </p>
            ) : null}

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-parchment shadow-[0_20px_50px_-24px_rgba(11,27,54,0.6)] transition hover:-translate-y-0.5 hover:bg-navy"
            >
              Log in
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-ink/65">
            New to Fixpass?{" "}
            <Link href="/join" className="font-semibold text-royal hover:underline">
              Start a membership →
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
