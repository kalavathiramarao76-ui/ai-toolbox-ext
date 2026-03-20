import React, { useState } from "react";
import { useAI } from "../hooks/useAI";
import { codeReviewerPrompt } from "../utils/prompts";
import { OutputPanel } from "./OutputPanel";

const LANGUAGES = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "Go",
  "Rust", "Ruby", "PHP", "Swift", "Kotlin", "C#", "SQL", "Other"
];

export const CodeReviewer: React.FC = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const { output, loading, error, generate, stop } = useAI();

  const handleGenerate = () => {
    if (!code.trim()) return;
    generate(codeReviewerPrompt(code, language));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <span className="text-2xl">{"\uD83D\uDD0D"}</span> Code Reviewer
      </h2>

      <div>
        <label className="block text-sm text-white/60 mb-1">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l} className="bg-gray-900">{l}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-1">Paste Code</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here for review..."
          rows={10}
          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-mono"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !code.trim()}
        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Reviewing..." : "Review Code"}
      </button>

      <OutputPanel output={output} loading={loading} error={error} toolName="Code Reviewer" onStop={stop} />
    </div>
  );
};
