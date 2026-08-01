import { useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatWidgetProps {
  language: "fr" | "en";
  theme: "light" | "dark";
}

const CHATBOT_ID = "kYooo_D2NEDt-sLe9KMs8";

export function ChatWidget({ language, theme }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDark = theme === "dark";
  const bubbleColor = isDark ? "bg-forest" : "bg-forest";

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-[9998] flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-colors ${bubbleColor}`}
        aria-label="Open chat"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
          >
            <div
              className={`relative flex h-[700px] w-[95vw] max-w-[420px] flex-col overflow-hidden rounded-2xl border shadow-2xl ${
                isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
              }`}
            >
              <div className="absolute top-0 right-0 z-10 flex items-center gap-2 bg-slate-100 px-2 py-1">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <iframe
                src={`https://www.chatbase.co/chatbot-iframe/${CHATBOT_ID}`}
                title="GabonMICE AI Chatbot"
                width="100%"
                height="700"
                style={{ border: "none", height: "100%", minHeight: "700px" }}
                frameBorder="0"
                allow="microphone"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
