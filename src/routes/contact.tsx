import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, MapPin, Sparkles, type LucideIcon } from "lucide-react";
import { ToastProvider } from "@/components/Toast";
import { ContactForm } from "@/components/ContactForm";
import { PageShell } from "@/components/layout/PageShell";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <ToastProvider>
      <PageShell>
        {({ language, theme }) => {
          const panel = isDark(theme) ? "bg-slate-900 text-slate-100" : "bg-white text-ink";
          const muted = isDark(theme) ? "text-slate-300" : "text-ink/65";
          return (
            <>
              <section className="px-3 pt-3 sm:px-5">
                <div className="relative isolate min-h-[26rem] overflow-hidden rounded-[2rem] px-4 sm:rounded-[2.5rem] sm:px-8">
                  <img
                    src="/formulaire.png"
                    alt="Organisation d'un événement au Gabon"
                    className="absolute inset-0 -z-20 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 -z-10 bg-ink/75" />
                  <div className="mx-auto max-w-3xl pt-16 text-center text-white sm:pt-20">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-sun">
                      GabonMICE × AGATOUR
                    </span>
                    <h1 className="mt-5 font-display text-4xl font-extrabold sm:text-6xl">
                      {isFrench(language) ? "Organiser un événement" : "Plan an event"}
                    </h1>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
                      {isFrench(language)
                        ? "Notre équipe vous accompagne pour concevoir un événement professionnel mémorable au Gabon."
                        : "Our team helps you create an unforgettable professional event in Gabon."}
                    </p>
                  </div>
                </div>
              </section>

              <section className="relative z-10 mx-auto -mt-24 max-w-6xl px-4 pb-16 sm:px-8 sm:pb-24">
                <div
                  className={`grid overflow-hidden rounded-[2rem] shadow-float md:grid-cols-[0.85fr_1.15fr] ${panel}`}
                >
                  <aside className={`p-8 sm:p-12 ${isDark(theme) ? "bg-slate-800" : "bg-sand/70"}`}>
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-sun-deep">
                      {isFrench(language) ? "Votre projet" : "Your project"}
                    </span>
                    <h2 className="mt-4 font-display text-3xl font-extrabold">
                      {isFrench(language)
                        ? "Parlons de votre événement"
                        : "Let's talk about your event"}
                    </h2>
                    <p className={`mt-5 leading-relaxed ${muted}`}>
                      {isFrench(language)
                        ? "Congrès, séminaire, voyage incentive ou rencontre institutionnelle : partagez vos besoins et recevez un accompagnement personnalisé."
                        : "Congress, seminar, incentive trip or institutional meeting: share your needs and receive personalised support."}
                    </p>
                    <div className="mt-10 space-y-7">
                      <InfoItem
                        icon={MapPin}
                        title={isFrench(language) ? "Destination" : "Destination"}
                        text={
                          isFrench(language)
                            ? "Libreville, Port-Gentil, Pointe Denis et parcs nationaux"
                            : "Libreville, Port-Gentil, Pointe Denis and national parks"
                        }
                      />
                      <InfoItem
                        icon={Sparkles}
                        title={isFrench(language) ? "Accompagnement" : "Support"}
                        text={
                          isFrench(language)
                            ? "Lieux, hébergements, expériences et coordination locale"
                            : "Venues, accommodation, experiences and local coordination"
                        }
                      />
                      <InfoItem
                        icon={Clock}
                        title={
                          isFrench(language) ? "Réponse personnalisée" : "Personalised response"
                        }
                        text={
                          isFrench(language)
                            ? "Notre équipe étudie votre demande et revient vers vous."
                            : "Our team will review your request and get back to you."
                        }
                      />
                    </div>
                    <Link
                      to="/organisateur"
                      className="mt-10 inline-flex items-center rounded-full bg-forest-deep px-5 py-3 text-sm font-semibold text-white hover:bg-sun"
                    >
                      {isFrench(language)
                        ? "Besoin détaillé ? Espace organisateur"
                        : "Detailed needs? Organiser space"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <div
                      className={`mt-10 border-t pt-7 ${isDark(theme) ? "border-slate-700" : "border-black/10"}`}
                    >
                      <p
                        className={`text-sm font-semibold ${isDark(theme) ? "text-slate-200" : "text-ink/75"}`}
                      >
                        {isFrench(language) ? "Une initiative portée par" : "An initiative by"}
                      </p>
                      <Logos />
                    </div>
                  </aside>
                  <div className="p-8 sm:p-12">
                    <h2 className="font-display text-3xl font-extrabold">
                      {isFrench(language) ? "Envoyez-nous votre demande" : "Send us your request"}
                    </h2>
                    <p className={`mt-3 ${muted}`}>
                      {isFrench(language)
                        ? "Les champs marqués d'un astérisque sont obligatoires."
                        : "Fields marked with an asterisk are required."}
                    </p>
                    <ContactForm language={language} theme={theme} />
                  </div>
                </div>
              </section>
            </>
          );
        }}
      </PageShell>
    </ToastProvider>
  );
}

function isDark(theme: "light" | "dark") {
  return theme === "dark";
}
function isFrench(language: "fr" | "en") {
  return language === "fr";
}

function Logos({ light = false }: { light?: boolean }) {
  return (
    <div className="mt-4 flex items-center gap-3">
      <img
        src="/logo%20GabonMince.png"
        alt="GabonMICE"
        className="h-10 w-10 rounded-full bg-white p-1 object-cover"
      />
      <span
        className={`hidden font-display text-base font-bold min-[430px]:inline ${light ? "text-white" : "text-forest"}`}
      >
        Gabon<span className="text-sun">MICE</span>
      </span>
      <img
        src="/LogoAGATOUR.jpg"
        alt="AGATOUR"
        className="h-10 w-auto max-w-24 rounded bg-white p-1 object-contain"
      />
    </div>
  );
}

function InfoItem({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-deep text-xl text-white">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed opacity-75">{text}</p>
      </div>
    </div>
  );
}
