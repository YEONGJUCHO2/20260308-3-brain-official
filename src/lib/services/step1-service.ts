import { randomUUID } from "node:crypto";

import { BIAS_CATALOGUE } from "@/lib/bias/characters";
import { generateGeminiJson, hasGeminiConfig } from "@/lib/gemini";
import { STEP1_CHAT_SYSTEM_PROMPT, buildStep1ChatUserPrompt } from "@/lib/prompts/step1-chat";
import { buildStep1ResultUserPrompt, STEP1_RESULT_SYSTEM_PROMPT } from "@/lib/prompts/step1-result";
import {
  buildStep1Result,
  getCurrentStep1Question,
  getStep1ConversationHistory,
  saveSession,
  validateAndStoreStep1Answer,
  type BrainSession,
} from "@/lib/server/session-store";
import {
  getOrCreateSessionRecord,
  getSessionRecord,
  persistSessionRecord,
} from "@/lib/server/session-repository";
import type { StoredQuestionState } from "@/lib/step1-flow";
import type {
  Step1ChatRequest,
  Step1ChatResponse,
  Step1ResultData,
  Step1ResultRequest,
} from "@/types/step1";

type GeneratedOption = {
  label?: string;
  primary_bias_key?: string;
  secondary_bias_key?: string | null;
};

type GeneratedQuestionPayload = {
  prompt?: string;
  helper?: string;
  options?: GeneratedOption[];
};

const VALID_BIAS_KEYS = new Set(BIAS_CATALOGUE.map((entry) => entry.key));
const DEFAULT_AI_TURNS = new Set([0, 3, 6]);

function shortenOptionLabel(label: string) {
  const normalized = label.replace(/\s+/g, " ").trim();
  if (normalized.length <= 34) {
    return normalized;
  }

  return `${normalized.slice(0, 33).trim()}…`;
}

function getKnownTopSignals(session: BrainSession) {
  return BIAS_CATALOGUE.map((entry) => ({
    key: entry.key,
    characterName: entry.characterName,
    score: session.bias_scores[entry.key] ?? 0,
  }))
    .sort((left, right) => right.score - left.score)
    .filter((entry) => entry.score > 0)
    .slice(0, 5)
    .map((entry) => `${entry.characterName}(${entry.key})`);
}

function shouldGenerateAiQuestion(answeredTurns: number) {
  const configuredTurns = process.env.STEP1_AI_TURNS
    ?.split(",")
    .map((item) => Number.parseInt(item.trim(), 10))
    .filter((item) => Number.isFinite(item));

  if (configuredTurns && configuredTurns.length > 0) {
    return new Set(configuredTurns).has(answeredTurns);
  }

  return DEFAULT_AI_TURNS.has(answeredTurns);
}

function buildAiQuestionState(payload: GeneratedQuestionPayload): StoredQuestionState | null {
  const prompt = payload.prompt?.trim();
  const helper = payload.helper?.trim();
  const options = payload.options?.slice(0, 4) ?? [];

  if (!prompt || !helper || options.length !== 4) {
    return null;
  }

  const questionId = `ai-${randomUUID()}`;
  const normalizedOptions = options.map((option, index) => {
    const label = option.label?.trim();
    const primary = option.primary_bias_key?.trim();
    const secondary = option.secondary_bias_key?.trim() || undefined;

    if (!label || !primary || !VALID_BIAS_KEYS.has(primary)) {
      return null;
    }

    if (secondary && !VALID_BIAS_KEYS.has(secondary)) {
      return null;
    }

    return {
      id: `${questionId}-${index + 1}`,
      label: shortenOptionLabel(label),
      bias_map: {
        [primary]: 3,
        ...(secondary && secondary !== primary ? { [secondary]: 1 } : {}),
      },
    };
  });

  if (normalizedOptions.some((option) => !option)) {
    return null;
  }

  const uniqueLabels = new Set(normalizedOptions.map((option) => option!.label));
  if (uniqueLabels.size !== 4) {
    return null;
  }

  return {
    id: questionId,
    prompt,
    helper,
    interaction: "choice",
    options: normalizedOptions as NonNullable<StoredQuestionState["options"]>,
  };
}

async function maybeGenerateAiQuestion(
  session: BrainSession,
  forceRegenerate: boolean,
) {
  if (!hasGeminiConfig() || session.step1_status !== "in_progress") {
    return;
  }

  const currentQuestionId = session.current_question?.id ?? "";
  const alreadyAiQuestion = currentQuestionId.startsWith("ai-");

  if (!forceRegenerate && alreadyAiQuestion) {
    return;
  }

  if (!shouldGenerateAiQuestion(session.answers.length)) {
    return;
  }

  try {
    const generated = await generateGeminiJson<GeneratedQuestionPayload>({
      model: process.env.GEMINI_MODEL_STEP1 || "gemini-2.5-flash-lite",
      systemPrompt: STEP1_CHAT_SYSTEM_PROMPT,
      source: "step1_question",
      userPrompt: buildStep1ChatUserPrompt({
        answeredTurns: session.answers.length,
        history: getStep1ConversationHistory(session),
        knownTopSignals: getKnownTopSignals(session),
      }),
    });

    const aiQuestion = buildAiQuestionState(generated);
    if (!aiQuestion) {
      return;
    }

    session.current_question = aiQuestion;
    session.asked_question_ids.push(aiQuestion.id);
    saveSession(session);
    await persistSessionRecord(session);
  } catch (error) {
    console.error("Step 1 Gemini question fallback:", error);
  }
}

export async function runStep1Chat(
  payload: Step1ChatRequest,
): Promise<Step1ChatResponse> {
  const session = await getOrCreateSessionRecord(payload.session_id);
  const hasIncomingAnswer = Boolean(payload.selected_option_id || payload.input_text?.trim());

  if (hasIncomingAnswer) {
    validateAndStoreStep1Answer(session, payload);
    await persistSessionRecord(session);
  }

  await maybeGenerateAiQuestion(
    session,
    hasIncomingAnswer || (session.answers.length === 0 && !session.current_question?.id.startsWith("ai-")),
  );

  const question = getCurrentStep1Question(session);

  return {
    session_id: session.id,
    status: session.step1_status,
    question,
    history: getStep1ConversationHistory(session),
    answered_turns: session.answers.length,
    recommended_min_turns: 7,
    progress: question?.progress ?? 100,
  };
}

export async function runStep1Result(
  payload: Step1ResultRequest,
): Promise<Step1ResultData> {
  const session = await getSessionRecord(payload.session_id);
  if (!session) {
    throw new Error("유효한 Step 1 session_id가 필요합니다.");
  }

  if (
    session.step1_result?.bias_breakdown?.length === BIAS_CATALOGUE.length &&
    session.step1_result.top3?.length === 3
  ) {
    return session.step1_result;
  }

  const result = buildStep1Result(session);
  await persistSessionRecord(session);

  if (!hasGeminiConfig()) {
    return result;
  }

  try {
    const generated = await generateGeminiJson<{
      overall_insight?: string;
      share_line?: string;
    }>({
      model: process.env.GEMINI_MODEL_STEP1 || "gemini-2.5-flash-lite",
      systemPrompt: STEP1_RESULT_SYSTEM_PROMPT,
      source: "step1_result",
      userPrompt: buildStep1ResultUserPrompt({
        top3: result.top3.map((item) => ({
          characterName: item.character_name,
          subtitle: item.subtitle,
          score: item.score,
        })),
      }),
    });

    const merged = {
      ...result,
      overall_insight: generated.overall_insight || result.overall_insight,
      share_line: generated.share_line || result.share_line,
    };
    session.step1_result = merged;
    await persistSessionRecord(session);
    return merged;
  } catch {
    return result;
  }
}
