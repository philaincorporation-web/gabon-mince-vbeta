import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/lib/about-data";
import { aboutLabels } from "@/lib/about-data";

interface FaqSectionProps {
  language: "fr" | "en";
}

export function FaqSection({ language }: FaqSectionProps) {
  const isFrench = language === "fr";
  const labels = aboutLabels[language];
  const faqsData = faqs[language];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <span className="text-ocean font-bold tracking-[0.25em] text-xs uppercase">FAQ</span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-5 text-slate-900 leading-[1.05]">
          {labels.faq}
        </h2>
      </motion.div>

      <div className="flex flex-col gap-3">
        {faqsData.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-soft"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors duration-200"
                aria-expanded={isOpen}
              >
                <h3 className="font-display text-base sm:text-lg font-bold pr-4 text-slate-900">
                  {faq.q}
                </h3>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0"
                >
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                </motion.div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-slate-600 font-light leading-relaxed text-base">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
