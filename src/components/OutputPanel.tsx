import React, { useState } from "react";
import { addFavorite } from "../utils/storage";

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
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    addFavorite({
      tool: toolName,
      title: output.slice(0, 60) + (output.length > 60 ? "..." : ""),
      content: output,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!output && !loading && !error) return null;

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
        <span className="text-sm font-medium text-white/70">Output</span>
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
                className="px-3 py-1 text-xs rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 text-xs rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 transition-colors"
              >
                {saved ? "Saved!" : "Favorite"}
              </button>
            </>
          )}
        </div>
      </div>
      <div className="p-4 max-h-[500px] overflow-y-auto">
        {error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : (
          <div className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed font-mono">
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
