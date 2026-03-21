import React, { useState, useEffect, useCallback, useRef } from "react";

interface ApiErrorFallbackProps {
  error: string;
  onRetry: () => void;
  onDismiss?: () => void;
}

const RETRY_DELAY = 10; // seconds

export const ApiErrorFallback: React.FC<ApiErrorFallbackProps> = ({ error, onRetry, onDismiss }) => {
  const [countdown, setCountdown] = useState(RETRY_DELAY);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    setCountdown(RETRY_DELAY);
    setPaused(false);
  }, [error]);

  useEffect(() => {
    if (paused) {
      clearTimer();
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearTimer();
          onRetry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [paused, clearTimer, onRetry]);

  const progress = ((RETRY_DELAY - countdown) / RETRY_DELAY) * 100;

  const handleRetryNow = () => {
    clearTimer();
    setCountdown(0);
    onRetry();
  };

  return (
    <div
      className="glass rounded-2xl p-5 my-4 mx-auto max-w-md"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(239, 68, 68, 0.2)",
        boxShadow: "0 4px 24px rgba(239, 68, 68, 0.1)",
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))",
            border: "1px solid rgba(239,68,68,0.15)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            API Error
          </h3>
          <p className="text-xs mt-0.5 break-words" style={{ color: "var(--text-tertiary)" }}>
            {error}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-lg leading-none shrink-0 transition-colors"
            style={{ color: "var(--text-tertiary)" }}
          >
            {"\u00D7"}
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "var(--bg-elevated)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #ef4444, #f97316)",
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
            {paused ? "Paused" : `Retrying in ${countdown}s`}
          </span>
          <button
            onClick={() => setPaused((p) => !p)}
            className="text-[10px] transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            {paused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleRetryNow}
          className="flex-1 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
            boxShadow: "0 4px 12px rgba(139, 92, 246, 0.25)",
          }}
        >
          Retry Now
        </button>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="px-4 py-2 rounded-xl text-xs font-medium transition-colors"
            style={{
              background: "var(--bg-elevated)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-primary)",
            }}
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};
