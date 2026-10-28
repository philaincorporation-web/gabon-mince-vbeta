import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { HeroSection } from "@/components/home/HeroSection";
import { VenuesSection } from "@/components/home/VenuesSection";
import { BiodiversitySection } from "@/components/home/BiodiversitySection";
import { DestinationsSection } from "@/components/home/DestinationsSection";
import { InvestSection } from "@/components/home/InvestSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import {
  CategoriesSection,
  FeatureStrip,
  MapTeaserSection,
  OffersSection,
  PromoBanner,
  RolesSection,
  TwoAnglesSection,
} from "@/components/home/MiceSections";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <PageShell>
      {({ language, theme }) => (
        <>
          <HeroSection language={language} theme={theme} />
          <FeatureStrip language={language} theme={theme} />
          <OffersSection language={language} theme={theme} />
          <CategoriesSection language={language} theme={theme} />
          <RolesSection language={language} theme={theme} />
          <VenuesSection language={language} theme={theme} />
          <TwoAnglesSection language={language} theme={theme} />
          <BiodiversitySection language={language} theme={theme} />
          <DestinationsSection language={language} theme={theme} />
          <MapTeaserSection language={language} theme={theme} />
          <InvestSection language={language} theme={theme} />
          <TestimonialsSection language={language} theme={theme} />
          <PromoBanner language={language} theme={theme} />
        </>
      )}
    </PageShell>
  );
}
