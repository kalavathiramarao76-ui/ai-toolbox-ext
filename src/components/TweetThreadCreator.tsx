import React, { useState } from "react";
import { useAI } from "../hooks/useAI";
import { tweetThreadPrompt } from "../utils/prompts";
import { OutputPanel } from "./OutputPanel";

const STYLES = ["educational", "storytelling", "controversial", "motivational", "data-driven"];

export const TweetThreadCreator: React.FC = () => {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState(STYLES[0]);
  const [count, setCount] = useState(7);
  const { output, loading, error, generate, stop } = useAI();

  const handleGenerate = () => {
    if (!topic.trim()) return;
    generate(tweetThreadPrompt(topic, style, count));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <span className="text-2xl">{"\uD83E\uDDF5"}</span> Tweet Thread Creator
      </h2>

      <div>
        <label className="block text-sm text-white/60 mb-1">Topic</label>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Why most startups fail in their first year"
          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-white/60 mb-1">Style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {STYLES.map((s) => (
              <option key={s} value={s} className="bg-gray-900">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Thread Length: {count}</label>
          <input
            type="range"
            min={5}
            max={10}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full mt-2 accent-sky-500"
          />
          <div className="flex justify-between text-xs text-white/40 mt-1">
            <span>5</span><span>10</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !topic.trim()}
        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : `Generate ${count}-Tweet Thread`}
      </button>

      <OutputPanel output={output} loading={loading} error={error} toolName="Tweet Thread Creator" onStop={stop} />
    </div>
  );
};
