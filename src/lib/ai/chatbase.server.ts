import { createServerFn } from "@tanstack/react-start";

const CHATBOT_ID = "kYooo_D2NEDt-sLe9KMs8";
const CHATBASE_API_URL = "https://www.chatbase.co/api/v1/chat";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  chatbotId?: string;
  stream?: boolean;
  temperature?: number;
  model?: string;
}

interface ChatResponse {
  text?: string;
  message?: { content?: string };
  error?: string;
}

export const chatWithChatbase = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (typeof input !== "object" || input === null) {
      throw new Error("Invalid input");
    }
    const payload = input as Record<string, unknown>;
    if (!Array.isArray(payload.messages)) {
      throw new Error("messages must be an array");
    }
    return {
      messages: payload.messages as ChatMessage[],
      chatbotId: payload.chatbotId as string | undefined,
      stream: payload.stream as boolean | undefined,
      temperature: payload.temperature as number | undefined,
      model: payload.model as string | undefined,
    };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.CHATBASE_API_KEY;
    if (!apiKey) {
      throw new Error("CHATBASE_API_KEY is not configured on the server.");
    }

    const body: ChatRequest = {
      messages: data.messages,
      chatbotId: data.chatbotId ?? CHATBOT_ID,
      stream: data.stream ?? false,
      temperature: data.temperature ?? 0.7,
      model: data.model ?? "gpt-4o-mini",
    };

    const response = await fetch(CHATBASE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Chatbase API error (${response.status}): ${text}`);
    }

    const json: ChatResponse = await response.json();

    if (json.error) {
      throw new Error(`Chatbase error: ${json.error}`);
    }

    const reply =
      json.text ?? json.message?.content ?? null;

    if (!reply) {
      throw new Error("Chatbase returned an empty response.");
    }

    return { reply };
  });

export type { ChatMessage };
