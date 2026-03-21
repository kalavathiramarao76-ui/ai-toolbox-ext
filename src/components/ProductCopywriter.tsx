import React, { useState } from "react";
import { useAI } from "../hooks/useAI";
import { productCopywriterPrompt } from "../utils/prompts";
import { OutputPanel } from "./OutputPanel";

const PLATFORMS = ["Amazon", "Shopify", "eBay", "Etsy", "Generic"];

export const ProductCopywriter: React.FC = () => {
  const [product, setProduct] = useState("");
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [details, setDetails] = useState("");
  const { output, loading, error, generate, stop } = useAI();

  const handleGenerate = () => {
    if (!product.trim()) return;
    generate(productCopywriterPrompt(product, platform, details));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
        <span className="text-2xl">{"\uD83D\uDECD\uFE0F"}</span> Product Copywriter
      </h2>

      <div>
        <label className="block text-sm mb-1" style={{ color: "var(--text-tertiary)" }}>Product Name</label>
        <input
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="e.g., Wireless Noise-Cancelling Headphones"
          className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          style={{ background: "var(--input-bg)", border: "1px solid var(--border-primary)", color: "var(--text-primary)" }}
        />
      </div>

      <div>
        <label className="block text-sm mb-1" style={{ color: "var(--text-tertiary)" }}>Platform</label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          style={{ background: "var(--input-bg)", border: "1px solid var(--border-primary)", color: "var(--text-primary)" }}
        >
          {PLATFORMS.map((p) => (
            <option key={p} value={p} style={{ background: "var(--select-bg)" }}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1" style={{ color: "var(--text-tertiary)" }}>Product Details</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Features, materials, dimensions, target audience, unique selling points..."
          rows={4}
          className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          style={{ background: "var(--input-bg)", border: "1px solid var(--border-primary)", color: "var(--text-primary)" }}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !product.trim()}
        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Writing..." : "Generate Product Copy"}
      </button>

      <OutputPanel output={output} loading={loading} error={error} toolName="Product Copywriter" onStop={stop} />
    </div>
  );
};
