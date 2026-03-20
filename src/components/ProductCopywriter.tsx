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
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <span className="text-2xl">{"\uD83D\uDECD\uFE0F"}</span> Product Copywriter
      </h2>

      <div>
        <label className="block text-sm text-white/60 mb-1">Product Name</label>
        <input
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="e.g., Wireless Noise-Cancelling Headphones"
          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-1">Platform</label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {PLATFORMS.map((p) => (
            <option key={p} value={p} className="bg-gray-900">{p}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-1">Product Details</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Features, materials, dimensions, target audience, unique selling points..."
          rows={4}
          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
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
