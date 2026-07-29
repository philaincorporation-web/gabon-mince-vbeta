import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Languages } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { homeCopyFr, homeCopyEn } from "@/lib/home-data";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

interface HeroSectionProps {
  language: "fr" | "en";
}

export function HeroSection({ language }: HeroSectionProps) {
  const isFrench = language === "fr";
  const copy = isFrench ? homeCopyFr : homeCopyEn;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-forest rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-ocean rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-24 md:py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.3 }}
            className="max-w-2xl"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest/10 border border-forest/20 mb-8"
            >
              <MapPin className="h-3.5 w-3.5 text-forest" />
              <span className="text-forest text-xs font-bold uppercase tracking-widest">
                {isFrench ? "À propos de GabonMICE" : "About GabonMICE"}
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-8"
            >
              {isFrench
                ? "Organiser vos événements professionnels au Gabon"
                : "Organize your professional events in Gabon"}
              <span className="block text-gold">
                {" "}
                {isFrench ? "n'a jamais été aussi simple." : "has never been easier."}
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-slate-400 font-light leading-relaxed mb-10 max-w-lg"
            >
              {isFrench
                ? "Découvrez une plateforme innovante qui connecte les organisateurs d'événements aux meilleures infrastructures, prestataires et destinations du Gabon."
                : "Discover an innovative platform that connects event organizers to the best infrastructure, providers, and destinations in Gabon."}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/lieux"
                className="inline-flex items-center justify-center px-8 py-4 bg-forest text-white font-bold uppercase tracking-widest text-sm rounded-full shadow-lg shadow-forest/25 hover:bg-forest-deep hover:scale-[1.02] transition-all duration-300"
              >
                {isFrench ? "Explorer le catalogue" : "Explore the catalog"}
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border border-slate-600 text-white font-bold uppercase tracking-widest text-sm rounded-full hover:border-forest hover:text-forest transition-all duration-300"
              >
                {isFrench ? "Nous contacter" : "Contact us"}
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-slate-800">
  <video
    className="w-full h-full object-cover"
    autoPlay
    loop
    muted
    playsInline
    controls
    preload="auto"
    poster="/lemeridien.jpg"
  >
    <source src="/video.mp4" type="video/mp4" />
    Votre navigateur ne prend pas en charge la lecture vidéo.
  </video>
</div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gold/10 rounded-3xl -z-10" />
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-ocean/10 rounded-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
