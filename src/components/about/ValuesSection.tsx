import { motion } from "framer-motion";
import { Sparkles, Award, ShieldCheck, Star } from "lucide-react";
import { values } from "@/lib/about-data";
import { aboutLabels } from "@/lib/about-data";

interface ValuesSectionProps {
  language: "fr" | "en";
}

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Award,
  ShieldCheck,
  Star,
};

export function ValuesSection({ language }: ValuesSectionProps) {
  const isFrench = language === "fr";
  const labels = aboutLabels[language];
  const vals = values[language];

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-14"
      >
        <span className="text-gold font-bold tracking-[0.25em] text-xs uppercase">
          {labels.ourValues}
        </span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-5 text-slate-900 leading-[1.05]">
          {labels.ourValues}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {vals.map((value, i) => {
          const Icon = iconMap[value.icon];
          return (
            <motion.div
              key={value.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-2xl p-8 border border-slate-200 shadow-soft group transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center mb-6 group-hover:bg-forest group-hover:scale-110 transition-all duration-300">
                {Icon && (
                  <Icon className="h-6 w-6 text-forest group-hover:text-white transition-colors duration-300" />
                )}
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 mb-3">{value.name}</h3>
              <p className="text-slate-500 font-light text-sm leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
