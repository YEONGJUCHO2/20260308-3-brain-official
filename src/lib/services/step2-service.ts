import { getBiasEntry } from "@/lib/bias/characters";
import { generateGeminiJson, hasGeminiConfig } from "@/lib/gemini";
import {
  buildStep2AnalyzeUserPrompt,
  STEP2_ANALYZE_SYSTEM_PROMPT,
} from "@/lib/prompts/step2-analyze";
import { selectStep2FewShotExamples } from "@/lib/prompts/step2-few-shot";
import { buildStep1Result } from "@/lib/server/session-store";
import { getSessionRecord, persistSessionRecord } from "@/lib/server/session-repository";
import {
  buildStep2Anchors,
  buildStructuredStep2Fallback,
  countAnchorHits,
  STEP2_LENSES,
} from "@/lib/step2-fallback";
import type {
  Step2AnalyzeRequest,
  Step2BiasWarning,
  Step2CriticalQuestion,
  Step2ExcludedLens,
  Step2LensResult,
  Step2LensTone,
  Step2ResultData,
} from "@/types/step2";

const ALLOWED_LENSES = new Set<string>(STEP2_LENSES);
const ALLOWED_TONES = new Set<Step2LensTone>(["amber", "blue", "violet", "emerald"]);

function normalizeBiasWarning(
  generated: Partial<Step2BiasWarning> | undefined,
  fallback: Step2BiasWarning,
): Step2BiasWarning {
  const normalizedTag = generated?.tag?.trim();
  const looksLikeUiTone =
    normalizedTag && ["amber", "blue", "violet", "emerald"].includes(normalizedTag.toLowerCase());
  const looksTooShort = normalizedTag ? normalizedTag.length < 4 : true;

  return {
    title: generated?.title?.trim() || fallback.title,
    tag:
      normalizedTag && !looksLikeUiTone && !looksTooShort
        ? normalizedTag
        : fallback.tag,
    body: generated?.body?.trim() || fallback.body,
  };
}

function normalizeSelectedLenses(
  generated: Step2LensResult[] | undefined,
  fallback: Step2LensResult[],
): Step2LensResult[] {
  if (!generated || generated.length === 0) {
    return fallback;
  }

  const cleaned = generated
    .filter((lens) => ALLOWED_LENSES.has(lens.lens) && ALLOWED_TONES.has(lens.tone))
    .map((lens) => ({
      lens: lens.lens,
      verdict: lens.verdict?.trim() || "다시 보기 필요",
      tone: lens.tone,
      summary: lens.summary?.trim() || "",
    }))
    .filter((lens) => lens.summary.length > 0);

  if (cleaned.length < 2) {
    return fallback;
  }

  const deduped: Step2LensResult[] = [];
  for (const lens of cleaned) {
    if (!deduped.some((item) => item.lens === lens.lens)) {
      deduped.push(lens);
    }
  }

  return deduped.slice(0, 3);
}

function normalizeExcludedLenses(
  generated: Step2ExcludedLens[] | undefined,
  selectedLenses: Step2LensResult[],
  fallback: Step2ExcludedLens[],
): Step2ExcludedLens[] {
  if (!generated || generated.length === 0) {
    return fallback;
  }

  const selected = new Set(selectedLenses.map((lens) => lens.lens));
  const cleaned = generated
    .filter((lens) => ALLOWED_LENSES.has(lens.lens) && !selected.has(lens.lens))
    .map((lens) => ({
      lens: lens.lens,
      reason: lens.reason?.trim() || "이번 고민에서는 우선순위가 한 단계 뒤인 관점입니다.",
    }));

  const deduped: Step2ExcludedLens[] = [];
  for (const lens of cleaned) {
    if (!deduped.some((item) => item.lens === lens.lens)) {
      deduped.push(lens);
    }
  }

  return deduped.length > 0 ? deduped.slice(0, 2) : fallback;
}

function normalizeCriticalQuestions(
  generated: Step2CriticalQuestion[] | undefined,
  fallback: Step2CriticalQuestion[],
): Step2CriticalQuestion[] {
  if (!generated || generated.length === 0) {
    return fallback;
  }

  const cleaned = generated
    .map((question, index) => ({
      id: question.id?.trim() || `q${index + 1}`,
      text: question.text?.trim() || "",
    }))
    .filter((question) => question.text.length > 0);

  return cleaned.length >= 2 ? cleaned.slice(0, 3) : fallback;
}

function mergeStep2Result(
  fallback: Step2ResultData,
  generated: Partial<Step2ResultData>,
): Step2ResultData {
  const selected_lenses = normalizeSelectedLenses(generated.selected_lenses, fallback.selected_lenses);
  const excluded_lenses = normalizeExcludedLenses(
    generated.excluded_lenses,
    selected_lenses,
    fallback.excluded_lenses,
  );

  return {
    ...fallback,
    bias_warning: normalizeBiasWarning(generated.bias_warning, fallback.bias_warning),
    selected_lenses,
    excluded_lenses,
    critical_questions: normalizeCriticalQuestions(
      generated.critical_questions,
      fallback.critical_questions,
    ),
    closing: generated.closing?.trim() || fallback.closing,
  };
}

function buildTopBiasScoreSnapshot(scoreMap: Record<string, number>, limit = 8) {
  return Object.entries(scoreMap)
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([key, score]) => {
      const entry = getBiasEntry(key);
      return {
        characterName: entry?.characterName ?? key,
        biasNameOriginal: entry?.biasNameOriginal ?? key,
        rawScore: score,
        biasKey: key,
      };
    });
}

function hasLensVariety(lenses: Step2LensResult[]) {
  return new Set(lenses.map((lens) => lens.lens)).size >= 3;
}

function isGroundedEnough(result: Step2ResultData, anchors: string[]) {
  if (anchors.length === 0) {
    return true;
  }

  const combined = [
    result.dilemma_text,
    result.bias_warning.tag,
    result.bias_warning.body,
    ...result.selected_lenses.flatMap((lens) => [lens.verdict, lens.summary]),
    ...result.critical_questions.map((question) => question.text),
    result.closing,
  ].join(" ");

  const anchorHits = countAnchorHits(combined, anchors);
  return anchorHits >= Math.min(2, anchors.length) && hasLensVariety(result.selected_lenses);
}

export async function runStep2Analyze(payload: Step2AnalyzeRequest): Promise<Step2ResultData> {
  const session = await getSessionRecord(payload.session_id);
  if (!session) {
    throw new Error("Step 2 분석을 위해 session_id가 필요합니다.");
  }

  const incomingDilemmaText = payload.dilemma_text?.trim();
  const storedDilemmaText = session.step2_input?.trim();
  const dilemmaText = incomingDilemmaText || storedDilemmaText;
  if (!dilemmaText) {
    throw new Error("Step 2 분석을 위해 고민 텍스트가 필요합니다.");
  }

  if (session.step2_result) {
    const shouldReuse =
      !incomingDilemmaText ||
      (storedDilemmaText && incomingDilemmaText === storedDilemmaText);

    if (shouldReuse) {
      return session.step2_result;
    }
  }

  session.step2_input = dilemmaText;
  session.type = "step2";

  const step1Result = buildStep1Result(session);
  const topBias = step1Result.top3[0];
  if (!topBias) {
    throw new Error("Step 1 결과 없이 Step 2를 분석할 수 없습니다.");
  }

  const topBiasScores = buildTopBiasScoreSnapshot(session.bias_scores);
  const fallback = buildStructuredStep2Fallback({
    sessionId: session.id,
    dilemmaText,
    topBias,
  });

  session.step2_result = fallback;
  await persistSessionRecord(session);

  if (!hasGeminiConfig()) {
    return fallback;
  }

  try {
    const fewShotExamples = selectStep2FewShotExamples({
      dilemmaText,
      topBiasKeys: topBiasScores.map((item) => item.biasKey),
    });

    const generated = await generateGeminiJson<Partial<Step2ResultData>>({
      model: process.env.GEMINI_MODEL_STEP2 || "gemini-2.5-flash-lite",
      systemPrompt: STEP2_ANALYZE_SYSTEM_PROMPT,
      source: "step2_analyze",
      userPrompt: buildStep2AnalyzeUserPrompt({
        dilemmaText,
        topCharacters: step1Result.top3.map((character) => ({
          name: character.character_name,
          subtitle: character.subtitle,
          biasNameOriginal: character.bias_name_original,
          summary: character.summary,
        })),
        radarScores: step1Result.radar_scores.map((item) => ({
          label: item.label,
          score: item.display_score,
        })),
        topBiasScores: topBiasScores.map((item) => ({
          characterName: item.characterName,
          biasNameOriginal: item.biasNameOriginal,
          rawScore: item.rawScore,
        })),
        fallbackSummary: step1Result.overall_insight,
        fewShotExamples,
      }),
    });

    const merged = mergeStep2Result(fallback, generated);
    const anchors = buildStep2Anchors(dilemmaText);
    const finalResult = isGroundedEnough(merged, anchors) ? merged : fallback;

    session.step2_result = finalResult;
    await persistSessionRecord(session);
    return finalResult;
  } catch (error) {
    console.error("Step 2 Gemini fallback:", error);
    return fallback;
  }
}
