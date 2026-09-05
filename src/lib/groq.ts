export const GROQ_MODEL_DEFAULT = "openai/gpt-oss-20b";
export const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function callGroq(
  messages: GroqMessage[],
  apiKey: string,
  model: string
): Promise<string> {
  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    let errJson: unknown = null;
    try {
      errJson = JSON.parse(errText);
    } catch {
      // not json
    }
    const msg =
      (errJson as { error?: { message?: string } })?.error?.message ||
      errText ||
      `Groq API error: ${res.status}`;
    throw new Error(msg);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from Groq");
  return content;
}
