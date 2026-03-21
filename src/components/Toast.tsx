import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  exiting?: boolean;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export const useToast = () => useContext(ToastContext);

const TOAST_DURATION = 4000;
const MAX_TOASTS = 3;

const ACCENT_COLORS: Record<ToastType, string> = {
  success: "#22c55e",
  error: "#ef4444",
  info: "#8b5cf6",
};

const ICONS: Record<ToastType, string> = {
  success: "\u2713",
  error: "\u2717",
  info: "\u2139",
};

const ToastCard: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({
  toast: t,
  onDismiss,
}) => {
  return (
    <div
      className={`toast-card ${t.exiting ? "toast-exit" : "toast-enter"}`}
      style={{ borderLeftColor: ACCENT_COLORS[t.type] }}
    >
      <span
        className="toast-icon"
        style={{ color: ACCENT_COLORS[t.type] }}
      >
        {ICONS[t.type]}
      </span>
      <span className="toast-message">{t.message}</span>
      <button className="toast-close" onClick={() => onDismiss(t.id)}>
        \u00D7
      </button>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());

  const dismiss = useCallback((id: string) => {
    // Mark as exiting for animation
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 250);
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = crypto.randomUUID();
      setToasts((prev) => {
        const next = [...prev, { id, message, type }];
        // If over max, remove oldest
        if (next.length > MAX_TOASTS) {
          const removed = next.shift();
          if (removed) {
            const timer = timersRef.current.get(removed.id);
            if (timer) {
              clearTimeout(timer);
              timersRef.current.delete(removed.id);
            }
          }
        }
        return next;
      });

      const timer = window.setTimeout(() => dismiss(id), TOAST_DURATION);
      timersRef.current.set(id, timer);
    },
    [dismiss]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
