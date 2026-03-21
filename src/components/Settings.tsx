import React, { useState, useEffect, useCallback } from "react";
import { ThemeMode } from "./ThemeToggle";

interface SettingsData {
  endpointUrl: string;
  model: string;
  themeMode: ThemeMode;
}

const SETTINGS_KEY = "ai_toolbox_settings";
const THEME_STORAGE_KEY = "ai_toolbox_theme_mode";

const AVAILABLE_MODELS = [
  { id: "gpt-oss:120b", name: "GPT-OSS 120B", description: "Balanced performance" },
  { id: "gpt-oss:70b", name: "GPT-OSS 70B", description: "Faster responses" },
  { id: "gpt-oss:7b", name: "GPT-OSS 7B", description: "Lightweight & quick" },
];

const DEFAULT_SETTINGS: SettingsData = {
  endpointUrl: "https://sai.sharedllm.com/v1/chat/completions",
  model: "gpt-oss:120b",
  themeMode: "dark",
};

function loadSettings(): SettingsData {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {}
  return { ...DEFAULT_SETTINGS };
}

function saveSettings(settings: SettingsData): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  try {
    chrome.storage?.local?.set({ [SETTINGS_KEY]: settings });
  } catch {}
}

// Export for api.ts to consume
export function getSettingsSync(): SettingsData {
  return loadSettings();
}

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>(loadSettings);
  const [saved, setSaved] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  // Load theme mode from theme storage
  useEffect(() => {
    const themeMode = (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) || "dark";
    setSettings((prev) => ({ ...prev, themeMode }));
  }, []);

  const updateSetting = useCallback(<K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      saveSettings(next);
      return next;
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  const handleThemeChange = useCallback((mode: ThemeMode) => {
    updateSetting("themeMode", mode);
    // Apply theme
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    try {
      chrome.storage?.local?.set({ [THEME_STORAGE_KEY]: mode });
    } catch {}
    const resolved = mode === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : mode;
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
  }, [updateSetting]);

  const handleClearData = useCallback(() => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    // Clear all app data
    const keysToKeep = [THEME_STORAGE_KEY];
    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    try {
      chrome.storage?.local?.clear();
    } catch {}
    setConfirmClear(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [confirmClear]);

  const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3
      className="text-[11px] font-semibold uppercase tracking-wider mb-2"
      style={{ color: "var(--text-tertiary)" }}
    >
      {children}
    </h3>
  );

  return (
    <div className="space-y-5">
      {/* Save indicator */}
      {saved && (
        <div
          className="text-xs text-center py-1.5 rounded-lg"
          style={{
            background: "rgba(34, 197, 94, 0.1)",
            color: "#22c55e",
            border: "1px solid rgba(34, 197, 94, 0.2)",
          }}
        >
          Settings saved
        </div>
      )}

      {/* API Endpoint */}
      <div>
        <SectionTitle>API Endpoint</SectionTitle>
        <input
          type="url"
          value={settings.endpointUrl}
          onChange={(e) => updateSetting("endpointUrl", e.target.value)}
          placeholder="https://api.example.com/v1/chat/completions"
          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
          style={{
            background: "var(--input-bg)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-primary)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(139, 92, 246, 0.5)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border-primary)")}
        />
        <p className="text-[10px] mt-1" style={{ color: "var(--text-tertiary)" }}>
          OpenAI-compatible chat completions endpoint
        </p>
      </div>

      {/* Model Selector */}
      <div>
        <SectionTitle>Model</SectionTitle>
        <div className="space-y-1.5">
          {AVAILABLE_MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => updateSetting("model", m.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
              style={{
                background: settings.model === m.id
                  ? "rgba(139, 92, 246, 0.12)"
                  : "var(--bg-elevated)",
                border: settings.model === m.id
                  ? "1px solid rgba(139, 92, 246, 0.3)"
                  : "1px solid var(--border-primary)",
              }}
            >
              <div
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                style={{
                  borderColor: settings.model === m.id ? "#8b5cf6" : "var(--text-tertiary)",
                }}
              >
                {settings.model === m.id && (
                  <div className="w-2 h-2 rounded-full" style={{ background: "#8b5cf6" }} />
                )}
              </div>
              <div className="min-w-0">
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {m.name}
                </span>
                <span className="text-[10px] ml-2" style={{ color: "var(--text-tertiary)" }}>
                  {m.description}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div>
        <SectionTitle>Theme</SectionTitle>
        <div className="grid grid-cols-3 gap-1.5">
          {(["dark", "light", "system"] as ThemeMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleThemeChange(mode)}
              className="py-2 rounded-xl text-xs font-medium capitalize transition-all"
              style={{
                background: settings.themeMode === mode
                  ? "rgba(139, 92, 246, 0.15)"
                  : "var(--bg-elevated)",
                color: settings.themeMode === mode ? "#8b5cf6" : "var(--text-secondary)",
                border: settings.themeMode === mode
                  ? "1px solid rgba(139, 92, 246, 0.3)"
                  : "1px solid var(--border-primary)",
              }}
            >
              {mode === "dark" ? "Dark" : mode === "light" ? "Light" : "System"}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Data */}
      <div>
        <SectionTitle>Data</SectionTitle>
        <button
          onClick={handleClearData}
          className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: confirmClear
              ? "rgba(239, 68, 68, 0.15)"
              : "var(--bg-elevated)",
            color: confirmClear ? "#ef4444" : "var(--text-secondary)",
            border: confirmClear
              ? "1px solid rgba(239, 68, 68, 0.3)"
              : "1px solid var(--border-primary)",
          }}
        >
          {confirmClear ? "Tap again to confirm" : "Clear All Data"}
        </button>
        <p className="text-[10px] mt-1" style={{ color: "var(--text-tertiary)" }}>
          Removes favorites, history, and cached data
        </p>
      </div>

      {/* About */}
      <div
        className="rounded-xl p-4"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-primary)",
        }}
      >
        <SectionTitle>About</SectionTitle>
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Version</span>
            <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Extension</span>
            <span className="text-xs font-medium gradient-text">ToolSpark AI</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Tools</span>
            <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>6 AI-powered</span>
          </div>
          <p className="text-[10px] mt-2 leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
            AI-powered productivity toolkit for Chrome. Write emails, summarize meetings, review code, and more.
          </p>
        </div>
      </div>
    </div>
  );
};
