export interface Tool {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const TOOLS: Tool[] = [
  {
    id: "email",
    name: "Email Writer",
    icon: "\u2709\uFE0F",
    description: "Craft perfect emails for any occasion",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "meeting",
    name: "Meeting Summarizer",
    icon: "\uD83D\uDCDD",
    description: "Extract action items from transcripts",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "code",
    name: "Code Reviewer",
    icon: "\uD83D\uDD0D",
    description: "Find bugs, security & performance issues",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "blog",
    name: "Blog Generator",
    icon: "\uD83D\uDCF0",
    description: "SEO-optimized blog posts in minutes",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "product",
    name: "Product Copywriter",
    icon: "\uD83D\uDECD\uFE0F",
    description: "High-converting product descriptions",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "tweet",
    name: "Tweet Thread Creator",
    icon: "\uD83E\uDDF5",
    description: "Viral tweet threads that engage",
    color: "from-sky-500 to-indigo-500",
  },
];
