import React, { useState, useEffect } from "react";
import { getFavorites, removeFavorite, FavoriteItem } from "../utils/storage";
import { useToast } from "./Toast";

export const Favorites: React.FC = () => {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setItems(getFavorites());
  }, []);

  const handleRemove = (id: string) => {
    removeFavorite(id);
    setItems(getFavorites());
    toast("Removed from favorites", "info");
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast("Copied to clipboard", "success");
    } catch {
      toast("Failed to copy", "error");
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12" style={{ color: "var(--text-tertiary)" }}>
        <span className="text-4xl mb-3">{"\u2B50"}</span>
        <p className="text-sm">No favorites yet</p>
        <p className="text-xs mt-1">Save outputs to find them here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
        <span className="text-2xl">{"\u2B50"}</span> Favorites
      </h2>
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border-primary)", background: "var(--bg-elevated)" }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 cursor-pointer transition-colors"
            style={{ }}
            onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "")}
          >
            <div className="flex-1 min-w-0">
              <span className="text-xs text-violet-400 font-medium">{item.tool}</span>
              <p className="text-sm truncate mt-0.5" style={{ color: "var(--text-secondary)" }}>{item.title}</p>
            </div>
            <span className="text-xs ml-2" style={{ color: "var(--text-tertiary)" }}>
              {new Date(item.timestamp).toLocaleDateString()}
            </span>
          </div>
          {expanded === item.id && (
            <div className="px-4 pb-3" style={{ borderTop: "1px solid var(--border-primary)" }}>
              <pre className="text-xs whitespace-pre-wrap mt-3 max-h-48 overflow-y-auto" style={{ color: "var(--text-secondary)" }}>
                {item.content}
              </pre>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleCopy(item.content)}
                  className="px-3 py-1 text-xs rounded-lg transition-colors"
                  style={{ background: "var(--bg-elevated-hover)", color: "var(--text-secondary)" }}
                >
                  Copy
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="px-3 py-1 text-xs rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
