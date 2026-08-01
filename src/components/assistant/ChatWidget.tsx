import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ChatWidgetProps {
  language: "fr" | "en";
  theme: "light" | "dark";
}

const CHATBOT_ID = "kYooo_D2NEDt-sLe9KMs8";

export function ChatWidget({ language, theme }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDark = theme === "dark";
  const textColor = isDark ? "text-slate-100" : "text-slate-900";
  const borderColor = isDark ? "border-slate-700" : "border-slate-200";
  const headerBg = isDark ? "bg-slate-800" : "bg-slate-50";

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-forest p-0.5 shadow-lg transition-transform hover:scale-105 hover:shadow-xl md:bottom-6 md:right-6`}
        aria-label={
          language === "fr" ? "Ouvrir l'assistant GabonMICE" : "Open GabonMICE assistant"
        }
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex h-full w-full items-center justify-center rounded-full bg-white/15">
          <img
            src="/logoGabonMinceROND.png"
            alt="GabonMICE AI"
            className="h-8 w-8 object-contain"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              t.style.display = "none";
              const fallback = document.createElement("span");
              fallback.textContent = "🦣";
              t.parentElement?.appendChild(fallback);
            }}
          />
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] bg-black/30 md:backdrop-blur-sm"
              aria-label="Close chat overlay"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className={`fixed right-0 bottom-0 z-[100] mx-4 mb-20 flex h-[calc(100vh-100px)] w-full max-w-[380px] flex-col overflow-hidden rounded-3xl border shadow-xl md:mx-0 md:mb-0 md:h-[600px] md:max-w-[420px] ${
                isDark ? "bg-slate-900" : "bg-white"
              } ${borderColor}`}
              >
              <div
                className={`flex items-center justify-between border-b px-5 py-4 ${headerBg} ${borderColor}`}
              >
                <div className="flex items-center gap-3">
                <img
                  src="/logoGabonMinceROND.png"
                  alt="GabonMICE AI"
                  className="h-8 w-8 object-contain dark:brightness-0 dark:invert"
                />
                  <span className={`text-sm font-semibold ${textColor}`}>
                    GabonMICE AI
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  aria-label="Fermer le chat"
                  className="h-7 w-7 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-hidden">
                <iframe
                  src={`https://www.chatbase.co/chatbot-iframe/${CHATBOT_ID}`}
                  title="GabonMICE AI Chatbot"
                  width="100%"
                  height="100%"
                  className="h-full w-full border-0"
                  allow="microphone"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
