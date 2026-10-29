import type { ReactNode } from "react";
import { KeyRound } from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { ROLE_LABEL, type SessionInfo } from "@/lib/auth/access";

/** En-tête commun aux espaces connectés : identité, rôle, mot de passe, déconnexion. */
export function SpaceHeader({
  session,
  language,
  title,
  subtitle,
}: {
  session: NonNullable<SessionInfo>;
  language: "fr" | "en";
  title: string;
  subtitle: string;
}) {
  const isFrench = language === "fr";
  return (
    <section className="px-3 pt-3 sm:px-5">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[2rem] bg-forest-deep p-6 text-white sm:p-10 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <span className="inline-flex rounded-full bg-sun px-3 py-1 text-xs font-bold">
            {ROLE_LABEL[session.role][language]}
          </span>
          <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">{title}</h1>
          <p className="mt-2 text-white/75">{subtitle}</p>
          <p className="mt-1 truncate text-sm text-white/55">
            {session.name} · {session.email}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/changer-mot-de-passe"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold hover:bg-white/20"
          >
            <KeyRound className="h-4 w-4" /> {isFrench ? "Mot de passe" : "Password"}
          </a>
          <SignOutButton
            label={isFrench ? "Déconnexion" : "Sign out"}
            className="border-white/20 text-white hover:bg-white/10"
          />
        </div>
      </div>
    </section>
  );
}

export function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[1.75rem] bg-white p-6 shadow-soft dark:bg-slate-900 ${className}`}>
      <h2 className="mb-4 font-display text-lg font-extrabold text-forest-deep dark:text-white">
        {title}
      </h2>
      {children}
    </div>
  );
}
