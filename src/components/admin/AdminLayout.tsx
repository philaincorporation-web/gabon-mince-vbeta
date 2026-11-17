import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useRouteContext } from "@tanstack/react-router";
import {
  BadgeCheck,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  Menu,
  Moon,
  ScrollText,
  ShieldCheck,
  Sun,
  UserCheck,
  Users,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { AdminPrefsContext } from "@/components/admin/AdminUI";
import { useSitePrefs } from "@/hooks/use-site-prefs";
import { SUPER_ADMIN_LABEL, type Permission } from "@/lib/admin/permissions";

type NavItem = {
  to: string;
  label: { fr: string; en: string };
  icon: LucideIcon;
  permission?: Permission;
  /** Compteur affiché en pastille (éléments en attente). */
  count?: "demandes" | "validations" | "labels";
  /** Actif uniquement sur l'adresse exacte (tableau de bord). */
  exact?: boolean;
};

const NAV: NavItem[] = [
  {
    to: "/admin",
    label: { fr: "Tableau de bord", en: "Dashboard" },
    icon: LayoutDashboard,
    exact: true,
  },
  {
    to: "/admin/demandes",
    label: { fr: "Demandes", en: "Requests" },
    icon: Inbox,
    permission: "demandes",
    count: "demandes",
  },
  {
    to: "/admin/validations",
    label: { fr: "Comptes à valider", en: "Approvals" },
    icon: UserCheck,
    permission: "validations",
    count: "validations",
  },
  {
    to: "/admin/labels",
    label: { fr: "Prestataires & labels", en: "Providers & labels" },
    icon: BadgeCheck,
    permission: "labels",
    count: "labels",
  },
  {
    to: "/admin/utilisateurs",
    label: { fr: "Utilisateurs", en: "Users" },
    icon: Users,
    permission: "utilisateurs",
  },
  {
    to: "/admin/equipe",
    label: { fr: "Équipe", en: "Team" },
    icon: UsersRound,
    permission: "equipe",
  },
  {
    to: "/admin/roles",
    label: { fr: "Rôles", en: "Roles" },
    icon: ShieldCheck,
    permission: "equipe",
  },
  {
    to: "/admin/journal",
    label: { fr: "Journal", en: "Audit log" },
    icon: ScrollText,
    permission: "journal",
  },
];

export function AdminLayout() {
  const prefs = useSitePrefs();
  const { session, admin } = useRouteContext({ from: "/admin" });
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const { t, language, isDark } = prefs;

  // Ferme le menu mobile après navigation.
  useEffect(() => setOpen(false), [pathname]);

  const items = NAV.filter((i) => !i.permission || admin.permissions.includes(i.permission));
  const roleLabel = admin.roleName ?? SUPER_ADMIN_LABEL[language];

  const sidebar = (
    <div className="flex h-full flex-col bg-forest-deep text-white">
      <div className="flex items-center gap-3 px-6 py-6">
        <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-white">
          <img src="/logo%20GabonMince.png" alt="" className="h-10 w-10 object-contain" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-lg font-extrabold leading-tight">
            Gabon<span className="text-sun">MICE</span>
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
            {t("Administration", "Administration")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={t("Fermer le menu", "Close menu")}
          className="ml-auto rounded-full p-2 hover:bg-white/10 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav
        className="flex-1 space-y-1 overflow-y-auto px-3 py-2"
        aria-label={t("Back office", "Back office")}
      >
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.to || pathname === `${item.to}/`
            : pathname === item.to || pathname.startsWith(`${item.to}/`);
          const count = item.count ? admin.counts[item.count] : 0;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold transition ${
                active
                  ? "bg-white/12 text-white"
                  : "text-white/75 hover:bg-white/6 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="flex-1 truncate">{item.label[language]}</span>
              {count > 0 && (
                <span className="grid min-w-6 place-items-center rounded-full bg-sun px-1.5 py-0.5 text-xs font-bold text-ink">
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-6 py-5">
        <p className="truncate font-semibold">{session.name}</p>
        <p className="truncate text-sm text-white/60">{session.email}</p>
        <span className="mt-2 inline-block rounded-full bg-sun px-3 py-0.5 text-xs font-bold text-ink">
          {roleLabel}
        </span>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={prefs.toggleLanguage}
            className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold hover:bg-white/10"
            aria-label={t("Passer en anglais", "Switch to French")}
          >
            {language === "fr" ? "EN" : "FR"}
          </button>
          <button
            type="button"
            onClick={prefs.toggleTheme}
            className="rounded-full border border-white/20 p-1.5 hover:bg-white/10"
            aria-label={isDark ? t("Mode clair", "Light mode") : t("Mode sombre", "Dark mode")}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
        <a
          href="/"
          className="mt-4 flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" /> {t("Voir le site", "View site")}
        </a>
        <SignOutButton
          label={t("Déconnexion", "Sign out")}
          className="mt-3 w-full border-white/20 text-white hover:bg-white/10 dark:hover:bg-white/10"
        />
      </div>
    </div>
  );

  return (
    <AdminPrefsContext.Provider value={prefs}>
      <div
        lang={language}
        className={`min-h-screen transition-colors duration-300 ${
          isDark ? "dark bg-slate-950 text-slate-100" : "bg-cream text-ink"
        }`}
      >
        {/* Barre latérale fixe (ordinateur) */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 lg:block">{sidebar}</aside>

        {/* Menu tiroir (mobile) */}
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
            <button
              type="button"
              aria-label={t("Fermer le menu", "Close menu")}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-ink/50"
            />
            <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw]">{sidebar}</aside>
          </div>
        )}

        <div className="lg:pl-72">
          <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-black/5 bg-cream/95 px-4 py-3 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-950/95">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t("Ouvrir le menu", "Open menu")}
              className="rounded-full p-2 hover:bg-sand dark:hover:bg-slate-800"
            >
              <Menu className="h-5 w-5" />
            </button>
            <p className="font-display font-extrabold">
              Gabon<span className="text-sun-deep">MICE</span>{" "}
              <span className="text-sm font-semibold text-ink/55 dark:text-slate-400">
                · {t("Administration", "Administration")}
              </span>
            </p>
          </header>
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </AdminPrefsContext.Provider>
  );
}
