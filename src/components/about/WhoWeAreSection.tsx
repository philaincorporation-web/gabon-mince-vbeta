import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { whoWeAreText } from "@/lib/about-data";
import { aboutLabels } from "@/lib/about-data";

interface WhoWeAreSectionProps {
  language: "fr" | "en";
}

export function WhoWeAreSection({ language }: WhoWeAreSectionProps) {
  const isFrench = language === "fr";
  const labels = aboutLabels[language];

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-soft border border-slate-200">
            <img
              src="/welcom.png"
              alt="GabonMICE — Infrastructure"
              className="w-full h-full object-cover"
              loading="lazy"
              width={1200}
              height={900}
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-40 h-40 border-2 border-gold/30 rounded-2xl -z-10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="text-ocean font-bold tracking-[0.25em] text-xs uppercase">
            {labels.aboutUs}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-5 text-slate-900 leading-[1.05]">
            {labels.aboutUs}
          </h2>
          <p className="text-base sm:text-lg font-light leading-relaxed mt-6 text-slate-600">
            {whoWeAreText[language]}
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-2 text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-sm font-semibold text-slate-600">
              Partenaire officiel AGATOUR
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
