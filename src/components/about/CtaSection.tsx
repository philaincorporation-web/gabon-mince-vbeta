import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { aboutLabels } from "@/lib/about-data";

interface CtaSectionProps {
  language: "fr" | "en";
}

export function CtaSection({ language }: CtaSectionProps) {
  const isFrench = language === "fr";
  const labels = aboutLabels[language];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-slate-950 px-4 sm:px-6 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.05]">
          {labels.ctaTitle}
        </h2>
        <p className="text-lg text-slate-400 font-light leading-relaxed mt-6">{labels.ctaText}</p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/lieux"
            className="inline-flex items-center justify-center px-8 py-4 bg-forest text-white font-bold uppercase tracking-widest text-sm rounded-full shadow-lg shadow-forest/25 hover:bg-forest-deep hover:scale-[1.02] transition-all duration-300"
          >
            {labels.exploreCatalog}
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-8 py-4 border border-slate-600 text-white font-bold uppercase tracking-widest text-sm rounded-full hover:border-forest hover:text-forest transition-all duration-300"
          >
            {labels.contactUs}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
