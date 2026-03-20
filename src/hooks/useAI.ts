import { useState, useRef, useCallback } from "react";
import { streamCompletion, Message } from "../utils/api";

export function useAI() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (messages: Message[]) => {
    setOutput("");
    setError(null);
    setLoading(true);

    abortRef.current = await streamCompletion(
      messages,
      (chunk) => setOutput((prev) => prev + chunk),
      () => setLoading(false),
      (err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
        setLoading(false);
      }
    );
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setLoading(false);
  }, []);

  const reset = useCallback(() => {
    setOutput("");
    setError(null);
    setLoading(false);
  }, []);

  return { output, loading, error, generate, stop, reset };
}
