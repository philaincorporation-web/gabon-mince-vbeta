import { motion } from "framer-motion";
import { Play } from "lucide-react";

interface VideoSectionProps {
  language: "fr" | "en";
}

export function VideoSection({ language }: VideoSectionProps) {
  const isFrench = language === "fr";

  return (
    <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto"
      >
        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-black/30 border border-slate-800 group cursor-pointer aspect-video">
          <img
            src="/qui.png"
            alt={isFrench ? "GabonMICE — Vidéo de présentation" : "GabonMICE — Presentation video"}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            width={1200}
            height={675}
          />
          <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/50 transition-colors duration-300" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-forest/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
              <Play className="h-8 w-8 text-white ml-1" fill="white" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
