import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal/LegalPage";
import { privacyPolicy } from "@/lib/legal-content";

// Image d'en-tête provisoire, à remplacer par le visuel définitif.
const HERO_IMAGE = "/libreville.jpg";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité | GabonMICE" },
      {
        name: "description",
        content:
          "Comment GabonMICE et l'AGATOUR collectent, utilisent et protègent vos données personnelles, et comment exercer vos droits.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage
      document={privacyPolicy}
      image={HERO_IMAGE}
      eyebrow={{ fr: "Vos données", en: "Your data" }}
      title={{ fr: "Politique de confidentialité", en: "Privacy policy" }}
      related={{
        to: "/mentions-legales",
        label: { fr: "Consulter les mentions légales", en: "Read the legal notice" },
      }}
    />
  );
}
