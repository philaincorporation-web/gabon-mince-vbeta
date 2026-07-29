import { useEffect, useState } from "react";
import { homeCopyFr, homeCopyEn } from "@/lib/home-data";

type ConversionPopupProps = {
  language: "fr" | "en";
  theme: "light" | "dark";
};

export function ConversionPopup({ language, theme }: ConversionPopupProps) {
  const [activeLanguage, setActiveLanguage] = useState(language);
  const [activeTheme, setActiveTheme] = useState(theme);

  useEffect(() => {
    setActiveLanguage(language);
    setActiveTheme(theme);
  }, [language, theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "gabonmice-language" && event.newValue) {
        setActiveLanguage(event.newValue as "fr" | "en");
      }
      if (event.key === "gabonmice-theme" && event.newValue) {
        setActiveTheme(event.newValue as "light" | "dark");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const isFrench = activeLanguage === "fr";
  const isDark = activeTheme === "dark";

  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.localStorage.getItem("gabonmice-popup-dismissed");
    if (seen === "true") {
      setDismissed(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || dismissed) return;
    const handleOpen = () => {
      setOpen(true);
      setSubmitted(false);
    };
    window.addEventListener("open-conversion-popup", handleOpen);
    return () => window.removeEventListener("open-conversion-popup", handleOpen);
  }, [dismissed]);

  useEffect(() => {
    if (typeof window === "undefined" || open || dismissed) return;
    const timer = setTimeout(() => {
      setOpen(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [open, dismissed]);

  useEffect(() => {
    if (!open || typeof window === "undefined") return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePopup();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  useEffect(() => {
    if (!open || typeof document === "undefined") return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closePopup = () => {
    setOpen(false);
    setSubmitted(false);
    setDismissed(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("gabonmice-popup-dismissed", "true");
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      closePopup();
    }, 1800);
  };

  const overlayBg = isDark ? "bg-slate-950/70" : "bg-slate-900/40";

  if (dismissed) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-6">
      <div
        className={`absolute inset-0 ${overlayBg}`}
        aria-hidden="true"
        onClick={closePopup}
      />
      <div
        className={`relative w-full max-w-5xl rounded-[2rem] shadow-2xl transition-all duration-300 ${isDark ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-200"} ${submitted ? "scale-100 opacity-100" : "scale-[0.92] opacity-0"}`}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid md:grid-cols-2">
          <div className="relative overflow-hidden rounded-t-[2rem] md:rounded-l-[2rem] md:rounded-tr-none">
            <img
              src="/poppup.png"
              alt={isFrench ? "Organisez votre événement au Gabon" : "Plan your event in Gabon"}
              className="h-64 md:h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r" />
            <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">GabonMICE</span>
              <h2 className="mt-2 font-display text-xl sm:text-2xl font-bold leading-tight">
                {isFrench ? "Organisez votre événement au Gabon" : "Plan your event in Gabon"}
              </h2>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  {isFrench
                    ? "Un conseiller vous recontacte sous 24h pour concevoir un programme sur mesure."
                    : "An advisor will get back to you within 24 hours to design a tailored programme."}
                </p>
              </div>
              <button
                type="button"
                onClick={closePopup}
                className={`rounded-full border px-3 py-1 text-sm font-bold hover:border-forest hover:text-forest transition-colors shrink-0 ${isDark ? "border-slate-700 text-slate-300" : "border-slate-300 text-slate-600"}`}
                aria-label={isFrench ? "Fermer" : "Close"}
              >
                {isFrench ? "Fermer" : "Close"}
              </button>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-1">
                  <span className={`mb-2 block text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                    {isFrench ? "Nom complet" : "Full name"}
                  </span>
                  <input
                    required
                    name="name"
                    className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:border-forest focus:ring-4 focus:ring-forest/10 text-sm ${isDark ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-400 focus:bg-slate-800" : "border-slate-200 bg-slate-50 text-slate-900 focus:bg-white"}`}
                    placeholder={isFrench ? "Jean Dupont" : "John Doe"}
                  />
                </label>
                <label className="sm:col-span-1">
                  <span className={`mb-2 block text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                    {isFrench ? "E-mail professionnel" : "Business email"}
                  </span>
                  <input
                    required
                    name="email"
                    type="email"
                    className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:border-forest focus:ring-4 focus:ring-forest/10 text-sm ${isDark ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-400 focus:bg-slate-800" : "border-slate-200 bg-slate-50 text-slate-900 focus:bg-white"}`}
                    placeholder="name@company.com"
                  />
                </label>
                <label className="sm:col-span-2">
                  <span className={`mb-2 block text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                    {isFrench ? "Type d'événement" : "Event type"}
                  </span>
                  <input
                    required
                    name="eventType"
                    className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:border-forest focus:ring-4 focus:ring-forest/10 text-sm ${isDark ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-400 focus:bg-slate-800" : "border-slate-200 bg-slate-50 text-slate-900 focus:bg-white"}`}
                    placeholder={isFrench ? "Congrès, séminaire, incentive…" : "Congress, seminar, incentive…"}
                  />
                </label>
                <label className="sm:col-span-2">
                  <span className={`mb-2 block text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                    {isFrench ? "Votre message" : "Your message"}
                  </span>
                  <textarea
                    required
                    name="message"
                    rows={3}
                    className={`w-full resize-y rounded-xl border px-4 py-3 outline-none transition focus:border-forest focus:ring-4 focus:ring-forest/10 text-sm ${isDark ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-400 focus:bg-slate-800" : "border-slate-200 bg-slate-50 text-slate-900 focus:bg-white"}`}
                    placeholder={isFrench ? "Dates, lieu souhaité et informations utiles…" : "Preferred dates, venue and useful information…"}
                  />
                </label>
                <div className="sm:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-forest px-7 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-forest/25 transition-all hover:bg-forest-deep hover:scale-[1.01]"
                  >
                    {isFrench ? "Envoyer la demande" : "Send request"}
                  </button>
                  <button
                    type="button"
                    onClick={closePopup}
                    className={`inline-flex items-center justify-center rounded-full border px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${isDark ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                  >
                    {isFrench ? "Plus tard" : "Later"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 rounded-2xl border border-forest/20 bg-forest/10 p-5 text-forest">
                <strong>
                  {isFrench ? "Merci pour votre demande." : "Thank you for your request."}
                </strong>
                <br />
                {isFrench
                  ? "Elle a bien été enregistrée. Notre équipe vous contactera prochainement."
                  : "It has been received. Our team will contact you shortly."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
