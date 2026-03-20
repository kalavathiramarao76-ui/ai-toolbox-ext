import React, { useState } from "react";
import { useAI } from "../hooks/useAI";
import { meetingSummarizerPrompt } from "../utils/prompts";
import { OutputPanel } from "./OutputPanel";

export const MeetingSummarizer: React.FC = () => {
  const [transcript, setTranscript] = useState("");
  const { output, loading, error, generate, stop } = useAI();

  const handleGenerate = () => {
    if (!transcript.trim()) return;
    generate(meetingSummarizerPrompt(transcript));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <span className="text-2xl">{"\uD83D\uDCDD"}</span> Meeting Summarizer
      </h2>

      <div>
        <label className="block text-sm text-white/60 mb-1">
          Paste Meeting Transcript
        </label>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your meeting transcript or notes here..."
          rows={8}
          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !transcript.trim()}
        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Summarizing..." : "Summarize Meeting"}
      </button>

      <OutputPanel output={output} loading={loading} error={error} toolName="Meeting Summarizer" onStop={stop} />
    </div>
  );
};
