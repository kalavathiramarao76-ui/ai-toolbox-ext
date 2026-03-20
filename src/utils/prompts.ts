import { Message } from "./api";

export function emailWriterPrompt(
  type: string,
  tone: string,
  context: string
): Message[] {
  return [
    {
      role: "system",
      content: `You are an expert email writer. Write a professional ${type} email with a ${tone} tone. Output ONLY the email text with subject line. Format with Subject: line, then blank line, then body.`,
    },
    {
      role: "user",
      content: context,
    },
  ];
}

export function meetingSummarizerPrompt(transcript: string): Message[] {
  return [
    {
      role: "system",
      content: `You are an expert meeting summarizer. Given a meeting transcript, produce a structured summary with:
## Summary
Brief 2-3 sentence overview

## Key Decisions
- Bulleted list of decisions made

## Action Items
- [ ] Task — Owner — Deadline (if mentioned)

## Follow-ups
- Items that need follow-up

Be concise and actionable.`,
    },
    { role: "user", content: transcript },
  ];
}

export function codeReviewerPrompt(
  code: string,
  language: string
): Message[] {
  return [
    {
      role: "system",
      content: `You are a senior ${language} developer performing a thorough code review. Analyze the code for:

## Bugs & Errors
## Security Vulnerabilities
## Performance Issues
## Code Quality & Best Practices
## Suggestions

Rate severity as: Critical / Warning / Info. Provide fixed code snippets where applicable. Be specific and actionable.`,
    },
    { role: "user", content: `\`\`\`${language}\n${code}\n\`\`\`` },
  ];
}

export function blogPostPrompt(
  topic: string,
  style: string,
  keywords: string
): Message[] {
  return [
    {
      role: "system",
      content: `You are an expert SEO content writer. Write a comprehensive, engaging blog post about the given topic.
Style: ${style}
SEO Keywords to naturally include: ${keywords}

Structure with:
- Compelling title with primary keyword
- Hook introduction
- 3-5 H2 sections with H3 subsections
- Actionable takeaways
- Strong conclusion with CTA
- Meta description (under 160 chars)

Write in a natural, human tone. Aim for 800-1200 words.`,
    },
    { role: "user", content: topic },
  ];
}

export function productCopywriterPrompt(
  product: string,
  platform: string,
  details: string
): Message[] {
  return [
    {
      role: "system",
      content: `You are a top-tier e-commerce copywriter specializing in ${platform} listings. Write compelling product copy that converts.

Include:
- Attention-grabbing title (${platform} optimized)
- 5 key bullet points (benefit-driven)
- Product description (150-300 words)
- Search keywords / backend keywords

Follow ${platform} best practices and character limits. Focus on benefits over features.`,
    },
    {
      role: "user",
      content: `Product: ${product}\nDetails: ${details}`,
    },
  ];
}

export function tweetThreadPrompt(
  topic: string,
  style: string,
  count: number
): Message[] {
  return [
    {
      role: "system",
      content: `You are a viral Twitter/X thread writer. Create a ${count}-tweet thread about the given topic.

Style: ${style}

Rules:
- Tweet 1: Strong hook with a bold claim or question
- Each tweet: max 280 chars, standalone value
- Use line breaks for readability
- Include relevant emojis sparingly
- Last tweet: CTA or summary
- Number each tweet (1/${count}, 2/${count}, etc.)

Make it engaging, shareable, and insightful.`,
    },
    { role: "user", content: topic },
  ];
}
