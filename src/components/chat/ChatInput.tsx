"use client";

import { useRef, useEffect } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export default function ChatInput({ value, onChange, onSend, disabled, loading }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = Math.min(ref.current.scrollHeight, 140) + "px";
    }
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && !loading && value.trim()) onSend();
    }
  }

  return (
    <div className="flex items-end gap-3 rounded-2xl border border-zinc-700 bg-zinc-800 p-3 shadow-lg">
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
        rows={1}
        className="max-h-[140px] min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 text-zinc-100 placeholder-zinc-500 outline-none"
        aria-label="Chat input"
      />
      <button
        onClick={onSend}
        disabled={disabled || loading || !value.trim()}
        className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 px-5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Send message"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Sending
          </span>
        ) : (
          "Send"
        )}
      </button>
    </div>
  );
}
