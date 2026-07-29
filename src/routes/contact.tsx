import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ToastProvider } from "@/components/Toast";
import { ContactForm } from "@/components/ContactForm";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("gabonmice-language") as "fr" | "en" | null;
    if (savedLanguage) setLanguage(savedLanguage);
    const savedTheme = window.localStorage.getItem("gabonmice-theme") as "light" | "dark" | null;
    if (savedTheme) setTheme(savedTheme);
  }, []);
  useEffect(() => {
    window.localStorage.setItem("gabonmice-language", language);
  }, [language]);
  useEffect(() => {
    window.localStorage.setItem("gabonmice-theme", theme);
  }, [theme]);

  const panel = isDark(theme) ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900";
  const muted = isDark(theme) ? "text-slate-300" : "text-slate-600";

  return (
    <ToastProvider>
      <main
        className={`min-h-screen overflow-hidden transition-colors ${isDark(theme) ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}
        lang={language}
      >
        <header className="mx-auto flex max-w-6xl items-center justify-between gap-2 text-white px-4 pt-5 sm:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3" aria-label="GabonMICE">
            <img
              src="/logo%20GabonMince.png"
              alt="GabonMICE"
              className="h-9 w-9 shrink-0 rounded-full border border-white/30 bg-white object-cover p-1 sm:h-12 sm:w-12"
            />
            <span className="hidden font-display text-xl font-bold min-[430px]:inline">
              GABON<span className="text-gold">MICE</span>
            </span>
          </Link>
          <div className="flex shrink-0 gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setTheme(isDark(theme) ? "light" : "dark")}
              className="rounded-full border border-white/40 px-3 py-2 text-xs font-bold hover:bg-white hover:text-forest"
            >
              {isDark(theme) ? "☀" : "☾"}
            </button>
            <button
              type="button"
              onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
              className="rounded-full border border-white/40 px-3 py-2 text-xs font-bold hover:bg-white hover:text-forest"
            >
              {language === "fr" ? "EN" : "FR"}
            </button>
            <Link
              to="/"
              className="rounded-full border border-white/40 px-3 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-white hover:text-forest sm:px-5 sm:text-xs sm:tracking-widest"
            >
              Accueil
            </Link>
          </div>
        </header>

        <section className="relative isolate min-h-[29rem] overflow-hidden bg-forest px-4 pt-5 sm:px-8">
          <img
            src="/formulaire.png"
            alt="Organisation d'un événement au Gabon"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-slate-950/75" />
          <div className="mx-auto max-w-3xl pt-20 text-center text-white sm:pt-24">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
              GabonMICE × AGATOUR
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold sm:text-6xl">
              {isFrench(language) ? "Organiser un événement" : "Plan an event"}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              {isFrench(language)
                ? "Notre équipe vous accompagne pour concevoir un événement professionnel mémorable au Gabon."
                : "Our team helps you create an unforgettable professional event in Gabon."}
            </p>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-32 max-w-6xl px-4 pb-16 sm:px-8 sm:pb-24">
          <div
            className={`grid overflow-hidden rounded-[2rem] shadow-2xl md:grid-cols-[0.85fr_1.15fr] ${panel}`}
          >
            <aside className={`p-8 sm:p-12 ${isDark(theme) ? "bg-slate-800" : "bg-slate-100"}`}>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-forest">
                {isFrench(language) ? "Votre projet" : "Your project"}
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold">
                {isFrench(language) ? "Parlons de votre événement" : "Let's talk about your event"}
              </h2>
              <p className={`mt-5 leading-relaxed ${muted}`}>
                {isFrench(language)
                  ? "Congrès, séminaire, voyage incentive ou rencontre institutionnelle : partagez vos besoins et recevez un accompagnement personnalisé."
                  : "Congress, seminar, incentive trip or institutional meeting: share your needs and receive personalised support."}
              </p>
              <div className="mt-10 space-y-7">
                <InfoItem
                  icon="⌖"
                  title={isFrench(language) ? "Destination" : "Destination"}
                  text={
                    isFrench(language)
                      ? "Libreville, Port-Gentil, Pointe Denis et parcs nationaux"
                      : "Libreville, Port-Gentil, Pointe Denis and national parks"
                  }
                />
                <InfoItem
                  icon="✦"
                  title={isFrench(language) ? "Accompagnement" : "Support"}
                  text={
                    isFrench(language)
                      ? "Lieux, hébergements, expériences et coordination locale"
                      : "Venues, accommodation, experiences and local coordination"
                  }
                />
                <InfoItem
                  icon="◷"
                  title={isFrench(language) ? "Réponse personnalisée" : "Personalised response"}
                  text={
                    isFrench(language)
                      ? "Notre équipe étudie votre demande et revient vers vous."
                      : "Our team will review your request and get back to you."
                  }
                />
              </div>
              <div
                className={`mt-12 border-t pt-7 ${isDark(theme) ? "border-slate-700" : "border-slate-300"}`}
              >
                <p
                  className={`text-sm font-semibold ${isDark(theme) ? "text-slate-200" : "text-slate-700"}`}
                >
                  {isFrench(language) ? "Une initiative portée par" : "An initiative by"}
                </p>
                <Logos />
              </div>
            </aside>
            <div className="p-8 sm:p-12">
              <h2 className="font-display text-3xl font-bold">
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

        <footer className="bg-slate-950 px-4 py-12 text-slate-300 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
            <Logos light />
            <div className="flex gap-5 text-sm">
              <Link to="/lieux" className="hover:text-gold">
                {isFrench(language) ? "Lieux" : "Venues"}
              </Link>
              <Link to="/destinations" className="hover:text-gold">
                {isFrench(language) ? "Destinations" : "Destinations"}
              </Link>
              <Link to="/experiences" className="hover:text-gold">
                {isFrench(language) ? "Expériences" : "Experiences"}
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-7 flex max-w-6xl flex-col justify-between gap-3 text-xs text-slate-400 sm:flex-row">
            <p>
              © 2026 GabonMICE — AGATOUR.{" "}
              {isFrench(language) ? "Tous droits réservés." : "All rights reserved."}
            </p>
            <Link to="/" className="hover:text-gold">
              {isFrench(language) ? "Accueil" : "Home"}
            </Link>
          </div>
        </footer>
      </main>
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
        GABON<span className="text-gold">MICE</span>
      </span>
      <img
        src="/LogoAGATOUR.jpg"
        alt="AGATOUR"
        className="h-10 w-auto max-w-24 rounded bg-white p-1 object-contain"
      />
    </div>
  );
}

function InfoItem({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest text-xl text-white">
        {icon}
      </span>
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed opacity-75">{text}</p>
      </div>
    </div>
  );
}
