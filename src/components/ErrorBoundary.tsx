import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[SixForge] Uncaught error:", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--bg-primary)" }}>
          <div
            className="glass rounded-2xl p-6 max-w-sm w-full text-center"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid var(--glass-border)",
              boxShadow: "0 8px 32px rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(139, 92, 246, 0.1)",
            }}
          >
            {/* Crash icon */}
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
              style={{
                background: "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h2 className="text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>
              Something went wrong
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--text-tertiary)" }}>
              {this.state.error?.message || "An unexpected error occurred"}
            </p>

            {/* Error details collapsed */}
            <details className="text-left mb-4">
              <summary
                className="text-xs cursor-pointer mb-1"
                style={{ color: "var(--text-tertiary)" }}
              >
                Error details
              </summary>
              <pre
                className="text-[10px] p-2 rounded-lg overflow-auto max-h-24"
                style={{
                  background: "var(--bg-elevated)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-primary)",
                }}
              >
                {this.state.error?.stack || "No stack trace available"}
              </pre>
            </details>

            <button
              onClick={this.handleRetry}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                boxShadow: "0 4px 16px rgba(139, 92, 246, 0.3)",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
