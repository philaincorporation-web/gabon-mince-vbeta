import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";
import { missionVision } from "@/lib/about-data";
import { aboutLabels } from "@/lib/about-data";

interface MissionVisionSectionProps {
  language: "fr" | "en";
}

export function MissionVisionSection({ language }: MissionVisionSectionProps) {
  const isFrench = language === "fr";
  const labels = aboutLabels[language];
  const mv = missionVision[language];

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-soft"
        >
          <div className="w-14 h-14 rounded-2xl bg-forest/10 flex items-center justify-center mb-6">
            <Target className="h-7 w-7 text-forest" />
          </div>
          <h3 className="font-display text-2xl font-bold text-slate-900 mb-4">
            {mv.mission.title}
          </h3>
          <p className="text-slate-600 font-light leading-relaxed text-base">
            {mv.mission.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="bg-forest text-white rounded-3xl p-8 sm:p-10 shadow-soft"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
            <Eye className="h-7 w-7 text-gold" />
          </div>
          <h3 className="font-display text-2xl font-bold mb-4">{mv.vision.title}</h3>
          <p className="text-white/80 font-light leading-relaxed text-base">
            {mv.vision.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
