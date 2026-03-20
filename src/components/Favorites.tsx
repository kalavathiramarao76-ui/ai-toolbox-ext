import React, { useState, useEffect } from "react";
import { getFavorites, removeFavorite, FavoriteItem } from "../utils/storage";

export const Favorites: React.FC = () => {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setItems(getFavorites());
  }, []);

  const handleRemove = (id: string) => {
    removeFavorite(id);
    setItems(getFavorites());
  };

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-white/40">
        <span className="text-4xl mb-3">{"\u2B50"}</span>
        <p className="text-sm">No favorites yet</p>
        <p className="text-xs mt-1">Save outputs to find them here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <span className="text-2xl">{"\u2B50"}</span> Favorites
      </h2>
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden"
        >
          <div
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => setExpanded(expanded === item.id ? null : item.id)}
          >
            <div className="flex-1 min-w-0">
              <span className="text-xs text-violet-400 font-medium">{item.tool}</span>
              <p className="text-sm text-white/80 truncate mt-0.5">{item.title}</p>
            </div>
            <span className="text-white/40 text-xs ml-2">
              {new Date(item.timestamp).toLocaleDateString()}
            </span>
          </div>
          {expanded === item.id && (
            <div className="px-4 pb-3 border-t border-white/10">
              <pre className="text-xs text-white/70 whitespace-pre-wrap mt-3 max-h-48 overflow-y-auto">
                {item.content}
              </pre>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleCopy(item.content)}
                  className="px-3 py-1 text-xs rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
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
