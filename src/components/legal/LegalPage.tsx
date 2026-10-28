import { Fragment } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarClock, Mail } from "lucide-react";
import { PageHero, PageShell } from "@/components/layout/PageShell";
import { CONTACT_EMAIL, type LegalBlock, type LegalDocument } from "@/lib/legal-content";
import type { Bi } from "@/lib/mice-data";

/** Affiche le texte en surlignant les passages [[à compléter]]. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("[[") ? (
          <mark
            key={i}
            title="À compléter"
            className="rounded bg-sun/20 px-1 font-semibold text-sun-deep dark:bg-sun/25 dark:text-sun"
          >
            {part.slice(2, -2)}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

function Block({ block, language }: { block: LegalBlock; language: "fr" | "en" }) {
  if (block.type === "p") {
    return (
      <p className="leading-relaxed text-ink/75 dark:text-slate-300">
        <RichText text={block.text[language]} />
      </p>
    );
  }
  if (block.type === "list") {
    return (
      <ul className="space-y-2.5">
        {block.items.map((item) => (
          <li key={item.fr} className="flex gap-3 leading-relaxed text-ink/75 dark:text-slate-300">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sun" aria-hidden="true" />
            <span>
              <RichText text={item[language]} />
            </span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 dark:border-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-cream dark:bg-slate-800">
          <tr>
            {block.head.map((h) => (
              <th key={h.fr} className="px-4 py-3 font-semibold text-forest-deep dark:text-white">
                {h[language]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row) => (
            <tr key={row[0].fr} className="border-t border-black/5 align-top dark:border-slate-800">
              {row.map((cell, i) => (
                <td
                  key={cell.fr}
                  className={`px-4 py-3 ${i === 0 ? "w-2/5 font-medium text-ink dark:text-white" : "text-ink/70 dark:text-slate-300"}`}
                >
                  {cell[language]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LegalPage({
  document: doc,
  title,
  eyebrow,
  image,
  related,
}: {
  document: LegalDocument;
  title: Bi;
  eyebrow: Bi;
  image: string;
  related: { to: "/confidentialite" | "/mentions-legales"; label: Bi };
}) {
  return (
    <PageShell>
      {({ language, t }) => {
        const updated = new Date(`${doc.updatedAt}T00:00:00`).toLocaleDateString(
          language === "fr" ? "fr-FR" : "en-GB",
          { day: "numeric", month: "long", year: "numeric" },
        );
        return (
          <>
            <PageHero
              image={image}
              eyebrow={eyebrow[language]}
              title={title[language]}
              intro={doc.intro[language]}
              crumb={title[language]}
              homeLabel={t("Accueil", "Home")}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                <CalendarClock className="h-4 w-4 text-sun" />
                {t("Dernière mise à jour :", "Last updated:")} {updated}
              </span>
            </PageHero>

            <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[260px_minmax(0,1fr)]">
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <nav
                  aria-label={t("Sommaire", "Contents")}
                  className="rounded-[1.5rem] bg-white p-5 shadow-soft dark:bg-slate-900"
                >
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-sun-deep">
                    {t("Sommaire", "Contents")}
                  </p>
                  <ol className="space-y-1">
                    {doc.sections.map((s) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className="block rounded-xl px-3 py-1.5 text-sm text-ink/70 transition-colors hover:bg-cream hover:text-forest-deep dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                          {s.title[language]}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </aside>

              <article className="min-w-0 space-y-6">
                {doc.sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-24 rounded-[1.75rem] bg-white p-6 shadow-soft dark:bg-slate-900 sm:p-8"
                  >
                    <h2 className="mb-4 font-display text-xl font-extrabold text-forest-deep dark:text-white sm:text-2xl">
                      {section.title[language]}
                    </h2>
                    <div className="space-y-4">
                      {section.blocks.map((block, i) => (
                        <Block key={i} block={block} language={language} />
                      ))}
                    </div>
                  </section>
                ))}

                <div className="grid gap-4 sm:grid-cols-2">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="flex items-center gap-4 rounded-[1.5rem] bg-forest-deep p-5 text-white transition-colors hover:bg-forest"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sun">
                      <Mail className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-white/70">
                        {t("Une question ?", "A question?")}
                      </span>
                      <span className="block truncate font-semibold">{CONTACT_EMAIL}</span>
                    </span>
                  </a>
                  <Link
                    to={related.to}
                    className="group flex items-center justify-between gap-4 rounded-[1.5rem] bg-white p-5 shadow-soft transition-colors hover:bg-sand dark:bg-slate-900 dark:hover:bg-slate-800"
                  >
                    <span className="font-semibold text-forest-deep dark:text-white">
                      {related.label[language]}
                    </span>
                    <ArrowRight className="h-5 w-5 shrink-0 text-sun-deep transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            </section>
          </>
        );
      }}
    </PageShell>
  );
}
