import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { HeroSection } from "@/components/about/HeroSection";
import { VideoSection } from "@/components/about/VideoSection";
import { WhoWeAreSection } from "@/components/about/WhoWeAreSection";
import { MissionVisionSection } from "@/components/about/MissionVisionSection";
import { ValuesSection } from "@/components/about/ValuesSection";
import { WhyChooseSection } from "@/components/about/WhyChooseSection";
import { StatsSection } from "@/components/about/StatsSection";
import { MBIGOUCarouselSection } from "@/components/mbigou/MBIGOUCarouselSection";
import { FaqSection } from "@/components/about/FaqSection";
import { CtaSection } from "@/components/about/CtaSection";
import { seo } from "@/lib/about-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: seo.fr.title },
      { name: "description", content: seo.fr.description },
      { property: "og:title", content: seo.fr.title },
      { property: "og:description", content: seo.fr.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell>
      {({ language }) => (
        <>
          <HeroSection language={language} />
          <VideoSection language={language} />
          <WhoWeAreSection language={language} />
          <MissionVisionSection language={language} />
          <MBIGOUCarouselSection language={language} />
          <WhyChooseSection language={language} />
          <ValuesSection language={language} />
          <StatsSection language={language} />
          <FaqSection language={language} />
          <CtaSection language={language} />
        </>
      )}
    </PageShell>
  );
}
