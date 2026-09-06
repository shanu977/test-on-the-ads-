"use client";

import { useEffect, useRef, useState } from "react";
import ChatMessage, { type ChatMessageType } from "./ChatMessage";
import ChatInput from "./ChatInput";
import NativeAd from "@/components/ads/NativeAd";

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function newChat() {
    setMessages([]);
    setInput("");
    setError(null);
  }

  async function send() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessageType = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || `Request failed: ${res.status}`);
      }

      const assistantMsg: ChatMessageType = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.content,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/50 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
          <span className="text-sm text-zinc-300">
            {messages.length === 0 ? "Start a conversation" : `${messages.length} messages`}
          </span>
        </div>
        <button
          onClick={newChat}
          className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
        >
          New chat
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-6 sm:px-6"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          {messages.length === 0 && !loading && (
            <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/20 text-violet-400">
                <span className="text-xl">✦</span>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-zinc-100">How can I help you today?</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Ask anything — code, ideas, explanations. This is a test environment for Nexuss Ads.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  "Explain quantum computing simply",
                  "Write a Next.js API route",
                  "Give me 5 startup ideas",
                  "How does Groq compare to OpenAI?",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}

          {/* Phase 3: ONE fresh Adsterra ad per completed assistant turn — deterministic turn lifecycle */}
          {(() => {
            const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
            if (!lastAssistant) return null;
            return <NativeAd key={lastAssistant.id} turnId={lastAssistant.id} />;
          })()}

          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-xs font-semibold text-zinc-300">
                AI
              </div>
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-zinc-700 bg-zinc-800 px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" />
                <span className="ml-1 text-sm text-zinc-400">Thinking…</span>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              <p className="font-medium">Error</p>
              <p className="mt-1 text-red-300/90">{error}</p>
              <p className="mt-2 text-xs text-red-400/70">
                Check your GROQ_API_KEY on the server and try again.
              </p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-zinc-800 bg-zinc-950 p-4 sm:p-6">
        <div className="mx-auto w-full max-w-3xl">
          <ChatInput value={input} onChange={setInput} onSend={send} loading={loading} />
          <p className="mt-3 text-center text-xs text-zinc-500">
            Groq-powered · This is a testing environment
          </p>
        </div>
      </div>
    </div>
  );
}
