import React, { useState, useEffect, useCallback } from "react";
import { TOOLS } from "../utils/tools";
import { EmailWriter } from "../components/EmailWriter";
import { MeetingSummarizer } from "../components/MeetingSummarizer";
import { CodeReviewer } from "../components/CodeReviewer";
import { BlogGenerator } from "../components/BlogGenerator";
import { ProductCopywriter } from "../components/ProductCopywriter";
import { TweetThreadCreator } from "../components/TweetThreadCreator";
import { Favorites } from "../components/Favorites";
import { ThemeToggle } from "../components/ThemeToggle";
import { CommandPalette } from "../components/CommandPalette";
import { OnboardingTour } from "../components/OnboardingTour";
import { Settings } from "../components/Settings";

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
  const [showSettings, setShowSettings] = useState(false);

  const handleSelectTool = useCallback((toolId: string) => {
    setActiveTab(toolId);
    setShowFavorites(false);
    setShowSettings(false);
  }, []);

  const handleToggleFavorites = useCallback(() => {
    setShowFavorites((prev) => !prev);
    setShowSettings(false);
  }, []);

  const handleToggleTheme = useCallback(() => {
    // Find the ThemeToggle button and click it
    const btn = document.querySelector('[title^="Theme:"]') as HTMLButtonElement | null;
    btn?.click();
  }, []);

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
      {/* Command Palette */}
      <CommandPalette
        onSelectTool={handleSelectTool}
        onToggleFavorites={handleToggleFavorites}
        onToggleTheme={handleToggleTheme}
      />

      {/* Onboarding Tour */}
      <OnboardingTour />

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
            <button
              onClick={() => { setShowSettings((prev) => !prev); setShowFavorites(false); }}
              className={`p-1.5 rounded-lg transition-colors text-sm ${
                showSettings
                  ? "bg-violet-500/20 text-violet-400"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
              }`}
              title="Settings"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Tool Tabs */}
        {!showFavorites && !showSettings && (
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
        {showSettings ? <Settings /> : showFavorites ? <Favorites /> : ActiveComponent && <ActiveComponent />}
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
