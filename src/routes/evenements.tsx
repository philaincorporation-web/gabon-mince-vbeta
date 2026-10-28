import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock3, MapPin, Plus, Target, Users } from "lucide-react";
import { PageHero, PageShell, SectionTitle } from "@/components/layout/PageShell";
import { RequestDialog, type RequestTarget } from "@/components/mice/RequestDialog";
import { miceEvents, type MiceEvent } from "@/lib/mice-data";
import { readMyEvents, type SubmittedEvent } from "@/lib/my-events";

export const Route = createFileRoute("/evenements")({
  head: () => ({
    meta: [
      { title: "Agenda des événements MICE au Gabon | GabonMICE" },
      {
        name: "description",
        content:
          "Congrès, forums, salons et séminaires au Gabon : consultez les événements existants et à venir.",
      },
    ],
  }),
  component: EventsPage,
});

const monthsFr = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];
const monthsEn = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function EventsPage() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [request, setRequest] = useState<RequestTarget | null>(null);
  const [mine, setMine] = useState<SubmittedEvent[]>([]);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => setMine(readMyEvents()), []);

  const events = useMemo(() => {
    const list = miceEvents.filter((e) =>
      tab === "upcoming" ? e.endDate >= today : e.endDate < today,
    );
    return list.sort((a, b) =>
      tab === "upcoming"
        ? a.startDate.localeCompare(b.startDate)
        : b.startDate.localeCompare(a.startDate),
    );
  }, [tab, today]);

  return (
    <PageShell>
      {({ language, t }) => {
        const months = language === "fr" ? monthsFr : monthsEn;
        return (
          <>
            <PageHero
              image="/Palaiscongrès2.webp"
              eyebrow={t("Agenda", "Calendar")}
              title={t("Les rendez-vous", "The business")}
              highlight={t("d'affaires au Gabon", "events in Gabon")}
              intro={t(
                "Congrès, forums, salons et séminaires : repérez les événements existants et à venir, inscrivez-vous ou répertoriez le vôtre.",
                "Congresses, forums, trade shows and seminars: find current and upcoming events, register or list your own.",
              )}
              crumb={t("Événements", "Events")}
              homeLabel={t("Accueil", "Home")}
            />

            <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
              <SectionTitle
                eyebrow={t("Programme", "Programme")}
                title={
                  tab === "upcoming"
                    ? t("Événements à venir", "Upcoming events")
                    : t("Événements passés", "Past events")
                }
                action={
                  <div className="flex gap-2">
                    {(
                      [
                        ["upcoming", "À venir", "Upcoming"],
                        ["past", "Passés", "Past"],
                      ] as const
                    ).map(([value, fr, en]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setTab(value)}
                        aria-pressed={tab === value}
                        className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                          tab === value
                            ? "bg-forest-deep text-white"
                            : "bg-white text-ink/70 shadow-sm hover:bg-sand dark:bg-slate-900 dark:text-slate-300"
                        }`}
                      >
                        {t(fr, en)}
                      </button>
                    ))}
                  </div>
                }
              />

              {mine.length > 0 && tab === "upcoming" && (
                <div className="mb-8 rounded-[1.75rem] border-2 border-dashed border-sun/50 bg-sun/5 p-5">
                  <p className="text-sm font-bold text-sun-deep">
                    {t("Vos événements soumis", "Your submitted events")}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {mine.map((e) => (
                      <li
                        key={e.id}
                        className="flex flex-col gap-1 rounded-2xl bg-white p-4 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span>
                          <span className="font-semibold">{e.title}</span>
                          <span className="block text-xs text-ink/60 dark:text-slate-400">
                            {[e.theme, e.city, e.startDate].filter(Boolean).join(" · ")}
                          </span>
                        </span>
                        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-sun/15 px-3 py-1 text-xs font-semibold text-sun-deep">
                          <Clock3 className="h-3.5 w-3.5" />{" "}
                          {t("En attente de validation AGATOUR", "Awaiting AGATOUR validation")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {events.length === 0 ? (
                <p className="rounded-[1.75rem] bg-white p-10 text-center text-ink/60 dark:bg-slate-900 dark:text-slate-400">
                  {t("Aucun événement pour le moment.", "No events at the moment.")}
                </p>
              ) : (
                <div className="space-y-5">
                  {events.map((event) => (
                    <EventRow
                      key={event.id}
                      event={event}
                      language={language}
                      months={months}
                      past={tab === "past"}
                      onRegister={() =>
                        setRequest({
                          kind: "reservation",
                          subject: `${t("Inscription", "Registration")} — ${event.title.fr}`,
                          provider: `${event.venue} · ${event.city}`,
                        })
                      }
                    />
                  ))}
                </div>
              )}

              <div className="mt-12 flex flex-col items-start gap-4 rounded-[2rem] bg-forest-deep p-8 text-white sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-display text-2xl font-extrabold">
                    {t("Vous organisez un événement ?", "Organising an event?")}
                  </p>
                  <p className="mt-1 text-white/70">
                    {t(
                      "Répertoriez-le et exprimez vos besoins en salles et prestations.",
                      "List it and describe your venue and service needs.",
                    )}
                  </p>
                </div>
                <Link
                  to="/organisateur"
                  className="inline-flex items-center gap-2 rounded-full bg-sun px-6 py-3 text-sm font-semibold hover:bg-sun-deep"
                >
                  <Plus className="h-4 w-4" /> {t("Répertorier mon événement", "List my event")}
                </Link>
              </div>
            </section>
            <RequestDialog
              target={request}
              onClose={() => setRequest(null)}
              isFrench={language === "fr"}
            />
          </>
        );
      }}
    </PageShell>
  );
}

function EventRow({
  event,
  language,
  months,
  past,
  onRegister,
}: {
  event: MiceEvent;
  language: "fr" | "en";
  months: string[];
  past: boolean;
  onRegister: () => void;
}) {
  const start = new Date(`${event.startDate}T00:00:00`);
  const end = new Date(`${event.endDate}T00:00:00`);
  const sameDay = event.startDate === event.endDate;
  const isFrench = language === "fr";
  return (
    <article className="group grid overflow-hidden rounded-[1.75rem] bg-white shadow-soft transition-shadow hover:shadow-elegant dark:bg-slate-900 md:grid-cols-[260px_1fr]">
      <div className="relative h-48 md:h-full">
        <img
          src={event.image}
          alt=""
          loading="lazy"
          className={`h-full w-full object-cover ${past ? "grayscale-[60%]" : ""}`}
        />
        <div className="absolute left-4 top-4 rounded-2xl bg-white px-3 py-2 text-center shadow-md">
          <p className="font-display text-2xl font-extrabold leading-none text-forest-deep">
            {start.getDate()}
            {!sameDay && <span className="text-base">–{end.getDate()}</span>}
          </p>
          <p className="text-[11px] font-bold uppercase text-sun-deep">
            {months[start.getMonth()]} {start.getFullYear()}
          </p>
        </div>
      </div>
      <div className="flex flex-col p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-sun-deep">
          {event.organiser}
        </p>
        <h3 className="mt-1 font-display text-2xl font-extrabold text-forest-deep dark:text-white">
          {event.title[language]}
        </h3>
        <div className="mt-3 grid gap-2 text-sm text-ink/70 dark:text-slate-300 sm:grid-cols-2">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-forest" /> {event.venue}, {event.city}
          </span>
          <span className="inline-flex items-center gap-2">
            <Target className="h-4 w-4 text-forest" /> {event.target[language]}
          </span>
          {event.attendees && (
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-forest" />{" "}
              {isFrench
                ? `${event.attendees} participants attendus`
                : `${event.attendees} expected attendees`}
            </span>
          )}
        </div>
        <p className="mt-3 inline-flex w-fit rounded-full bg-cream px-3 py-1 text-xs font-semibold text-ink/70 dark:bg-slate-800 dark:text-slate-300">
          {isFrench ? "Thème" : "Theme"} : {event.theme[language]}
        </p>
        {!past && (
          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            <button
              type="button"
              onClick={onRegister}
              className="rounded-full bg-sun px-5 py-2.5 text-sm font-semibold text-white hover:bg-sun-deep"
            >
              {isFrench ? "Je souhaite participer" : "I want to attend"}
            </button>
            <Link
              to="/explorer"
              search={{ cat: "hebergement" }}
              className="rounded-full border border-forest/20 px-5 py-2.5 text-sm font-semibold text-forest hover:bg-forest hover:text-white dark:border-slate-700 dark:text-slate-200"
            >
              {isFrench ? "Trouver un hébergement" : "Find accommodation"}
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
