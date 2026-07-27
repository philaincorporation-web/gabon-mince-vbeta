import {
  homeCopyFr,
  homeCopyEn,
  type HomeSections,
  type SocialPlatform,
  socialPlatforms,
} from "@/lib/home-data";

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  const className = "h-5 w-5";
  const paths: Record<SocialPlatform, React.ReactNode> = {
    linkedin: (
      <path d="M6.94 8.5A1.56 1.56 0 1 0 6.94 5.38a1.56 1.56 0 0 0 0 3.12ZM5.5 9.75h2.88V18H5.5zM10.27 9.75h2.76v1.12h.04c.38-.72 1.32-1.48 2.72-1.48 2.91 0 3.45 1.91 3.45 4.4V18h-2.88v-7.4c0-1.76-.03-4.03-2.46-4.03-2.46 0-2.84 1.92-2.84 3.9V18H10.27z" />
    ),
    twitter: (
      <path d="M18.9 5H21l-6.2 7.1L22 19h-5.6l-4.3-5.6L7.3 19H5.2l6.7-7.6L2 5h5.7l3.9 5.2L18.9 5Zm-1 12.4h1.1L7.2 6.5H6.1l11.8 10.9Z" />
    ),
    instagram: (
      <>
        <rect x="4.5" y="4.5" width="15" height="15" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </>
    ),
    youtube: (
      <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.8 12 4.8 12 4.8s-5.8 0-7.6.4a2.8 2.8 0 0 0 2 2A29.4 29.4 0 0 0 2 12a29.4 29.4 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.8.4 7.6.4 7.6.4s5.8 0 7.6-.4a2.8 2.8 0 0 0 2-2A29.4 29.4 0 0 0 22 12a29.4 29.4 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
    ),
  };

  const outlined = platform === "instagram";
  return (
    <svg
      viewBox="0 0 24 24"
      fill={outlined ? "none" : "currentColor"}
      stroke={outlined ? "currentColor" : "none"}
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      {paths[platform]}
    </svg>
  );
}

interface SiteFooterProps {
  language: "fr" | "en";
  theme: "light" | "dark";
}

export function SiteFooter({ language, theme }: SiteFooterProps) {
  const isFrench = language === "fr";
  const isDark = theme === "dark";
  const copy = isFrench ? homeCopyFr : homeCopyEn;
  const mutedTextClass = isDark ? "text-slate-400" : "text-slate-500";
  const mutedTextClassStrong = isDark ? "text-slate-300" : "text-slate-600";
  const headingClass = isDark ? "text-slate-100" : "text-slate-900";
  const exploreLinks = [
    [copy.sections.footerLink1, "/lieux"],
    [copy.sections.footerLink2, "/lieux"],
    [copy.sections.footerLink3, "/investir"],
    [copy.sections.footerLink4, "/destinations"],
  ];
  const institutionalLinks = [
    [copy.sections.footerLink5, "/"],
    [copy.sections.footerLink6, "/"],
    [copy.sections.footerLink7, "/actualites"],
    [copy.sections.footerLink8, "/contact"],
  ];

  return (
    <footer
      id="news"
      className={`pt-16 sm:pt-20 md:pt-24 pb-12 border-t transition-colors duration-500 ${isDark ? "bg-slate-900/70 border-slate-800" : "bg-slate-50 border-black/5"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-16 sm:mb-20">
        <div className="md:col-span-2">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-forest/20 bg-white/90 p-1.5 shadow-lg shadow-forest/20 ring-1 ring-forest/10">
              <img
                src="/logo%20GabonMince.png"
                alt="GabonMICE"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-forest">
              GABON<span className="text-ocean">MICE</span>
            </span>
            <img
              src="/LogoAGATOUR.jpg"
              alt="Logo AGATOUR"
              className="h-12 w-auto rounded-lg object-contain bg-white p-1"
            />
          </div>
          <p className={`max-w-md mb-8 font-light leading-relaxed ${mutedTextClass}`}>
            La plateforme officielle du tourisme d'affaires et de loisirs au Gabon. Promouvoir la
            croissance économique à travers des évènements de classe mondiale et une découverte
            guidée par la conservation.
          </p>
          <div className="flex flex-wrap gap-3">
            {socialPlatforms.map((platform) => (
              <a
                key={platform}
                href="#"
                className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${isDark ? "border-slate-700 text-slate-300 hover:border-forest hover:bg-forest hover:text-white" : "border-slate-200 text-slate-500 hover:bg-forest hover:text-white hover:border-forest"}`}
                aria-label={platform}
              >
                <SocialIcon platform={platform} />
              </a>
            ))}
          </div>
        </div>
        <FooterColumn
          title={copy.sections.footerExplore}
          links={exploreLinks}
          headingClass={headingClass}
          mutedTextClass={mutedTextClass}
        />
        <FooterColumn
          title={copy.sections.footerInstitutional}
          links={institutionalLinks}
          headingClass={headingClass}
          mutedTextClass={mutedTextClass}
        />
      </div>
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-8 border-t flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${isDark ? "border-slate-800" : "border-black/5"}`}
      >
        <p className={`text-xs ${mutedTextClassStrong}`}>
          © 2026 GabonMICE. Tous droits réservés. Conçu, développé et maintenu par
          PHILAINCORPORATION.
        </p>
        <div className={`flex flex-wrap gap-4 md:gap-8 text-xs ${mutedTextClassStrong}`}>
          <a href="/confidentialite" className="transition-colors hover:text-forest">
            {copy.sections.footerPrivacy}
          </a>
          <a href="/mentions-legales" className="transition-colors hover:text-forest">
            {copy.sections.footerLegal}
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  headingClass,
  mutedTextClass,
}: {
  title: string;
  links: string[][];
  headingClass: string;
  mutedTextClass: string;
}) {
  return (
    <div>
      <h4 className={`font-bold mb-6 text-xs uppercase tracking-[0.2em] ${headingClass}`}>
        {title}
      </h4>
      <ul className={`space-y-4 font-light text-sm ${mutedTextClass}`}>
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="transition-colors hover:text-forest">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
