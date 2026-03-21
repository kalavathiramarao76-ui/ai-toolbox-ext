import React, { useState, useEffect } from "react";
import { TOOLS } from "../utils/tools";
import { EmailWriter } from "../components/EmailWriter";
import { MeetingSummarizer } from "../components/MeetingSummarizer";
import { CodeReviewer } from "../components/CodeReviewer";
import { BlogGenerator } from "../components/BlogGenerator";
import { ProductCopywriter } from "../components/ProductCopywriter";
import { TweetThreadCreator } from "../components/TweetThreadCreator";
import { Favorites } from "../components/Favorites";
import { ThemeToggle } from "../components/ThemeToggle";

const TOOL_COMPONENTS: Record<string, React.FC> = {
  email: EmailWriter,
  meeting: MeetingSummarizer,
  code: CodeReviewer,
  blog: BlogGenerator,
  product: ProductCopywriter,
  tweet: TweetThreadCreator,
};

export const SidePanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState("email");
  const [showFavorites, setShowFavorites] = useState(false);

  // Listen for tool selection from popup/context menu
  useEffect(() => {
    const listener = (message: { type: string; toolId?: string; text?: string }) => {
      if (message.type === "SELECT_TOOL" && message.toolId) {
        setActiveTab(message.toolId);
        setShowFavorites(false);
      }
    };
    chrome.runtime?.onMessage?.addListener(listener);
    return () => chrome.runtime?.onMessage?.removeListener(listener);
  }, []);

  const ActiveComponent = TOOL_COMPONENTS[activeTab];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <header className="sticky top-0 z-10 glass px-4 py-3" style={{ borderBottom: "1px solid var(--border-primary)" }}>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold gradient-text">ToolSpark AI</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`p-1.5 rounded-lg transition-colors text-sm ${
                showFavorites
                  ? "bg-violet-500/20 text-violet-400"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
              }`}
              title="Favorites"
            >
              {"\u2B50"}
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Tool Tabs */}
        {!showFavorites && (
          <div className="flex gap-1 mt-3 overflow-x-auto pb-1 scrollbar-hide">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === tool.id
                    ? `bg-gradient-to-r ${tool.color} text-white shadow-lg`
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
                }`}
              >
                <span>{tool.icon}</span>
                <span>{tool.name}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 p-4 overflow-y-auto">
        {showFavorites ? <Favorites /> : ActiveComponent && <ActiveComponent />}
      </main>

      {/* Footer */}
      <footer className="px-4 py-2 text-center" style={{ borderTop: "1px solid var(--border-primary)" }}>
        <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
          ToolSpark AI v1.0 — Powered by AI
        </span>
      </footer>
    </div>
  );
};
