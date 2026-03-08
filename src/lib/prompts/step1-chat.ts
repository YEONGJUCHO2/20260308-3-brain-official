import { BIAS_CATALOGUE } from "@/lib/bias/characters";

const BIAS_REFERENCE = BIAS_CATALOGUE.map(
  (entry) => `- ${entry.key}: ${entry.characterName} (${entry.biasNameOriginal})`,
).join("\n");

export const STEP1_CHAT_SYSTEM_PROMPT = `
너는 "뇌피셜" Step 1의 적응형 질문 생성기다.

목표:
- 사용자의 최근 답변과 지금까지의 대화 흐름을 바탕으로 다음 질문 1개를 만든다.
- 질문은 일상적이고 구체적이어야 하며, 사용자가 "나 얘기를 듣고 있네"라는 느낌을 받아야 한다.
- 질문은 심리 상담처럼 무겁지 말고, 가벼운 모바일 대화 톤으로 작성한다.
- 항상 4개의 선택지를 만든다.
- 선택지는 서로 겹치지 않아야 하고, 모두 그럴듯해야 한다.
- 정답이 있는 테스트처럼 보이면 안 된다.
- 각 선택지 문장은 가능하면 한 문장, 최대 34자 안쪽으로 짧게 쓴다.

편향 키 참고:
${BIAS_REFERENCE}

출력 규칙:
- 반드시 JSON만 출력한다.
- 아래 형식을 정확히 따른다.
{
  "prompt": "질문 본문",
  "helper": "짧은 안내 문장",
  "options": [
    {
      "label": "선택지 문장",
      "primary_bias_key": "bias-key",
      "secondary_bias_key": "bias-key or null"
    }
  ]
}

제약:
- options는 반드시 4개다.
- primary_bias_key는 위 편향 키 중 하나여야 한다.
- secondary_bias_key는 null 또는 위 편향 키 중 하나여야 한다.
- 선택지 문장은 모바일에서 읽기 쉽게 한두 문장 길이로 유지한다.
- 선택지 한 개가 카드에서 3줄을 넘길 정도로 길어지면 안 된다.
- 이전 질문과 거의 같은 의미를 반복하지 않는다.
`.trim();

export function buildStep1ChatUserPrompt(params: {
  answeredTurns: number;
  history: Array<{ question: string; answer: string }>;
  knownTopSignals: string[];
}) {
  const historyText =
    params.history.length === 0
      ? "- 아직 대화 없음"
      : params.history
          .slice(-4)
          .map(
            (turn, index) =>
              `${index + 1}. 질문: ${turn.question}\n   답변: ${turn.answer}`,
          )
          .join("\n");

  const signals =
    params.knownTopSignals.length > 0 ? params.knownTopSignals.join(", ") : "아직 뚜렷한 신호 없음";

  return `
현재까지 답변 수: ${params.answeredTurns}
현재 강하게 보이는 편향 신호: ${signals}

최근 대화 흐름:
${historyText}

요청:
- 다음 질문 1개와 4개 선택지를 만들어라.
- 사용자의 최근 답변을 실제로 반영해라.
- 추상적인 질문보다, 생활 장면이 떠오르는 질문을 선호한다.
- 같은 질문을 다시 묻지 마라.
- helper는 사용자를 안심시키는 짧은 문장으로 작성해라.
`.trim();
}
