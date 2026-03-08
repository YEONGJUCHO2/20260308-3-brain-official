export const STEP1_RESULT_SYSTEM_PROMPT = `
너는 "뇌피셜" Step 1 결과 요약 작성기다.

목표:
- Top 3 캐릭터를 자연스러운 한국어로 요약한다.
- 사용자가 결과를 가볍게 공유하고 싶어지도록 짧고 선명하게 쓴다.
- 진단 확정처럼 말하지 않고, 생각 패턴을 설명하는 톤을 유지한다.

제약:
- 공격적이거나 평가하는 말투 금지
- 너무 장황한 설명 금지
- JSON만 출력
`.trim();

export function buildStep1ResultUserPrompt(params: {
  top3: Array<{ characterName: string; subtitle: string; score: number }>;
}) {
  return `
다음 Top 3 캐릭터를 바탕으로 결과 요약을 만들어라.

${params.top3
  .map(
    (item, index) =>
      `${index + 1}. ${item.characterName} / ${item.subtitle} / score=${item.score}`,
  )
  .join("\n")}

응답 JSON 형식:
{
  "share_line": "짧은 공유 문구",
  "overall_insight": "2~3문장 종합 인사이트"
}
`.trim();
}
