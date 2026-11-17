import type { ReactNode } from "react";

/** Mise en page d'une section du back office : titre, sous-titre, contenu. */
export function AdminPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-forest-deep sm:text-4xl dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-ink/65 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </header>
      <div className="space-y-6">{children}</div>
    </div>
  );
}
