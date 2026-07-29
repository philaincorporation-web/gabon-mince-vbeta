import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import loangoElephant from "@/assets/loango-elephant.jpg";
import gabonMask from "@/assets/gabon-mask.jpg";
import {
  heroSlidesFr,
  heroSlidesEn,
  homeCopyFr,
  homeCopyEn,
  navLinksFr,
  navLinksEn,
  type SocialPlatform,
  socialPlatforms,
} from "@/lib/home-data";

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  const common = "h-5 w-5";

  switch (platform) {
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
          <path d="M6.94 8.5A1.56 1.56 0 1 0 6.94 5.38a1.56 1.56 0 0 0 0 3.12ZM5.5 9.75h2.88V18H5.5zM10.27 9.75h2.76v1.12h.04c.38-.72 1.32-1.48 2.72-1.48 2.91 0 3.45 1.91 3.45 4.4V18h-2.88v-7.4c0-1.76-.03-4.03-2.46-4.03-2.46 0-2.84 1.92-2.84 3.9V18H10.27z" />
        </svg>
      );
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
          <path d="M18.9 5H21l-6.2 7.1L22 19h-5.6l-4.3-5.6L7.3 19H5.2l6.7-7.6L2 5h5.7l3.9 5.2L18.9 5Zm-1 12.4h1.1L7.2 6.5H6.1l11.8 10.9Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={common}
          aria-hidden="true"
        >
          <rect x="4.5" y="4.5" width="15" height="15" rx="4" />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
          <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.8 12 4.8 12 4.8s-5.8 0-7.6.4a2.8 2.8 0 0 0-2 2A29.4 29.4 0 0 0 2 12a29.4 29.4 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.8.4 7.6.4 7.6.4s5.8 0 7.6-.4a2.8 2.8 0 0 0 2-2A29.4 29.4 0 0 0 22 12a29.4 29.4 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
        </svg>
      );
    default:
      return null;
  }
}

interface SiteNavProps {
  language: "fr" | "en";
  theme: "light" | "dark";
  menuOpen: boolean;
  onToggleMenu: (open: boolean) => void;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
}

export function SiteNav({
  language,
  theme,
  menuOpen,
  onToggleMenu,
  onToggleTheme,
  onToggleLanguage,
}: SiteNavProps) {
  const isFrench = language === "fr";
  const isDark = theme === "dark";
  const copy = isFrench ? homeCopyFr : homeCopyEn;
  const navLinks = isFrench ? navLinksFr : navLinksEn;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b px-4 sm:px-6 md:px-10 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3 transition-colors duration-500 ${
        isDark ? "bg-slate-950/80 border-slate-800" : "bg-white/75 border-black/5"
      }`}
    >
      <Link
        to="/"
        className="flex min-w-0 items-center gap-2 sm:gap-3"
        onClick={() => onToggleMenu(false)}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-forest/20 bg-white/90 p-1 shadow-sm shadow-forest/10 ring-1 ring-forest/10 sm:h-12 sm:w-12">
          <img
            src="/logo%20GabonMince.png"
            alt="GabonMince"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <span className="hidden font-display font-bold text-lg tracking-tight text-forest min-[430px]:inline sm:text-xl">
          GABON<span className="text-ocean">MICE</span>
        </span>
       
      </Link>

      <div
        className={`hidden lg:flex items-center gap-10 text-[11px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-slate-300" : "text-slate-600"}`}
      >
        {navLinks.map((link) => (
          <Link key={link.href} to={link.href} className="hover:text-forest transition-colors">
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onToggleTheme}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-[10px] sm:text-xs font-semibold uppercase transition-all duration-300 ${
            isDark
              ? "border-slate-700 text-slate-200 hover:bg-slate-800"
              : "border-forest/30 text-forest hover:bg-forest hover:text-white"
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? "☀" : "☾"}
        </button>
        <button
          type="button"
          onClick={onToggleLanguage}
          className={`inline-flex px-3 sm:px-4 py-2.5 rounded-full border text-[10px] sm:text-xs font-semibold tracking-widest uppercase transition-all duration-300 ${
            isDark
              ? "border-slate-700 text-slate-200 hover:bg-slate-800"
              : "border-forest/30 text-forest hover:bg-forest hover:text-white"
          }`}
        >
          {isFrench ? "EN" : "FR"}
        </button>
        <button
          type="button"
          onClick={() => onToggleMenu(!menuOpen)}
          className={`inline-flex items-center justify-center rounded-full border p-2.5 lg:hidden transition-colors duration-300 ${
            isDark ? "border-slate-700 text-slate-200" : "border-slate-200 text-slate-700"
          }`}
          aria-label="Toggle navigation menu"
        >
          <span className="text-lg leading-none">☰</span>
        </button>
        <Link
          to="/contact"
          className="hidden sm:inline-flex px-4 sm:px-6 md:px-8 py-2.5 rounded-full bg-forest text-white text-[10px] sm:text-xs font-semibold tracking-widest uppercase shadow-lg shadow-forest/25 hover:bg-forest-deep transition-all"
        >
          {copy.nav.cta}
        </Link>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/50 px-4 pt-20 transition-all duration-300 lg:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => onToggleMenu(false)}
      >
        <div
          className={`mx-auto max-w-md rounded-[1.5rem] p-5 shadow-2xl transition-all duration-300 ${
            isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"
          } ${menuOpen ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-forest">
              {isFrench ? "Navigation" : "Navigation"}
            </span>
            <button
              type="button"
              onClick={() => onToggleMenu(false)}
              className={`text-xl ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              ×
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition-colors ${
                  isDark
                    ? "border-slate-700 text-slate-300 hover:border-forest hover:text-forest"
                    : "border-slate-200 text-slate-700 hover:border-forest hover:text-forest"
                }`}
                onClick={() => onToggleMenu(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="rounded-2xl bg-forest px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.16em] text-white hover:bg-forest-deep transition-colors"
              onClick={() => onToggleMenu(false)}
            >
              {copy.nav.cta}
            </Link>
            <button
              type="button"
              onClick={() => {
                onToggleLanguage();
                onToggleMenu(false);
              }}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition-colors ${
                isDark
                  ? "border border-slate-700 text-slate-300 hover:border-forest hover:text-forest"
                  : "border border-slate-200 text-slate-700 hover:border-forest hover:text-forest"
              }`}
            >
              {isFrench ? "Switch to English" : "Passer au Français"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
