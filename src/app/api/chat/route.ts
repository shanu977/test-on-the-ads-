import { NextRequest, NextResponse } from "next/server";
import { callGroq, GROQ_MODEL_DEFAULT, type GroqMessage } from "@/lib/groq";

export const runtime = "nodejs";

type IncomingMessage = { role: string; content: string };

function validateMessages(messages: unknown): { valid: boolean; error?: string } {
  if (!Array.isArray(messages)) return { valid: false, error: "messages must be an array" };
  if (messages.length === 0) return { valid: false, error: "messages must not be empty" };
  if (messages.length > 50) return { valid: false, error: "too many messages (max 50)" };
  for (const m of messages as IncomingMessage[]) {
    if (!m || typeof m !== "object") return { valid: false, error: "invalid message format" };
    if (!["user", "assistant", "system"].includes(m.role)) return { valid: false, error: `invalid role: ${m.role}` };
    if (typeof m.content !== "string") return { valid: false, error: "content must be string" };
    if (m.content.trim().length === 0) return { valid: false, error: "content must not be empty" };
    if (m.content.length > 8000) return { valid: false, error: "message too long (max 8000 chars)" };
  }
  return { valid: true };
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server not configured: GROQ_API_KEY missing" },
        { status: 500 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { messages } = body as { messages?: unknown };

    const validation = validateMessages(messages);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const typedMessages = messages as IncomingMessage[];

    // Keep only user/assistant for client, prepend system prompt server-side
    const groqMessages: GroqMessage[] = [
      {
        role: "system",
        content:
          "You are a helpful, concise AI assistant. Keep answers clear and well-structured. Use markdown lightly when helpful.",
      },
      ...typedMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
    ];

    const model = process.env.GROQ_MODEL?.trim() || GROQ_MODEL_DEFAULT;

    const content = await callGroq(groqMessages, apiKey, model);

    return NextResponse.json({ content, model }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    // Do not leak API key; just return message
    const status = message.toLowerCase().includes("rate") ? 429 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST /api/chat" },
    { status: 405 }
  );
}
