import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

export const inputClass =
  "w-full rounded-2xl border border-black/10 bg-cream px-4 py-3 text-sm outline-none transition focus:border-forest focus:bg-white focus:ring-4 focus:ring-forest/10 aria-[invalid=true]:border-red-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white";

/** Carte d'authentification : visuel à gauche (ordinateur), formulaire à droite. */
export function AuthCard({
  image,
  eyebrow,
  title,
  intro,
  children,
  wide = false,
}: {
  image: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <section className="px-3 py-6 sm:px-5 sm:py-10">
      <div
        className={`mx-auto grid overflow-hidden rounded-[2rem] bg-white shadow-float dark:bg-slate-900 lg:grid-cols-[0.9fr_1.1fr] ${wide ? "max-w-6xl" : "max-w-5xl"}`}
      >
        <div className="relative hidden min-h-[560px] lg:block">
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
          <div className="absolute inset-x-8 bottom-8 text-white">
            <p className="font-display text-2xl font-extrabold">
              Gabon<span className="text-sun">MICE</span>
            </p>
            <p className="mt-2 max-w-xs text-sm text-white/80">
              Organisateurs, prestataires labellisés et participants réunis sur un même outil.
            </p>
          </div>
        </div>
        <div className="min-w-0 p-6 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-sun-deep">{eyebrow}</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-forest-deep dark:text-white">
            {title}
          </h1>
          {intro && <p className="mt-2 text-sm text-ink/65 dark:text-slate-400">{intro}</p>}
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function Field({
  label,
  error,
  hint,
  className = "",
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold text-ink dark:text-slate-200">
        {label}
      </span>
      {children}
      {hint && !error && (
        <span className="mt-1 block text-xs text-ink/50 dark:text-slate-400">{hint}</span>
      )}
      {error && <span className="mt-1 block text-xs font-semibold text-red-500">{error}</span>}
    </label>
  );
}

export function SubmitButton({ loading, children }: { loading: boolean; children: ReactNode }) {
  return (
    <>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sun px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sun/30 transition hover:bg-sun-deep disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
      <LoadingOverlay show={loading} />
    </>
  );
}

export function Notice({
  tone,
  children,
}: {
  tone: "error" | "success" | "info";
  children: ReactNode;
}) {
  const styles = {
    error: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
    success: "bg-forest/10 text-forest dark:bg-forest/25 dark:text-emerald-200",
    info: "bg-sun/10 text-sun-deep dark:bg-sun/15 dark:text-sun",
  }[tone];
  const Icon = tone === "success" ? CheckCircle2 : AlertCircle;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex gap-2 rounded-2xl px-4 py-3 text-sm ${styles}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function GoogleButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-cream dark:border-slate-700 dark:bg-slate-800 dark:text-white"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z"
        />
        <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.7V6.6h-4a12 12 0 0 0 0 10.8l4-3Z" />
        <path
          fill="#EA4335"
          d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8Z"
        />
      </svg>
      {label}
    </button>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="my-5 flex items-center gap-3 text-xs text-ink/45 dark:text-slate-500">
      <span className="h-px flex-1 bg-black/10 dark:bg-slate-700" />
      {label}
      <span className="h-px flex-1 bg-black/10 dark:bg-slate-700" />
    </div>
  );
}
