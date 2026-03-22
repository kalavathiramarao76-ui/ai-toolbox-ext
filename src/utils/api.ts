import { incrementUsage } from "../shared/usage";
import { getSettingsSync } from "../components/Settings";

const DEFAULT_API_URL = "https://sai.sharedllm.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-oss:120b";

function getApiConfig() {
  try {
    const settings = getSettingsSync();
    return {
      url: settings.endpointUrl || DEFAULT_API_URL,
      model: settings.model || DEFAULT_MODEL,
    };
  } catch {
    return { url: DEFAULT_API_URL, model: DEFAULT_MODEL };
  }
}

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function streamCompletion(
  messages: Message[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: Error) => void
): Promise<AbortController> {
  incrementUsage();
  const controller = new AbortController();

  try {
    const config = getApiConfig();
    const res = await fetch(config.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: config.model,
        messages,
        stream: true,
        max_tokens: 4096,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let buffer = "";

    const processStream = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          onDone();
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") {
            onDone();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) onChunk(content);
          } catch {
            // skip malformed JSON
          }
        }
      }
    };

    processStream().catch(onError);
  } catch (err) {
    onError(err as Error);
  }

  return controller;
}

export async function completion(messages: Message[]): Promise<string> {
  const config = getApiConfig();
  const res = await fetch(config.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: 4096,
      temperature: 0.7,
    }),
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}
