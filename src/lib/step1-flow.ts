import { BIAS_KEY_ORDER } from "@/lib/bias/characters";
import type { Step1Question } from "@/types/step1";

type WeightMap = Partial<Record<(typeof BIAS_KEY_ORDER)[number], number>>;

export type FlowOption = {
  id: string;
  label: string;
  bias_map: WeightMap;
};

export type FlowQuestion = {
  id: string;
  interaction: "choice" | "input";
  prompt: string;
  helper: string;
  bias_focus: string[];
  options?: FlowOption[];
  placeholder?: string;
  examples?: string[];
  input_weights?: (value: string) => WeightMap;
};

export type StoredQuestionState = {
  id: string;
  prompt: string;
  helper: string;
  interaction: "choice" | "input";
  options?: FlowOption[];
  placeholder?: string;
  examples?: string[];
};

export const STEP1_MIN_TURNS = 7;
export const STEP1_MAX_TURNS = 10;

const STARTER_QUESTION_IDS = ["first-filter", "social-signal", "decision-style", "evidence-style"];

function weights(entries: Array<[string, number]>): WeightMap {
  return Object.fromEntries(entries) as WeightMap;
}

export const QUESTION_BANK: FlowQuestion[] = [
  {
    id: "first-filter",
    interaction: "choice",
    prompt: "낯선 선택지를 보면 제일 먼저 어디에 눈이 가나요?",
    helper: "처음 꽂히는 판단 기준을 골라 주세요. 정답은 없습니다.",
    bias_focus: ["availability", "representativeness", "status-quo", "contrast-effect"],
    options: [
      {
        id: "first-filter_recent",
        label: "최근에 본 사례나 후기부터 떠올라요.",
        bias_map: weights([
          ["availability", 3],
          ["social-proof", 1],
        ]),
      },
      {
        id: "first-filter_pattern",
        label: "느낌상 어떤 타입인지 빠르게 분류해요.",
        bias_map: weights([
          ["representativeness", 3],
          ["overconfidence", 1],
        ]),
      },
      {
        id: "first-filter_safe",
        label: "익숙하고 검증된 쪽이 먼저 눈에 들어와요.",
        bias_map: weights([
          ["status-quo", 3],
          ["aging-bias", 1],
        ]),
      },
      {
        id: "first-filter_compare",
        label: "무엇과 비교하느냐가 더 중요해 보여요.",
        bias_map: weights([
          ["contrast-effect", 3],
          ["kant-fairness", 1],
        ]),
      },
    ],
  },
  {
    id: "social-signal",
    interaction: "choice",
    prompt: "다른 사람들의 반응이 몰릴 때, 내 판단은 어떻게 움직이나요?",
    helper: "비교, 공감, 의리, 분위기 중 가까운 쪽을 골라 주세요.",
    bias_focus: ["social-proof", "envy-jealousy", "reciprocity", "mere-association"],
    options: [
      {
        id: "social-signal_follow",
        label: "많은 사람이 고른 쪽이 더 안전해 보여요.",
        bias_map: weights([
          ["social-proof", 3],
          ["availability", 1],
        ]),
      },
      {
        id: "social-signal_compete",
        label: "누가 앞서가면 나도 더 세게 움직이게 돼요.",
        bias_map: weights([
          ["envy-jealousy", 3],
          ["reward-response", 1],
        ]),
      },
      {
        id: "social-signal_loyal",
        label: "관계와 의리를 쉽게 무시하지 못해요.",
        bias_map: weights([
          ["reciprocity", 3],
          ["mere-association", 1],
        ]),
      },
      {
        id: "social-signal_mood",
        label: "분위기와 말투, 인상이 생각보다 크게 작용해요.",
        bias_map: weights([
          ["mere-association", 3],
          ["liking-bias", 1],
        ]),
      },
    ],
  },
  {
    id: "decision-style",
    interaction: "choice",
    prompt: "애매한 상황이 길어지면 보통 어떤 식으로 정리하나요?",
    helper: "답답함을 다루는 평소 방식을 떠올려 보세요.",
    bias_focus: ["doubt-avoidance", "inconsistency-avoidance", "pain-avoiding", "overconfidence"],
    options: [
      {
        id: "decision-style_fast",
        label: "일단 결론을 내리고 움직이면서 고쳐요.",
        bias_map: weights([
          ["doubt-avoidance", 3],
          ["overconfidence", 1],
        ]),
      },
      {
        id: "decision-style_hold",
        label: "기존에 믿던 기준과 맞는지 끝까지 확인해요.",
        bias_map: weights([
          ["inconsistency-avoidance", 3],
          ["authority", 1],
        ]),
      },
      {
        id: "decision-style_peace",
        label: "갈등과 피로가 적은 방향으로 정리해요.",
        bias_map: weights([
          ["pain-avoiding", 3],
          ["status-quo", 1],
        ]),
      },
      {
        id: "decision-style_push",
        label: "내 감과 판단을 믿고 밀어붙이는 편이에요.",
        bias_map: weights([
          ["overconfidence", 3],
          ["reward-response", 1],
        ]),
      },
    ],
  },
  {
    id: "evidence-style",
    interaction: "choice",
    prompt: "무언가를 믿게 만드는 근거는 보통 어떤 모습인가요?",
    helper: "정보를 받아들이는 방식 자체를 골라 주세요.",
    bias_focus: ["authority", "curiosity", "representativeness", "negativity-bias"],
    options: [
      {
        id: "evidence-style_expert",
        label: "전문가나 검증된 출처를 먼저 봐요.",
        bias_map: weights([
          ["authority", 3],
          ["inconsistency-avoidance", 1],
        ]),
      },
      {
        id: "evidence-style_deep",
        label: "내가 납득할 때까지 계속 찾아봐야 해요.",
        bias_map: weights([
          ["curiosity", 3],
        ]),
      },
      {
        id: "evidence-style_pattern",
        label: "몇 가지 단서만으로도 감이 오는 편이에요.",
        bias_map: weights([
          ["representativeness", 3],
          ["overconfidence", 1],
        ]),
      },
      {
        id: "evidence-style_risk",
        label: "좋은 사례보다 실패 사례가 더 오래 남아요.",
        bias_map: weights([
          ["negativity-bias", 3],
          ["pain-avoiding", 1],
        ]),
      },
    ],
  },
  {
    id: "emotion-engine",
    interaction: "choice",
    prompt: "감정이 강하게 올라올 때 내 판단은 어디로 기울기 쉬운가요?",
    helper: "압박, 기대, 평온, 현재 만족 중 더 가까운 반응을 골라 보세요.",
    bias_focus: ["stress-bias", "overoptimism", "pain-avoiding", "present-focus"],
    options: [
      {
        id: "emotion-engine_pressure",
        label: "압박이 오면 오히려 속도가 붙어요.",
        bias_map: weights([
          ["stress-bias", 3],
          ["lollapalooza", 1],
        ]),
      },
      {
        id: "emotion-engine_bright",
        label: "잘될 가능성이 먼저 크게 보여요.",
        bias_map: weights([
          ["overoptimism", 3],
          ["liking-bias", 1],
        ]),
      },
      {
        id: "emotion-engine_calm",
        label: "불편함을 줄이는 선택이 더 끌려요.",
        bias_map: weights([
          ["pain-avoiding", 3],
          ["status-quo", 1],
        ]),
      },
      {
        id: "emotion-engine_now",
        label: "지금 당장 체감되는 만족이 중요해요.",
        bias_map: weights([
          ["present-focus", 3],
          ["reward-response", 1],
        ]),
      },
    ],
  },
  {
    id: "commitment-style",
    interaction: "choice",
    prompt: "이미 시간이나 마음을 많이 쓴 일은 어떻게 다루는 편인가요?",
    helper: "포기, 유지, 의리, 경험 중 무엇이 더 크게 작동하는지 골라 주세요.",
    bias_focus: ["sunk-cost", "reciprocity", "aging-bias", "inconsistency-avoidance"],
    options: [
      {
        id: "commitment-style_keep",
        label: "여기까지 온 게 아까워서 더 버텨요.",
        bias_map: weights([
          ["sunk-cost", 3],
          ["status-quo", 1],
        ]),
      },
      {
        id: "commitment-style_loyal",
        label: "관계와 약속 때문에 쉽게 끊지 못해요.",
        bias_map: weights([
          ["reciprocity", 3],
          ["mere-association", 1],
        ]),
      },
      {
        id: "commitment-style_history",
        label: "오래 해온 방식이라 기본값처럼 느껴져요.",
        bias_map: weights([
          ["aging-bias", 3],
          ["status-quo", 1],
        ]),
      },
      {
        id: "commitment-style_belief",
        label: "내가 정한 기준을 쉽게 뒤집고 싶지 않아요.",
        bias_map: weights([
          ["inconsistency-avoidance", 3],
          ["overconfidence", 1],
        ]),
      },
    ],
  },
  {
    id: "keyword",
    interaction: "input",
    prompt: "요즘 머리를 붙잡는 단어 하나를 짧게 적어볼까요?",
    helper: "고민 주제, 사람 이름, 소비 항목처럼 짧은 말이어도 충분합니다.",
    bias_focus: ["availability", "status-quo", "sunk-cost", "social-proof"],
    placeholder: "예: 이직, 아이패드, 관계, 창업",
    examples: ["이직", "아이패드", "친구 관계"],
    input_weights: (value) => {
      const normalized = value.trim().toLowerCase();
      if (!normalized) return {};

      if (/(이직|퇴사|직장|면접|커리어|이사|직무)/.test(normalized)) {
        return weights([
          ["sunk-cost", 2],
          ["status-quo", 2],
          ["authority", 1],
          ["overoptimism", 1],
        ]);
      }

      if (/(핸드폰|아이폰|갤럭시|아이패드|맥북|기기|전자기기|구매)/.test(normalized)) {
        return weights([
          ["availability", 2],
          ["representativeness", 1],
          ["present-focus", 1],
          ["reward-response", 1],
        ]);
      }

      if (/(관계|친구|연애|부부|갈등|거리두기)/.test(normalized)) {
        return weights([
          ["reciprocity", 2],
          ["mere-association", 2],
          ["pain-avoiding", 1],
          ["negativity-bias", 1],
        ]);
      }

      if (/(돈|예산|대출|적금|투자|주식|코인|생활비)/.test(normalized)) {
        return weights([
          ["negativity-bias", 1],
          ["status-quo", 1],
          ["present-focus", 1],
          ["overconfidence", 1],
        ]);
      }

      if (/(창업|사업|확장|도전|브랜드)/.test(normalized)) {
        return weights([
          ["overconfidence", 2],
          ["lollapalooza", 2],
          ["reward-response", 1],
          ["curiosity", 1],
        ]);
      }

      return weights([
        ["availability", 1],
        ["representativeness", 1],
        ["status-quo", 1],
        ["overconfidence", 1],
      ]);
    },
  },
  {
    id: "meaning-style",
    interaction: "choice",
    prompt: "중요한 선택 앞에서 나를 가장 크게 움직이는 말은 무엇에 가깝나요?",
    helper: "정의, 재미, 확신, 비교 중 더 가까운 쪽을 골라 주세요.",
    bias_focus: ["kant-fairness", "curiosity", "lollapalooza", "envy-jealousy"],
    options: [
      {
        id: "meaning-style_fair",
        label: "맞는 선택인지, 공정한지가 중요해요.",
        bias_map: weights([
          ["kant-fairness", 3],
          ["authority", 1],
        ]),
      },
      {
        id: "meaning-style_curious",
        label: "재미와 배움이 있어야 오래 갑니다.",
        bias_map: weights([
          ["curiosity", 3],
          ["liking-bias", 1],
        ]),
      },
      {
        id: "meaning-style_allin",
        label: "여러 신호가 한 방향으로 맞으면 크게 움직여요.",
        bias_map: weights([
          ["lollapalooza", 3],
          ["reward-response", 1],
        ]),
      },
      {
        id: "meaning-style_compare",
        label: "비교가 되면 동기와 집중이 확 올라와요.",
        bias_map: weights([
          ["envy-jealousy", 3],
          ["social-proof", 1],
        ]),
      },
    ],
  },
  {
    id: "memory-style",
    interaction: "choice",
    prompt: "비슷한 문제를 다시 만나면 먼저 떠오르는 건 무엇인가요?",
    helper: "기억과 과거 경험이 현재 판단에 미치는 방식을 골라 주세요.",
    bias_focus: ["negativity-bias", "aging-bias", "authority", "availability"],
    options: [
      {
        id: "memory-style_bad",
        label: "예전에 망했던 장면이 먼저 떠올라요.",
        bias_map: weights([
          ["negativity-bias", 3],
          ["availability", 1],
        ]),
      },
      {
        id: "memory-style_experience",
        label: "검증된 경험을 다시 참고하게 돼요.",
        bias_map: weights([
          ["aging-bias", 3],
          ["status-quo", 1],
        ]),
      },
      {
        id: "memory-style_source",
        label: "누가 그렇게 말했는지가 꽤 중요해요.",
        bias_map: weights([
          ["authority", 3],
          ["mere-association", 1],
        ]),
      },
      {
        id: "memory-style_recent",
        label: "최근 사례가 가장 생생하게 기준이 돼요.",
        bias_map: weights([
          ["availability", 3],
          ["social-proof", 1],
        ]),
      },
    ],
  },
];

export function getQuestionDefinition(questionId: string) {
  return QUESTION_BANK.find((question) => question.id === questionId) ?? null;
}

export function buildStoredQuestionState(questionId: string): StoredQuestionState {
  const question = getQuestionDefinition(questionId);
  if (!question) {
    throw new Error(`Unknown question id: ${questionId}`);
  }

  return {
    id: question.id,
    prompt: question.prompt,
    helper: question.helper,
    interaction: question.interaction,
    options: question.options,
    placeholder: question.placeholder,
    examples: question.examples,
  };
}

function calculateProgress(answeredTurns: number) {
  if (answeredTurns <= 0) return 8;
  if (answeredTurns < STEP1_MIN_TURNS) {
    return Math.min(78, Math.round((answeredTurns / STEP1_MIN_TURNS) * 78));
  }

  const extra = answeredTurns - STEP1_MIN_TURNS;
  return Math.min(96, 78 + extra * 6);
}

export function toPublicQuestion(
  questionState: StoredQuestionState | null,
  answeredTurns: number,
): Step1Question | null {
  if (!questionState) return null;

  return {
    id: questionState.id,
    turn_number: answeredTurns + 1,
    prompt: questionState.prompt,
    helper: questionState.helper,
    interaction: questionState.interaction,
    options: questionState.options?.map(({ id, label }) => ({ id, label })),
    placeholder: questionState.placeholder,
    examples: questionState.examples,
    progress: calculateProgress(answeredTurns),
  };
}

export function getWeightsForAnswer(
  questionId: string,
  answer: { selected_option_id?: string; input_text?: string },
) {
  const question = getQuestionDefinition(questionId);
  if (!question) return {};

  if (question.interaction === "choice") {
    return (
      question.options?.find((option) => option.id === answer.selected_option_id)?.bias_map ?? {}
    );
  }

  return question.input_weights?.(answer.input_text ?? "") ?? {};
}

function topBiasKeys(scoreMap: Record<string, number>, count: number) {
  return Object.entries(scoreMap)
    .sort((left, right) => right[1] - left[1])
    .slice(0, count)
    .map(([key]) => key);
}

export function pickInitialQuestionId() {
  const candidateIds = STARTER_QUESTION_IDS.filter((id) =>
    QUESTION_BANK.some((question) => question.id === id),
  );
  const starters = candidateIds.length > 0 ? candidateIds : [QUESTION_BANK[0]!.id];
  return starters[Math.floor(Math.random() * starters.length)]!;
}

export function pickNextQuestionId(params: {
  askedQuestionIds: string[];
  biasScores: Record<string, number>;
  answeredTurns: number;
}) {
  const { askedQuestionIds, biasScores, answeredTurns } = params;
  const candidates = QUESTION_BANK.filter((question) => !askedQuestionIds.includes(question.id));
  if (candidates.length === 0) return null;

  const hotBiases = topBiasKeys(biasScores, 6);
  const hasMeaningfulSignal = hotBiases.some((key) => (biasScores[key] ?? 0) > 0);

  const ranked = candidates
    .map((question) => {
      let score = question.interaction === "input" ? -2 : 2;

      if (question.interaction === "input") {
        score += answeredTurns >= 3 && answeredTurns <= 6 ? 9 : -2;
      }

      if (hasMeaningfulSignal) {
        score += question.bias_focus.filter((key) => hotBiases.includes(key)).length * 4;
      } else {
        score += question.bias_focus.length;
      }

      if (answeredTurns >= STEP1_MIN_TURNS && question.interaction === "choice") {
        score += 2;
      }

      return { id: question.id, score };
    })
    .sort((left, right) => right.score - left.score);

  return ranked[0]?.id ?? null;
}
