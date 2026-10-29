import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { CalendarDays, Compass, MapPinned, Sparkles } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Panel, SpaceHeader } from "@/components/auth/SpaceLayout";
import { Field, inputClass, Notice, SubmitButton } from "@/components/auth/AuthUI";
import { getMyProfile, requestRoleUpgrade } from "@/lib/auth/functions";
import { ROLE_LABEL } from "@/lib/auth/access";
import {
  errorMessage,
  fieldErrors,
  PROVIDER_CATEGORIES,
  roleUpgradeSchema,
} from "@/lib/auth/schemas";

export const Route = createFileRoute("/espace/touriste")({
  loader: () => getMyProfile(),
  head: () => ({ meta: [{ title: "Mon espace touriste | GabonMICE" }] }),
  component: TouristSpace,
});

const shortcuts = [
  { to: "/offres", icon: Sparkles, fr: "Offres spéciales", en: "Special offers" },
  { to: "/explorer", icon: Compass, fr: "Hôtels, salles, circuits", en: "Hotels, venues, tours" },
  { to: "/carte", icon: MapPinned, fr: "Carte interactive", en: "Interactive map" },
  { to: "/evenements", icon: CalendarDays, fr: "Agenda des événements", en: "Events calendar" },
] as const;

function TouristSpace() {
  const { session } = Route.useRouteContext();
  const profile = Route.useLoaderData();
  const router = useRouter();
  const [upgrade, setUpgrade] = useState<"ORGANIZER" | "PROVIDER">("ORGANIZER");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpgrade(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = {
      role: upgrade,
      ...Object.fromEntries([...form.entries()].map(([k, v]) => [k, String(v)])),
    };
    const parsed = roleUpgradeSchema.safeParse(data);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await requestRoleUpgrade({ data: parsed.data });
      await router.invalidate();
    } catch (error) {
      setFormError(errorMessage(error, "Erreur"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      {({ t, language }) => (
        <>
          <SpaceHeader
            session={session}
            language={language}
            title={t("Mon espace touriste d'affaires", "My business traveller space")}
            subtitle={t(
              "Découvrez, comparez et réservez vos prestations au Gabon.",
              "Discover, compare and book services in Gabon.",
            )}
          />
          <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
            <Panel title={t("Accès rapides", "Shortcuts")} className="lg:col-span-2">
              <div className="grid gap-3 sm:grid-cols-2">
                {shortcuts.map(({ to, icon: Icon, fr, en }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-3 rounded-2xl bg-cream p-4 font-semibold transition-colors hover:bg-sand dark:bg-slate-800 dark:hover:bg-slate-700"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    {t(fr, en)}
                  </Link>
                ))}
              </div>
            </Panel>

            <Panel title={t("Mon profil", "My profile")}>
              <dl className="space-y-2 text-sm">
                <Row label={t("Nom", "Name")} value={profile?.name} />
                <Row label="E-mail" value={profile?.email} />
                <Row label={t("Identifiant", "Username")} value={profile?.username} />
                <Row label={t("Pays", "Country")} value={profile?.touristProfile?.country} />
                <Row label={t("Entreprise", "Company")} value={profile?.touristProfile?.company} />
              </dl>
            </Panel>

            <Panel
              title={t("Devenir organisateur ou prestataire", "Become an organiser or provider")}
              className="lg:col-span-3"
            >
              {profile?.requestedRole ? (
                <Notice tone="info">
                  {t(
                    `Votre demande de profil « ${ROLE_LABEL[profile.requestedRole].fr} » est en cours d'examen par l'AGATOUR.`,
                    `Your “${ROLE_LABEL[profile.requestedRole].en}” profile request is being reviewed by AGATOUR.`,
                  )}
                </Notice>
              ) : (
                <form onSubmit={handleUpgrade} noValidate className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-wrap gap-2 sm:col-span-2">
                    {(["ORGANIZER", "PROVIDER"] as const).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setUpgrade(role)}
                        aria-pressed={upgrade === role}
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          upgrade === role
                            ? "bg-forest-deep text-white"
                            : "bg-cream dark:bg-slate-800"
                        }`}
                      >
                        {ROLE_LABEL[role][language]}
                      </button>
                    ))}
                  </div>
                  {upgrade === "ORGANIZER" ? (
                    <>
                      <Field
                        label={t("Organisation *", "Organisation *")}
                        error={errors.organization}
                      >
                        <input name="organization" className={inputClass} />
                      </Field>
                      <Field label={t("Fonction", "Position")}>
                        <input name="position" className={inputClass} />
                      </Field>
                    </>
                  ) : (
                    <>
                      <Field
                        label={t("Raison sociale *", "Company name *")}
                        error={errors.businessName}
                      >
                        <input name="businessName" className={inputClass} />
                      </Field>
                      <Field label={t("Catégorie *", "Category *")} error={errors.category}>
                        <select name="category" defaultValue="" className={inputClass}>
                          <option value="" disabled>
                            {t("Choisir…", "Choose…")}
                          </option>
                          {PROVIDER_CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c[language]}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label={t("Adresse", "Address")} className="sm:col-span-2">
                        <input name="address" className={inputClass} />
                      </Field>
                    </>
                  )}
                  {formError && (
                    <div className="sm:col-span-2">
                      <Notice tone="error">{formError}</Notice>
                    </div>
                  )}
                  <div className="sm:col-span-2 sm:max-w-xs">
                    <SubmitButton loading={loading}>
                      {t("Envoyer ma demande", "Send my request")}
                    </SubmitButton>
                  </div>
                </form>
              )}
            </Panel>
          </section>
        </>
      )}
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4 border-b border-black/5 pb-2 last:border-0 dark:border-slate-800">
      <dt className="text-ink/55 dark:text-slate-400">{label}</dt>
      <dd className="truncate font-medium">{value || "—"}</dd>
    </div>
  );
}
