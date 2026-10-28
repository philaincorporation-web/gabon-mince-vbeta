import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal/LegalPage";
import { legalNotice } from "@/lib/legal-content";

// Image d'en-tête provisoire, à remplacer par le visuel définitif.
const HERO_IMAGE = "/imageLAC.jpg";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales | GabonMICE" },
      {
        name: "description",
        content:
          "Éditeur, hébergeur, propriété intellectuelle et conditions d'utilisation de la plateforme GabonMICE.",
      },
    ],
  }),
  component: LegalNoticePage,
});

function LegalNoticePage() {
  return (
    <LegalPage
      document={legalNotice}
      image={HERO_IMAGE}
      eyebrow={{ fr: "Informations légales", en: "Legal information" }}
      title={{ fr: "Mentions légales", en: "Legal notice" }}
      related={{
        to: "/confidentialite",
        label: { fr: "Consulter la politique de confidentialité", en: "Read the privacy policy" },
      }}
    />
  );
}
