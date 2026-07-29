import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type ToastType = "success" | "error" | "info";

interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

let toastIdCounter = 0;

const ToastContext = createContext<(type: ToastType, title: string, message: string) => void>(
  () => {},
);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (type: ToastType, title: string, message: string) => {
    const id = `toast-${++toastIdCounter}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`flex items-start gap-3 rounded-xl px-5 py-4 shadow-2xl border transition-all duration-300 ${
              toast.type === "success"
                ? "bg-forest text-white border-forest/30"
                : toast.type === "error"
                  ? "bg-red-600 text-white border-red-600/30"
                  : "bg-ocean text-white border-ocean/30"
            }`}
          >
            <span className="text-lg leading-none mt-0.5">
              {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}
            </span>
            <div>
              <p className="font-bold text-sm">{toast.title}</p>
              <p className="text-xs opacity-90 mt-1 leading-relaxed">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
