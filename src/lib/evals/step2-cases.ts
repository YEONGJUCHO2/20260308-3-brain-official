import type { Step2Topic } from "@/lib/step2-fallback";

export type Step2EvalCase = {
  id: string;
  dilemmaText: string;
  topBiasKey: string;
  secondaryBiasKeys?: string[];
  expectedTopic: Step2Topic;
};

export const STEP2_EVAL_CASES: Step2EvalCase[] = [
  {
    id: "meal-tonight",
    dilemmaText: "오늘 저녁 뭐 먹을까",
    topBiasKey: "availability",
    secondaryBiasKeys: ["present-focus", "reward-response"],
    expectedTopic: "meal",
  },
  {
    id: "phone-upgrade",
    dilemmaText: "새 핸드폰을 사야 할지 고민이야",
    topBiasKey: "availability",
    secondaryBiasKeys: ["curiosity", "reward-response"],
    expectedTopic: "device",
  },
  {
    id: "career-switch",
    dilemmaText: "이직을 해야 할지 말아야 할지 모르겠어",
    topBiasKey: "status-quo",
    secondaryBiasKeys: ["pain-avoiding", "overconfidence"],
    expectedTopic: "career",
  },
  {
    id: "relationship-distance",
    dilemmaText: "친구와 거리를 둘지 솔직하게 말할지 고민 중이야",
    topBiasKey: "social-proof",
    secondaryBiasKeys: ["liking-bias", "disliking-bias"],
    expectedTopic: "relationship",
  },
  {
    id: "study-plan",
    dilemmaText: "시험 공부를 어떤 순서로 해야 할지 계속 막혀",
    topBiasKey: "authority",
    secondaryBiasKeys: ["curiosity", "inconsistency-avoidance"],
    expectedTopic: "study",
  },
  {
    id: "money-pressure",
    dilemmaText: "요즘 돈이 너무 부족해서 뭘 줄여야 할지 모르겠어",
    topBiasKey: "negativity-bias",
    secondaryBiasKeys: ["pain-avoiding", "status-quo"],
    expectedTopic: "money",
  },
  {
    id: "baby-prep",
    dilemmaText: "아기 준비를 어디까지 해야 할지 자꾸 불안해져",
    topBiasKey: "negativity-bias",
    secondaryBiasKeys: ["authority", "status-quo"],
    expectedTopic: "family",
  },
  {
    id: "generic-choice",
    dilemmaText: "이번 선택을 밀어붙일지 조금 더 생각할지 헷갈려",
    topBiasKey: "doubt-avoidance",
    secondaryBiasKeys: ["overconfidence", "contrast-effect"],
    expectedTopic: "generic",
  },
];
