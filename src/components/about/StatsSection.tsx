import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { stats } from "@/lib/about-data";
import { aboutLabels } from "@/lib/about-data";

interface AnimatedCounterProps {
  value: number;
  suffix: string;
}

function AnimatedCounter({ value, suffix }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    const duration = 2000;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * value));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);

    return () => {
      if (ref.current) {
        // reset on next view
      }
    };
  }, [isInView, value]);

  useEffect(() => {
    if (!isInView) {
      setDisplayValue(0);
    }
  }, [isInView]);

  return (
    <span ref={ref} className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white">
      {displayValue}
      {suffix}
    </span>
  );
}

interface StatsSectionProps {
  language: "fr" | "en";
}

export function StatsSection({ language }: StatsSectionProps) {
  const isFrench = language === "fr";
  const labels = aboutLabels[language];
  const s = stats[language];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-forest relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-gold rounded-full blur-[80px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-gold font-bold tracking-[0.25em] text-xs uppercase">
            {labels.impact}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-5 text-white leading-[1.05]">
            {labels.chiffresCles}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {s.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center"
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="text-white/70 font-light text-sm mt-3">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
