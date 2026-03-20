import React, { useState } from "react";
import { useAI } from "../hooks/useAI";
import { emailWriterPrompt } from "../utils/prompts";
import { OutputPanel } from "./OutputPanel";

const EMAIL_TYPES = ["reply", "cold outreach", "follow-up", "apology"];
const TONES = ["professional", "friendly", "formal", "casual", "persuasive"];

export const EmailWriter: React.FC = () => {
  const [type, setType] = useState(EMAIL_TYPES[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [context, setContext] = useState("");
  const { output, loading, error, generate, stop } = useAI();

  const handleGenerate = () => {
    if (!context.trim()) return;
    generate(emailWriterPrompt(type, tone, context));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <span className="text-2xl">{"\u2709\uFE0F"}</span> Email Writer
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-white/60 mb-1">Email Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {EMAIL_TYPES.map((t) => (
              <option key={t} value={t} className="bg-gray-900">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {TONES.map((t) => (
              <option key={t} value={t} className="bg-gray-900">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-1">Context / Instructions</label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Describe what the email should be about, who it's to, key points to cover..."
          rows={4}
          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !context.trim()}
        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Writing..." : "Generate Email"}
      </button>

      <OutputPanel output={output} loading={loading} error={error} toolName="Email Writer" onStop={stop} />
    </div>
  );
};
