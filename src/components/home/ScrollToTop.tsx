import { useEffect, useState } from "react";

interface ScrollToTopProps {
  label: string;
  theme: "light" | "dark";
}

export function ScrollToTop({ label, theme }: ScrollToTopProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 220;
      setShowScrollTop(window.scrollY > 260 || atBottom);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!showScrollTop) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={label}
      className="fixed bottom-5 right-5 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-forest text-white shadow-xl shadow-forest/30 transition-transform hover:scale-105"
    >
      ↑
    </button>
  );
}
