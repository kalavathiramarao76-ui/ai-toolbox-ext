import React, { useState } from "react";
import { useAI } from "../hooks/useAI";
import { blogPostPrompt } from "../utils/prompts";
import { OutputPanel } from "./OutputPanel";

const STYLES = ["informational", "how-to guide", "listicle", "opinion", "case study"];

export const BlogGenerator: React.FC = () => {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState(STYLES[0]);
  const [keywords, setKeywords] = useState("");
  const { output, loading, error, generate, stop } = useAI();

  const handleGenerate = () => {
    if (!topic.trim()) return;
    generate(blogPostPrompt(topic, style, keywords));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
        <span className="text-2xl">{"\uD83D\uDCF0"}</span> Blog Post Generator
      </h2>

      <div>
        <label className="block text-sm mb-1" style={{ color: "var(--text-tertiary)" }}>Topic</label>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., How AI is transforming healthcare in 2025"
          className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          style={{ background: "var(--input-bg)", border: "1px solid var(--border-primary)", color: "var(--text-primary)" }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--text-tertiary)" }}>Style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ background: "var(--input-bg)", border: "1px solid var(--border-primary)", color: "var(--text-primary)" }}
          >
            {STYLES.map((s) => (
              <option key={s} value={s} style={{ background: "var(--select-bg)" }}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--text-tertiary)" }}>SEO Keywords</label>
          <input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="ai, healthcare, 2025"
            className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ background: "var(--input-bg)", border: "1px solid var(--border-primary)", color: "var(--text-primary)" }}
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !topic.trim()}
        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Writing..." : "Generate Blog Post"}
      </button>

      <OutputPanel output={output} loading={loading} error={error} toolName="Blog Generator" onStop={stop} />
    </div>
  );
};
