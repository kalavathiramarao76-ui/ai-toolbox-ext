import React, { useState, useEffect } from "react";
import { TOOLS } from "../utils/tools";

const ONBOARDING_KEY = "ai_toolbox_onboarding_done";

function isOnboardingDone(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === "true";
  } catch {
    return false;
  }
}

function markOnboardingDone(): void {
  localStorage.setItem(ONBOARDING_KEY, "true");
}

interface StepConfig {
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

// Minimal confetti burst
const ConfettiBurst: React.FC = () => {
  const [particles] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.4,
      duration: 0.8 + Math.random() * 0.6,
      color: ["#8b5cf6", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444", "#ec4899"][
        Math.floor(Math.random() * 6)
      ],
      size: 4 + Math.random() * 4,
      angle: -90 + (Math.random() - 0.5) * 120,
      distance: 80 + Math.random() * 160,
    }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;
        return (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              bottom: "40%",
              width: p.size,
              height: p.size,
              background: p.color,
              animation: `confetti-pop ${p.duration}s ${p.delay}s cubic-bezier(0.25,0.46,0.45,0.94) forwards`,
              // @ts-ignore
              "--tx": `${tx}px`,
              "--ty": `${ty}px`,
              opacity: 0,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
};

export const OnboardingTour: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!isOnboardingDone()) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const finish = () => {
    markOnboardingDone();
    setVisible(false);
  };

  const next = () => {
    if (step < 2) {
      setStep(step + 1);
      if (step + 1 === 2) {
        setShowConfetti(true);
      }
    } else {
      finish();
    }
  };

  const steps: StepConfig[] = [
    {
      title: "Welcome to ToolSpark AI",
      subtitle: "6 powerful AI tools, one extension",
      content: (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {TOOLS.map((tool) => (
            <div
              key={tool.id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: "var(--bg-elevated)" }}
            >
              <span className="text-lg">{tool.icon}</span>
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                {tool.name}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Select any tool",
      subtitle: "Pick a tool, enter your input, and get AI-generated results instantly",
      content: (
        <div className="mt-4 space-y-3">
          {[
            { step: "1", text: "Choose a tool from the tabs above", icon: "\uD83D\uDC46" },
            { step: "2", text: "Fill in the input fields", icon: "\u270D\uFE0F" },
            { step: "3", text: "Click Generate and get results", icon: "\u26A1" },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
              style={{ background: "var(--bg-elevated)" }}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {item.step}
              </div>
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {item.text}
              </span>
              <span className="ml-auto text-base">{item.icon}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Save & share",
      subtitle: "Favorite your best outputs and use the command palette for quick access",
      content: (
        <div className="mt-4 space-y-3">
          {[
            { icon: "\u2B50", label: "Favorites", desc: "Save outputs you love" },
            { icon: "\u2328\uFE0F", label: "Cmd+Shift+K", desc: "Open command palette" },
            { icon: "\uD83C\uDF13", label: "Theme Toggle", desc: "Dark, light, or system" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
              style={{ background: "var(--bg-elevated)" }}
            >
              <span className="text-lg w-7 text-center flex-shrink-0">{item.icon}</span>
              <div>
                <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {item.label}
                </div>
                <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[9997] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <div
        className="relative w-full max-w-[360px] mx-4 rounded-2xl overflow-hidden"
        style={{
          background: "var(--toast-bg)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid var(--glass-border)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.4), 0 0 1px rgba(139,92,246,0.4)",
          animation: "cmd-palette-in 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
        }}
      >
        {showConfetti && step === 2 && <ConfettiBurst />}

        <div className="px-6 pt-6 pb-4 relative z-20">
          {/* Step indicators */}
          <div className="flex gap-1.5 mb-5 justify-center">
            {steps.map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i === step ? 24 : 8,
                  background:
                    i === step
                      ? "linear-gradient(90deg, #8b5cf6, #06b6d4)"
                      : i < step
                      ? "#8b5cf6"
                      : "var(--bg-elevated-hover)",
                }}
              />
            ))}
          </div>

          <h2 className="text-xl font-bold gradient-text text-center">{current.title}</h2>
          <p className="text-xs text-center mt-1.5" style={{ color: "var(--text-tertiary)" }}>
            {current.subtitle}
          </p>

          {current.content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 relative z-20" style={{ borderTop: "1px solid var(--border-primary)" }}>
          <button
            onClick={finish}
            className="text-xs transition-colors"
            style={{ color: "var(--text-tertiary)" }}
          >
            Skip
          </button>
          <button
            onClick={next}
            className="px-5 py-1.5 text-sm font-medium rounded-lg text-white transition-all hover:scale-[1.03] active:scale-[0.97]"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}
          >
            {step === 2 ? "Get Started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};
