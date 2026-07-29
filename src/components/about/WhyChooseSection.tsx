import { motion } from "framer-motion";
import {
  Building2,
  Handshake,
  MapPin,
  CalendarCheck,
  Users,
  MonitorSmartphone,
} from "lucide-react";
import { advantages } from "@/lib/about-data";
import { aboutLabels } from "@/lib/about-data";

interface WhyChooseSectionProps {
  language: "fr" | "en";
}

const iconMap: Record<string, React.ElementType> = {
  Building2,
  Handshake,
  MapPin,
  CalendarCheck,
  Users,
  MonitorSmartphone,
};

export function WhyChooseSection({ language }: WhyChooseSectionProps) {
  const isFrench = language === "fr";
  const labels = aboutLabels[language];
  const advs = advantages[language];

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
              src="/pourquoi.png"
              alt="GabonMICE — About"
              className="w-full h-full object-cover"
              loading="lazy"
              width={1200}
              height={900}
            />
          </div>
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gold/10 rounded-2xl -z-10" />
        </motion.div>

        <div>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-gold font-bold tracking-[0.25em] text-xs uppercase"
          >
            {labels.whyChoose}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-5 text-slate-900 leading-[1.05]"
          >
            {labels.whyChoose}
          </motion.h2>

          <div className="mt-10 flex flex-col gap-6">
            {advs.map((adv, i) => {
              const Icon = iconMap[adv.icon];
              return (
                <motion.div
                  key={adv.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ x: 8 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-forest/10 flex items-center justify-center group-hover:bg-forest transition-colors duration-300">
                    {Icon && (
                      <Icon className="h-5 w-5 text-forest group-hover:text-white transition-colors duration-300" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-slate-900 mb-1">{adv.title}</h4>
                    <p className="text-slate-500 font-light text-sm leading-relaxed">
                      {adv.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
