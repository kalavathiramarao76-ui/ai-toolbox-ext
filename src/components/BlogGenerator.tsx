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
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <span className="text-2xl">{"\uD83D\uDCF0"}</span> Blog Post Generator
      </h2>

      <div>
        <label className="block text-sm text-white/60 mb-1">Topic</label>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., How AI is transforming healthcare in 2025"
          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-white/60 mb-1">Style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {STYLES.map((s) => (
              <option key={s} value={s} className="bg-gray-900">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">SEO Keywords</label>
          <input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="ai, healthcare, 2025"
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
