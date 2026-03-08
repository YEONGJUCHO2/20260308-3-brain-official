import { logGeminiInvocation } from "@/lib/server/gemini-usage-metrics";

type GeminiPart = {
  text: string;
};

type GeminiContent = {
  role: "user" | "model";
  parts: GeminiPart[];
};

type GenerateJsonOptions = {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  source?: string;
};

function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY;
}

export function hasGeminiConfig() {
  return Boolean(getGeminiApiKey());
}

export async function generateGeminiJson<T>({
  model,
  systemPrompt,
  userPrompt,
  source = "unknown",
}: GenerateJsonOptions): Promise<T> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }],
          } satisfies GeminiContent,
        ],
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini API 요청 실패: ${response.status} ${body}`);
  }

  try {
    await logGeminiInvocation({ model, source });
  } catch (error) {
    console.warn("Gemini usage logging failed:", error);
  }

  const json = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: GeminiPart[];
      };
    }>;
  };

  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini 응답에서 JSON 본문을 찾지 못했습니다.");
  }

  return JSON.parse(text) as T;
}
