import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatWithChatbase, type ChatMessage } from "@/lib/ai/chatbase.server";

interface ChatWidgetProps {
  language: "fr" | "en";
  theme: "light" | "dark";
}

export function ChatWidget({ language, theme }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        language === "fr"
          ? "Bonjour ! Je suis GabonMICE AI, votre assistant pour découvrir le Gabon et organiser vos événements MICE. Comment puis-je vous aider ?"
          : "Hello! I'm GabonMICE AI, your assistant for discovering Gabon and organizing MICE events. How can I help you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isDark = theme === "dark";
  const textColor = isDark ? "text-slate-100" : "text-slate-900";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const inputBg = isDark
    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-400"
    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400";

  useEffect(() => {
    inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function sendMessage(text: string) {
    const message = text.trim();
    if (!message || loading) return;

    const userMessage: ChatMessage = { role: "user", content: message };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const result = await chatWithChatbase({
        data: { messages: newMessages, stream: false },
      });
      setMessages((prev) => [...prev, { role: "assistant", content: result.reply }]);
    } catch (err) {
      console.error("[ChatWidget] Server error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            language === "fr"
              ? "Désolé, une erreur est survenue. Veuillez réessayer plus tard."
              : "Sorry, something went wrong. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-[9998] flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-shadow hover:shadow-xl ${
          isDark ? "bg-forest" : "bg-forest"
        }`}
        aria-label={language === "fr" ? "Ouvrir l'assistant GabonMICE" : "Open GabonMICE assistant"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src="/logoGabonMinceROND.png"
          alt="GabonMICE AI"
          className="h-7 w-7 object-contain"
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9998] bg-black/30 md:backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className={`fixed bottom-0 left-0 right-0 z-[9999] mx-auto flex h-[60vh] w-full max-w-[380px] flex-col overflow-hidden rounded-t-3xl border shadow-xl md:relative md:bottom-auto md:left-auto md:right-auto md:h-[600px] md:max-w-[420px] md:rounded-3xl ${
                isDark
                  ? "bg-slate-900 border-slate-700"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="relative flex items-center justify-between border-b px-5 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/logoGabonMinceROND.png"
                    alt="GabonMICE AI"
                    className="h-8 w-8 object-contain"
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

              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-3 hide-scrollbar"
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <img
                        src="/logoGabonMinceROND.png"
                        alt="GabonMICE AI"
                        className="mr-2 h-6 w-6 self-end object-contain opacity-80"
                      />
                    )}
                    <div
                      className={`max-w-[80%] rounded-3xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "rounded-br-sm bg-forest text-white"
                          : isDark
                          ? "rounded-bl-sm bg-slate-800 text-slate-100"
                          : "rounded-bl-sm bg-slate-100 text-slate-800"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-start justify-start gap-2">
                    <img
                      src="/logoGabonMinceROND.png"
                      alt="GabonMICE AI"
                      className="h-6 w-6 opacity-80"
                    />
                    <div
                      className={`flex items-center gap-1 rounded-3xl rounded-bl-sm px-4 py-3 text-sm ${
                        isDark ? "bg-slate-800 text-slate-100" : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      <span
                        className={`flex h-2 w-2 animate-bounce rounded-full ${isDark ? "bg-slate-400" : "bg-slate-400"}`}
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className={`flex h-2 w-2 animate-bounce rounded-full ${isDark ? "bg-slate-400" : "bg-slate-400"}`}
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className={`flex h-2 w-2 animate-bounce rounded-full ${isDark ? "bg-slate-400" : "bg-slate-400"}`}
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t px-4 py-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(input);
                  }}
                  className="flex items-center gap-2"
                >
                  <Input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      language === "fr" ? "Votre question..." : "Your question..."
                    }
                    disabled={loading}
                    className={`flex-1 rounded-full border-2 bg-transparent px-4 py-2.5 text-sm focus:border-forest focus:ring-0 ${inputBg} ${muted}`}
                  />
                  <Button
                    type="submit"
                    variant={input.trim() && !loading ? "default" : "secondary"}
                    disabled={loading || !input.trim()}
                    aria-label={language === "fr" ? "Envoyer" : "Send"}
                    className="h-10 w-10 shrink-0 rounded-full bg-forest text-white hover:bg-forest-deep disabled:opacity-50"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <path d="M22 2L11 13v8l11-11z" />
                    </svg>
                  </Button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
