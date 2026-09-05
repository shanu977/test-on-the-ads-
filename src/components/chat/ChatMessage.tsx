"use client";

export type ChatRole = "user" | "assistant";

export type ChatMessageType = {
  id: string;
  role: ChatRole;
  content: string;
};

function Avatar({ role }: { role: ChatRole }) {
  const isUser = role === "user";
  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
        isUser
          ? "bg-violet-600 text-white"
          : "bg-zinc-800 text-zinc-300 border border-zinc-700"
      }`}
      aria-hidden
    >
      {isUser ? "U" : "AI"}
    </div>
  );
}

export default function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <Avatar role={message.role} />}
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-[14.5px] leading-6 shadow-sm ${
          isUser
            ? "bg-violet-600 text-white rounded-br-sm"
            : "bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-bl-sm"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
      {isUser && <Avatar role={message.role} />}
    </div>
  );
}
