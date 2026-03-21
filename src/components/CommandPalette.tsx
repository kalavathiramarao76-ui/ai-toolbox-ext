import React, { useState, useEffect, useRef, useCallback } from "react";
import { TOOLS } from "../utils/tools";

interface Command {
  id: string;
  label: string;
  icon: string;
  category: "tool" | "action";
  action: () => void;
}

interface Props {
  onSelectTool: (toolId: string) => void;
  onToggleFavorites: () => void;
  onToggleTheme: () => void;
}

const RECENT_KEY = "ai_toolbox_recent_commands";
const MAX_RECENT = 5;

function getRecentIds(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function pushRecent(id: string): void {
  const recent = getRecentIds().filter((r) => r !== id);
  recent.unshift(id);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return true;
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

export const CommandPalette: React.FC<Props> = ({
  onSelectTool,
  onToggleFavorites,
  onToggleTheme,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands: Command[] = [
    ...TOOLS.map((tool) => ({
      id: `tool:${tool.id}`,
      label: tool.name,
      icon: tool.icon,
      category: "tool" as const,
      action: () => onSelectTool(tool.id),
    })),
    {
      id: "action:favorites",
      label: "Favorites",
      icon: "\u2B50",
      category: "action",
      action: onToggleFavorites,
    },
    {
      id: "action:theme",
      label: "Toggle Theme",
      icon: "\uD83C\uDF13",
      category: "action",
      action: onToggleTheme,
    },
    {
      id: "action:settings",
      label: "Settings",
      icon: "\u2699\uFE0F",
      category: "action",
      action: () => {},
    },
    {
      id: "action:help",
      label: "Help",
      icon: "\u2753",
      category: "action",
      action: () => {
        window.open("https://toolspark.ai/help", "_blank");
      },
    },
  ];

  const filtered = query.trim()
    ? commands.filter((c) => fuzzyMatch(query, c.label))
    : (() => {
        const recentIds = getRecentIds();
        const recent = recentIds
          .map((id) => commands.find((c) => c.id === id))
          .filter(Boolean) as Command[];
        const rest = commands.filter((c) => !recentIds.includes(c.id));
        return [...recent, ...rest];
      })();

  const execute = useCallback(
    (cmd: Command) => {
      pushRecent(cmd.id);
      cmd.action();
      setOpen(false);
      setQuery("");
    },
    []
  );

  // Keyboard shortcut: Cmd/Ctrl+Shift+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setSelectedIndex(0);
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Reset index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.children[selectedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      execute(filtered[selectedIndex]);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-start justify-center pt-[15%]"
      onClick={() => {
        setOpen(false);
        setQuery("");
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Palette */}
      <div
        className="cmd-palette relative w-full max-w-[380px] mx-4 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--toast-bg)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid var(--glass-border)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.35), 0 0 1px rgba(139,92,246,0.3)",
          animation: "cmd-palette-in 0.2s cubic-bezier(0.16,1,0.3,1) forwards",
        }}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid var(--border-primary)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-tertiary)", flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent border-none outline-none text-sm"
            style={{ color: "var(--text-primary)" }}
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--bg-elevated)", color: "var(--text-tertiary)", border: "1px solid var(--border-primary)" }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[320px] overflow-y-auto py-2">
          {filtered.length === 0 && (
            <div className="px-4 py-6 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
              No commands found
            </div>
          )}
          {filtered.map((cmd, i) => {
            const isRecent = !query.trim() && getRecentIds().includes(cmd.id);
            return (
              <button
                key={cmd.id}
                onClick={() => execute(cmd)}
                onMouseEnter={() => setSelectedIndex(i)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                style={{
                  background: i === selectedIndex ? "var(--bg-elevated-hover)" : "transparent",
                  color: "var(--text-primary)",
                }}
              >
                <span className="text-base w-6 text-center flex-shrink-0">{cmd.icon}</span>
                <span className="text-sm flex-1">{cmd.label}</span>
                {isRecent && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--bg-elevated)", color: "var(--text-tertiary)" }}>
                    Recent
                  </span>
                )}
                <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                  {cmd.category === "tool" ? "Tool" : "Action"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-3 px-4 py-2 text-[10px]" style={{ borderTop: "1px solid var(--border-primary)", color: "var(--text-tertiary)" }}>
          <span>\u2191\u2193 navigate</span>
          <span>\u21B5 select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
};
