import React, { useEffect, useRef } from "react";
import { addFavorite } from "../utils/storage";
import { useToast } from "./Toast";

interface Props {
  output: string;
  loading: boolean;
  error: string | null;
  toolName: string;
  onStop?: () => void;
}

export const OutputPanel: React.FC<Props> = ({
  output,
  loading,
  error,
  toolName,
  onStop,
}) => {
  const { toast } = useToast();
  const prevLoadingRef = useRef(loading);

  // Fire toast when generation completes
  useEffect(() => {
    if (prevLoadingRef.current && !loading && output && !error) {
      toast("Generation complete!", "success");
    }
    prevLoadingRef.current = loading;
  }, [loading, output, error, toast]);

  // Fire toast on error
  useEffect(() => {
    if (error) {
      toast(error, "error");
    }
  }, [error, toast]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast("Copied to clipboard", "success");
    } catch {
      toast("Failed to copy", "error");
    }
  };

  const handleSave = () => {
    addFavorite({
      tool: toolName,
      title: output.slice(0, 60) + (output.length > 60 ? "..." : ""),
      content: output,
    });
    toast("Saved to favorites", "info");
  };

  if (!output && !loading && !error) return null;

  return (
    <div className="mt-4 rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-primary)", background: "var(--bg-elevated)" }}>
      <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: "1px solid var(--border-primary)", background: "var(--bg-elevated)" }}>
        <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Output</span>
        <div className="flex gap-2">
          {loading && onStop && (
            <button
              onClick={onStop}
              className="px-3 py-1 text-xs rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              Stop
            </button>
          )}
          {output && (
            <>
              <button
                onClick={handleCopy}
                className="px-3 py-1 text-xs rounded-lg transition-colors"
                style={{ background: "var(--bg-elevated-hover)", color: "var(--text-secondary)" }}
              >
                Copy
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 text-xs rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 transition-colors"
              >
                Favorite
              </button>
            </>
          )}
        </div>
      </div>
      <div className="p-4 max-h-[500px] overflow-y-auto">
        {error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : (
          <div className="text-sm whitespace-pre-wrap leading-relaxed font-mono" style={{ color: "var(--text-primary)" }}>
            {output}
            {loading && (
              <span className="inline-block w-2 h-4 bg-violet-400 animate-pulse ml-0.5" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
