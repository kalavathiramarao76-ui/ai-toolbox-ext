import React, { useState, useEffect } from "react";
import { TOOLS } from "../utils/tools";
import { getTheme, setTheme as saveTheme } from "../utils/storage";
import { EmailWriter } from "../components/EmailWriter";
import { MeetingSummarizer } from "../components/MeetingSummarizer";
import { CodeReviewer } from "../components/CodeReviewer";
import { BlogGenerator } from "../components/BlogGenerator";
import { ProductCopywriter } from "../components/ProductCopywriter";
import { TweetThreadCreator } from "../components/TweetThreadCreator";
import { Favorites } from "../components/Favorites";

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
  const [theme, setThemeState] = useState<"dark" | "light">(getTheme());

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

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setThemeState(next);
    saveTheme(next);
    document.documentElement.classList.toggle("dark");
  };

  const ActiveComponent = TOOL_COMPONENTS[activeTab];
  const activeTool = TOOLS.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 glass border-b border-white/5 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold gradient-text">AI Toolbox</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`p-1.5 rounded-lg transition-colors text-sm ${
                showFavorites
                  ? "bg-violet-500/20 text-violet-400"
                  : "text-white/40 hover:text-white/60 hover:bg-white/5"
              }`}
              title="Favorites"
            >
              {"\u2B50"}
            </button>
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-white/40 hover:text-white/60 hover:bg-white/5 transition-colors text-sm"
              title="Toggle theme"
            >
              {theme === "dark" ? "\u2600\uFE0F" : "\uD83C\uDF19"}
            </button>
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
                    : "text-white/50 hover:text-white/70 hover:bg-white/5"
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
      <footer className="px-4 py-2 border-t border-white/5 text-center">
        <span className="text-[10px] text-white/20">
          AI Toolbox v1.0 — Powered by AI
        </span>
      </footer>
    </div>
  );
};
