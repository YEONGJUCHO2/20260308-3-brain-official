import { STEP2_LENSES } from "@/lib/step2-fallback";

const ALLOWED_TONES = ["amber", "blue", "violet", "emerald"];

export const STEP2_ANALYZE_SYSTEM_PROMPT = `
너는 "뇌피셜" Step 2 고민 분석 엔진이다.

역할:
- 사용자의 고민에 대해 정답을 내려주지 않는다.
- 고민을 입체적으로 보게 만드는 3개의 분석 렌즈를 고른다.
- 제외된 렌즈 2개도 왜 우선순위가 낮은지 설명한다.
- Step 1에서 드러난 상위 편향 성향이 지금 고민에 어떤 방식으로 개입하고 있는지 구체적으로 짚는다.
- 사용자가 바로 결론을 내리기보다 생각을 다시 정리하게 만드는 질문 3개를 만든다.

스타일 규칙:
- 모든 문구는 자연스러운 한국어여야 한다.
- 훈계하거나 진단하지 않는다.
- 입력 고민에 실제로 들어 있는 표현과 상황을 놓치지 않는다.
- 렌즈는 반드시 서로 다른 관점이어야 한다.
- 일반론만 반복하지 말고, 입력 고민의 핵심 갈등과 연결하라.
- JSON만 출력한다.
`.trim();

export function buildStep2AnalyzeUserPrompt(params: {
  dilemmaText: string;
  topCharacters: Array<{
    name: string;
    subtitle: string;
    biasNameOriginal: string;
    summary: string;
  }>;
  radarScores: Array<{ label: string; score: number }>;
  topBiasScores: Array<{
    characterName: string;
    biasNameOriginal: string;
    rawScore: number;
  }>;
  fallbackSummary: string;
  fewShotExamples: string;
}) {
  const topCharacterText = params.topCharacters
    .map(
      (character, index) =>
        `${index + 1}. ${character.name} / ${character.subtitle} / 원본 편향: ${character.biasNameOriginal} / 요약: ${character.summary}`,
    )
    .join("\n");

  const radarText = params.radarScores
    .map((item) => `- ${item.label}: ${item.score.toFixed(1)}/10`)
    .join("\n");

  const topBiasText = params.topBiasScores
    .map(
      (item, index) =>
        `${index + 1}. ${item.characterName} (${item.biasNameOriginal}) / raw score: ${item.rawScore.toFixed(2)}`,
    )
    .join("\n");

  return `
사용자 고민:
${params.dilemmaText}

Step 1 Top 3 캐릭터:
${topCharacterText}

상위 5개 편향 요약 점수:
${radarText}

추가 참고용 raw score 상위권:
${topBiasText}

fallback 요약:
${params.fallbackSummary}

few-shot 참고 예시:
${params.fewShotExamples}

중요:
- 고민 문장에 실제로 들어 있는 갈등, 제약, 감정을 읽고 반영한다.
- 사용자가 쓴 핵심 단어를 결과 문장에 자연스럽게 일부 반영한다.
- selected_lenses는 정확히 3개, excluded_lenses는 정확히 2개여야 한다.
- allowed lenses: ${STEP2_LENSES.join(", ")}
- allowed tones: ${ALLOWED_TONES.join(", ")}
- critical_questions는 사용자가 바로 답을 고르기보다 기준을 다시 세우게 만드는 질문이어야 한다.
- closing은 짧고 정돈된 마무리 문장이어야 한다.

반드시 아래 JSON 형식으로만 출력:
{
  "bias_warning": {
    "title": "생각 경고등",
    "tag": "string",
    "body": "string"
  },
  "selected_lenses": [
    {
      "lens": "심리학",
      "verdict": "주의: string",
      "tone": "amber",
      "summary": "string"
    }
  ],
  "excluded_lenses": [
    {
      "lens": "역사학",
      "reason": "string"
    }
  ],
  "critical_questions": [
    { "id": "q1", "text": "string" },
    { "id": "q2", "text": "string" },
    { "id": "q3", "text": "string" }
  ],
  "closing": "string"
}
`.trim();
}
