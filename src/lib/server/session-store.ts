import { randomUUID } from "node:crypto";

import {
  BIAS_CATALOGUE,
  BIAS_KEY_ORDER,
  type BiasCatalogueEntry,
} from "@/lib/bias/characters";
import {
  STEP1_MAX_TURNS,
  STEP1_MIN_TURNS,
  buildStoredQuestionState,
  getWeightsForAnswer,
  pickInitialQuestionId,
  pickNextQuestionId,
  toPublicQuestion,
  type StoredQuestionState,
} from "@/lib/step1-flow";
import type {
  Step1BiasBreakdownItem,
  Step1ResultData,
  Step1SessionStatus,
  Step1TopCharacter,
} from "@/types/step1";
import type { Step2ResultData } from "@/types/step2";

export type StoredAnswer = {
  question_id: string;
  selected_option_id?: string;
  input_text?: string;
};

export type BrainSession = {
  id: string;
  schemaVersion: number;
  created_at: string;
  updated_at: string;
  type: "step1" | "step2";
  step1_status: Step1SessionStatus;
  asked_question_ids: string[];
  current_question: StoredQuestionState | null;
  bias_scores: Record<string, number>;
  top3_confidence: number;
  answers: StoredAnswer[];
  conversation_log: Array<{ role: "assistant" | "user"; content: string }>;
  step1_result?: Step1ResultData;
  step2_input?: string;
  step2_result?: Step2ResultData;
};

const sessions = new Map<string, BrainSession>();

function nowIso() {
  return new Date().toISOString();
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function createEmptyBiasScores() {
  return Object.fromEntries(BIAS_KEY_ORDER.map((key) => [key, 0])) as Record<string, number>;
}

function topBiasEntries(scoreMap: Record<string, number>, count: number) {
  return BIAS_CATALOGUE.map((entry) => ({
    ...entry,
    score: scoreMap[entry.key] ?? 0,
  }))
    .sort((left, right) => right.score - left.score)
    .slice(0, count);
}

function computeTop3Confidence(scoreMap: Record<string, number>) {
  const ordered = Object.values(scoreMap).sort((left, right) => right - left);
  const top = ordered[0] ?? 0;
  const fourth = ordered[3] ?? 0;
  if (top <= 0) return 0;
  return clamp(Math.round(((top - fourth) / top) * 100), 0, 100);
}

function ensureCurrentQuestion(session: BrainSession) {
  if (session.current_question) {
    return session.current_question;
  }

  const questionId = pickInitialQuestionId();
  const question = buildStoredQuestionState(questionId);
  session.current_question = question;
  session.asked_question_ids = [questionId];
  return question;
}

function projectTopCharacter(
  entry: BiasCatalogueEntry,
  score: number,
  rank: 1 | 2 | 3,
): Step1TopCharacter {
  return {
    bias_id: entry.biasId,
    bias_key: entry.key,
    bias_name_original: entry.biasNameOriginal,
    character_name: entry.characterName,
    subtitle: entry.subtitle,
    summary: entry.summary,
    detail: entry.detail,
    strength: entry.strength,
    watch_out_for: entry.watchOutFor,
    reflection_question: entry.reflectionQuestion,
    score,
    rank,
    tone: entry.tone,
    image_src: `/characters/${entry.imageSlug}.png`,
  };
}

function buildRadarScores(scoreMap: Record<string, number>, answerCount: number) {
  const topFive = topBiasEntries(scoreMap, 5);
  const maxScore = topFive[0]?.score ?? 1;
  const denominator = Math.max(1, answerCount * 3);

  return topFive.map((entry) => {
    const relativeStrength = entry.score / Math.max(1, maxScore);
    const density = entry.score / denominator;
    const displayScore = clamp(
      Math.round((relativeStrength * 4.2 + Math.sqrt(density) * 5.2) * 10) / 10,
      1.2,
      9.2,
    );

    return {
      bias_id: entry.biasId,
      bias_key: entry.key,
      label: entry.characterName,
      value: displayScore,
      display_score: displayScore,
    };
  });
}

function buildBiasBreakdown(scoreMap: Record<string, number>, answerCount: number) {
  const maxScore = Math.max(...Object.values(scoreMap), 1);
  const denominator = Math.max(1, answerCount * 3);

  return BIAS_CATALOGUE.map((entry) => {
    const rawScore = scoreMap[entry.key] ?? 0;
    const relativeStrength = rawScore / maxScore;
    const density = rawScore / denominator;
    const displayScore = clamp(
      Math.round((relativeStrength * 4.2 + Math.sqrt(Math.max(0, density)) * 5.2) * 10) / 10,
      1,
      9.4,
    );

    return {
      bias_id: entry.biasId,
      bias_key: entry.key,
      bias_name_original: entry.biasNameOriginal,
      character_name: entry.characterName,
      subtitle: entry.subtitle,
      summary: entry.summary,
      detail: entry.detail,
      strength: entry.strength,
      watch_out_for: entry.watchOutFor,
      reflection_question: entry.reflectionQuestion,
      raw_score: rawScore,
      display_score: displayScore,
      tone: entry.tone,
      image_src: `/characters/${entry.imageSlug}.png`,
    } satisfies Step1BiasBreakdownItem;
  }).sort((left, right) => {
    if (right.raw_score !== left.raw_score) {
      return right.raw_score - left.raw_score;
    }

    return right.display_score - left.display_score;
  });
}

function buildOverallInsight(top3: Step1TopCharacter[]) {
  const [first, second, third] = top3;
  if (!first || !second || !third) {
    return "아직 데이터가 충분하지 않아 넓은 범위로 해석하는 편이 좋습니다.";
  }

  return `${first.character_name} 성향이 가장 먼저 드러나고, ${second.character_name}와 ${third.character_name}가 그 판단을 보완하고 있습니다. 당신은 한 번의 직감만으로 움직이기보다, 최근 사례와 기존 신념, 그리고 상황 맥락이 겹칠 때 결정을 더 강하게 굳히는 편에 가깝습니다.`;
}

export function createSession(): BrainSession {
  const session: BrainSession = {
    id: randomUUID(),
    schemaVersion: 3,
    created_at: nowIso(),
    updated_at: nowIso(),
    type: "step1",
    step1_status: "in_progress",
    asked_question_ids: [],
    current_question: null,
    bias_scores: createEmptyBiasScores(),
    top3_confidence: 0,
    answers: [],
    conversation_log: [],
  };

  ensureCurrentQuestion(session);
  sessions.set(session.id, session);
  return session;
}

export function createSessionFromRecord(record: BrainSession) {
  const normalized: BrainSession = {
    ...record,
    schemaVersion: 3,
    asked_question_ids: record.asked_question_ids ?? [],
    current_question: record.current_question ?? null,
    bias_scores: {
      ...createEmptyBiasScores(),
      ...(record.bias_scores ?? {}),
    },
    top3_confidence: record.top3_confidence ?? 0,
    answers: record.answers ?? [],
    conversation_log: record.conversation_log ?? [],
  };

  if (!normalized.current_question && normalized.step1_status === "in_progress") {
    ensureCurrentQuestion(normalized);
  }

  sessions.set(normalized.id, normalized);
  return normalized;
}

export function getOrCreateSession(sessionId?: string) {
  if (sessionId && sessions.has(sessionId)) {
    return sessions.get(sessionId)!;
  }

  return createSession();
}

export function getSession(sessionId?: string) {
  if (!sessionId) return null;
  return sessions.get(sessionId) ?? null;
}

export function saveSession(session: BrainSession) {
  session.updated_at = nowIso();
  sessions.set(session.id, session);
  return session;
}

export function getCurrentStep1Question(session: BrainSession) {
  if (session.step1_status === "ready_for_result") {
    return null;
  }

  const current = ensureCurrentQuestion(session);
  return toPublicQuestion(current, session.answers.length);
}

export function getStep1ConversationHistory(session: BrainSession) {
  const history: Array<{ turn_number: number; question: string; answer: string }> = [];

  for (let index = 0; index < session.conversation_log.length; index += 2) {
    const assistant = session.conversation_log[index];
    const user = session.conversation_log[index + 1];

    if (!assistant || !user) {
      continue;
    }

    history.push({
      turn_number: history.length + 1,
      question: assistant.content,
      answer: user.content,
    });
  }

  return history;
}

export function validateAndStoreStep1Answer(
  session: BrainSession,
  payload: { selected_option_id?: string; input_text?: string },
) {
  const question = ensureCurrentQuestion(session);

  if (question.interaction === "choice") {
    const option = question.options?.find((candidate) => candidate.id === payload.selected_option_id);
    if (!option) {
      throw new Error("유효한 선택지 응답이 필요합니다.");
    }
  } else if (!payload.input_text || payload.input_text.trim().length === 0) {
    throw new Error("직접 입력 응답이 필요합니다.");
  }

  const normalizedInput = payload.input_text?.trim();

  session.answers.push({
    question_id: question.id,
    ...(payload.selected_option_id ? { selected_option_id: payload.selected_option_id } : {}),
    ...(normalizedInput ? { input_text: normalizedInput } : {}),
  });

  session.conversation_log.push({ role: "assistant", content: question.prompt });
  session.conversation_log.push({
    role: "user",
    content:
      question.interaction === "choice"
        ? question.options?.find((item) => item.id === payload.selected_option_id)?.label ??
          payload.selected_option_id ??
          ""
        : normalizedInput ?? "",
  });

  const weights =
    question.interaction === "choice"
      ? question.options?.find((item) => item.id === payload.selected_option_id)?.bias_map ?? {}
      : getWeightsForAnswer(question.id, {
          selected_option_id: payload.selected_option_id,
          input_text: normalizedInput,
        });

  Object.entries(weights).forEach(([key, value]) => {
    session.bias_scores[key] = (session.bias_scores[key] ?? 0) + (value ?? 0);
  });

  session.top3_confidence = computeTop3Confidence(session.bias_scores);
  session.step1_result = undefined;

  const answeredTurns = session.answers.length;
  const shouldFinish =
    answeredTurns >= STEP1_MAX_TURNS ||
    (answeredTurns >= STEP1_MIN_TURNS && session.top3_confidence >= 34);

  if (shouldFinish) {
    session.step1_status = "ready_for_result";
    session.current_question = null;
    return saveSession(session);
  }

  const nextQuestionId = pickNextQuestionId({
    askedQuestionIds: session.asked_question_ids,
    biasScores: session.bias_scores,
    answeredTurns,
  });

  if (!nextQuestionId) {
    session.step1_status = "ready_for_result";
    session.current_question = null;
    return saveSession(session);
  }

  session.current_question = buildStoredQuestionState(nextQuestionId);
  session.asked_question_ids.push(nextQuestionId);
  return saveSession(session);
}

export function buildStep1Result(session: BrainSession): Step1ResultData {
  if (session.step1_result?.bias_breakdown?.length === BIAS_CATALOGUE.length) {
    return session.step1_result;
  }

  const ranked = topBiasEntries(session.bias_scores, 3);
  const top3 = ranked.map((entry, index) =>
    projectTopCharacter(entry, entry.score, (index + 1) as 1 | 2 | 3),
  );

  const result: Step1ResultData = {
    session_id: session.id,
    status: session.step1_status,
    top3,
    radar_scores: buildRadarScores(session.bias_scores, session.answers.length),
    bias_breakdown: buildBiasBreakdown(session.bias_scores, session.answers.length),
    overall_insight: buildOverallInsight(top3),
    share_line: `${top3[0]?.character_name ?? "뇌피셜 캐릭터"} 성향이 가장 먼저 드러났어요.`,
  };

  session.step1_result = result;
  return saveSession(session).step1_result!;
}
