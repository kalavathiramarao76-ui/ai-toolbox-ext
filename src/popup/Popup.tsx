import React from "react";
import { TOOLS } from "../utils/tools";
import { ThemeToggle } from "../components/ThemeToggle";

export const Popup: React.FC = () => {
  const openSidePanel = (toolId?: string) => {
    chrome.runtime.sendMessage({
      type: "OPEN_SIDE_PANEL",
      toolId,
    });
    window.close();
  };

  return (
    <div className="w-[360px] p-4 min-h-[400px]" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">SixForge</h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>6 AI-powered productivity tools</p>
        </div>
        <ThemeToggle />
      </div>

      {/* Tool Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => openSidePanel(tool.id)}
            className="glass glass-hover rounded-xl p-3 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
          >
            <div className="flex items-start gap-2.5">
              <div
                className={`w-9 h-9 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center text-lg shrink-0 shadow-lg`}
              >
                {tool.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                  {tool.name}
                </h3>
                <p className="text-[10px] mt-0.5 leading-snug line-clamp-2" style={{ color: "var(--text-tertiary)" }}>
                  {tool.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--border-primary)" }}>
        <button
          onClick={() => openSidePanel()}
          className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
        >
          Open full workspace
        </button>
        <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>v1.0</span>
      </div>
    </div>
  );
};
