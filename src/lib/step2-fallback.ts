import type { Step1TopCharacter } from "@/types/step1";
import type {
  Step2BiasWarning,
  Step2CriticalQuestion,
  Step2ExcludedLens,
  Step2LensResult,
  Step2LensTone,
  Step2ResultData,
} from "@/types/step2";

export const STEP2_LENSES = [
  "심리학",
  "경제학",
  "수학/통계",
  "생물학/진화",
  "물리학/공학",
  "역사학",
] as const;

export type Step2Topic =
  | "device"
  | "career"
  | "relationship"
  | "study"
  | "money"
  | "family"
  | "meal"
  | "generic";

type Step2LensSeed = {
  lens: (typeof STEP2_LENSES)[number];
  verdict: string;
  tone: Step2LensTone;
  summary: string;
};

type TopicTemplate = {
  selected: Step2LensSeed[];
  excludedReasons: Record<string, string>;
  questions: string[];
  closing: string;
};

const STOPWORDS = new Set([
  "그냥",
  "지금",
  "정말",
  "너무",
  "요즘",
  "고민",
  "문제",
  "선택",
  "결정",
  "할까",
  "해야",
  "하려고",
  "같아",
  "뭐",
  "무엇",
]);

const TOPIC_KEYWORDS: Array<{ topic: Step2Topic; keywords: string[] }> = [
  {
    topic: "family",
    keywords: ["아기", "출산", "육아", "임신", "태교", "분유", "유모차"],
  },
  {
    topic: "meal",
    keywords: ["저녁", "점심", "아침", "야식", "메뉴", "뭐먹", "무얼 먹", "배달", "식사"],
  },
  {
    topic: "device",
    keywords: ["핸드폰", "아이폰", "갤럭시", "아이패드", "맥북", "전자기기", "기기", "구매"],
  },
  {
    topic: "career",
    keywords: ["이직", "퇴사", "직장", "면접", "커리어", "직무", "회사"],
  },
  {
    topic: "relationship",
    keywords: ["연애", "관계", "친구", "갈등", "거리두기", "부부", "가족", "대화"],
  },
  {
    topic: "study",
    keywords: ["공부", "시험", "입시", "과제", "진학", "학원", "취업 준비"],
  },
  {
    topic: "money",
    keywords: ["돈", "예산", "생활비", "대출", "적금", "주식", "코인", "투자", "부족"],
  },
];

const TEMPLATES: Record<Step2Topic, TopicTemplate> = {
  meal: {
    selected: [
      {
        lens: "심리학",
        verdict: "주의: 지금 기분의 영향",
        tone: "amber",
        summary:
          "배고픔보다 피곤함이나 귀찮음이 더 크게 작동하면 메뉴보다 '아무 생각 없이 해결되는 선택'이 끌릴 수 있습니다.",
      },
      {
        lens: "경제학",
        verdict: "균형: 가격과 만족",
        tone: "blue",
        summary:
          "오늘 한 끼의 가격뿐 아니라, 배달 시간·남는 음식·내일 후회까지 같이 보면 선택 기준이 더 또렷해집니다.",
      },
      {
        lens: "생물학/진화",
        verdict: "점검: 몸이 원하는 것",
        tone: "emerald",
        summary:
          "몸이 진짜 원하는 건 자극적인 맛인지, 든든함인지, 가벼움인지 구분하면 메뉴 후보가 훨씬 빨리 줄어듭니다.",
      },
    ],
    excludedReasons: {
      역사학: "이번 고민은 장기 패턴보다 지금 컨디션과 즉시 선택 기준의 영향이 더 큽니다.",
      "물리학/공학": "복잡한 시스템 설계보다 간단한 우선순위 정리가 더 중요한 상황입니다.",
      "수학/통계": "정밀 계산보다 현재 상태와 만족 기준을 분리해 보는 쪽이 먼저입니다.",
    },
    questions: [
      "지금 내가 원하는 건 맛, 편의, 건강 중 무엇에 가장 가까운가요?",
      "먹고 난 뒤 가장 후회가 적은 선택은 무엇일까요?",
      "배달이 편한 걸 원하는 걸까, 진짜 그 메뉴가 먹고 싶은 걸까?",
    ],
    closing:
      "메뉴 선택은 정답 찾기보다 기준 정리가 먼저입니다. 지금 상태를 한 줄로 적으면 답이 꽤 빨리 좁혀집니다.",
  },
  device: {
    selected: [
      {
        lens: "경제학",
        verdict: "균형: 기회비용",
        tone: "blue",
        summary:
          "기기 가격만 보지 말고 이 돈을 다른 지출에 쓰지 못하는 비용까지 같이 보면 지금 결정의 무게가 더 또렷해집니다.",
      },
      {
        lens: "수학/통계",
        verdict: "점검: 사용 빈도",
        tone: "violet",
        summary:
          "실제로 자주 쓰는 기능과 거의 쓰지 않는 기능을 분리하면 필요와 욕심이 훨씬 명확하게 나뉩니다.",
      },
      {
        lens: "심리학",
        verdict: "주의: 즉시 보상",
        tone: "amber",
        summary:
          "새 기기를 얻는 설렘이 실제 문제 해결보다 크게 느껴질 수 있습니다. 지금 바꾸고 싶은 이유를 한 줄로 적어보면 도움이 됩니다.",
      },
    ],
    excludedReasons: {
      역사학: "오래된 반복 패턴보다 현재 사용 불편과 비용 판단이 더 중요합니다.",
      "물리학/공학": "스펙 비교는 필요하지만, 지금은 구매 기준 정리가 먼저입니다.",
      "생물학/진화": "본능적 반응보다는 소비 판단 구조를 점검하는 쪽이 핵심입니다.",
    },
    questions: [
      "이 기기를 바꾸면 해결되는 문제를 세 가지 안으로 적을 수 있나요?",
      "지금 당장 불편한 점과 있으면 좋은 점을 분리하면 무엇이 남나요?",
      "한 달 뒤에도 같은 이유로 사고 싶을까요?",
    ],
    closing:
      "기기 고민은 '좋아 보임'과 '실제 해결'을 분리하는 순간 훨씬 선명해집니다.",
  },
  career: {
    selected: [
      {
        lens: "경제학",
        verdict: "균형: 성장 자산",
        tone: "blue",
        summary:
          "연봉만이 아니라 배우는 속도, 경력 자산, 관계 비용까지 같이 보면 지금 움직일지 버틸지 판단이 더 선명해집니다.",
      },
      {
        lens: "심리학",
        verdict: "주의: 감정 과열",
        tone: "amber",
        summary:
          "지금의 분노나 실망이 회사 전체 가치를 덮고 있을 수 있습니다. 사건과 구조를 따로 적어보는 게 좋습니다.",
      },
      {
        lens: "역사학",
        verdict: "점검: 반복 패턴",
        tone: "violet",
        summary:
          "비슷한 이유로 흔들린 적이 반복되었다면, 이번 고민은 단발성 감정보다 구조 문제일 가능성이 큽니다.",
      },
    ],
    excludedReasons: {
      "생물학/진화": "생존 반응 자체보다 커리어 구조와 기회비용 판단이 더 중요합니다.",
      "물리학/공학": "지금은 시스템 설계보다 감정과 자산을 분리해 보는 단계입니다.",
      "수학/통계": "정량 비교도 필요하지만, 우선 판단 기준을 세우는 것이 먼저입니다.",
    },
    questions: [
      "지금 회사를 떠나고 싶은 이유를 사람, 구조, 성장으로 나누면 무엇이 남나요?",
      "버틸 때 얻는 것과 떠날 때 얻는 것을 같은 기준으로 적으면 어떻게 달라지나요?",
      "이번 고민은 이번 달 감정일까요, 6개월짜리 패턴일까요?",
    ],
    closing:
      "이직 고민은 감정의 세기보다 비교 기준을 먼저 세울 때 훨씬 덜 흔들립니다.",
  },
  relationship: {
    selected: [
      {
        lens: "심리학",
        verdict: "주의: 해석 비약",
        tone: "amber",
        summary:
          "상대의 행동에 바로 의미를 붙이면 감정이 커지기 쉽습니다. 사실과 해석을 분리하면 판단의 온도가 내려갑니다.",
      },
      {
        lens: "생물학/진화",
        verdict: "점검: 방어 반응",
        tone: "emerald",
        summary:
          "서운함이 올라오는 순간 방어 모드로 들어가면 대화보다 반응이 먼저 나올 수 있습니다. 내가 무엇을 지키려는지 보는 게 중요합니다.",
      },
      {
        lens: "역사학",
        verdict: "균형: 반복 패턴",
        tone: "violet",
        summary:
          "이번 갈등이 처음인지, 자주 반복된 패턴인지에 따라 풀어야 할 방식이 완전히 달라집니다.",
      },
    ],
    excludedReasons: {
      경제학: "손익 계산보다 감정과 관계 패턴 해석이 더 중요한 단계입니다.",
      "수학/통계": "정량 계산보다 사실과 해석의 분리가 먼저입니다.",
      "물리학/공학": "구조화도 가능하지만 지금은 감정 반응 정리가 우선입니다.",
    },
    questions: [
      "상대가 실제로 한 행동과 내가 해석한 의미를 나누면 각각 무엇인가요?",
      "내가 지금 원하는 건 관계 회복일까요, 인정받는 느낌일까요?",
      "이번 갈등은 처음인가요, 반복되던 패턴인가요?",
    ],
    closing:
      "관계 고민은 상대를 바꾸는 문제보다 내 해석 구조를 먼저 점검할 때 훨씬 선명해집니다.",
  },
  study: {
    selected: [
      {
        lens: "수학/통계",
        verdict: "균형: 실제 진도",
        tone: "blue",
        summary:
          "막연한 불안보다 실제 진도, 남은 시간, 약한 파트를 수치로 보면 무엇이 급한지가 또렷해집니다.",
      },
      {
        lens: "심리학",
        verdict: "주의: 비교 스트레스",
        tone: "amber",
        summary:
          "내 상태보다 남의 속도를 기준으로 보면 실력보다 불안이 더 커질 수 있습니다.",
      },
      {
        lens: "역사학",
        verdict: "점검: 학습 패턴",
        tone: "violet",
        summary:
          "비슷한 시점마다 무너지는 패턴이 있다면 의지 문제가 아니라 구조 문제일 가능성이 큽니다.",
      },
    ],
    excludedReasons: {
      경제학: "비용 계산보다 현재 학습 구조를 점검하는 쪽이 더 직접적입니다.",
      "생물학/진화": "생존 반응 해석보다 불안과 진도 분리가 핵심입니다.",
      "물리학/공학": "복잡한 시스템 설계 이전에 현재 병목 구간을 찾는 게 우선입니다.",
    },
    questions: [
      "지금 불안한 이유를 실력 부족, 시간 부족, 비교 스트레스 중 어디에 더 가깝게 느끼나요?",
      "이번 주 안에 바꿀 수 있는 가장 작은 공부 행동은 무엇인가요?",
      "이번 고민은 방향 문제인가요, 리듬 문제인가요?",
    ],
    closing:
      "공부 고민은 감정의 크기보다 병목 지점을 찾는 순간 훨씬 관리가 쉬워집니다.",
  },
  money: {
    selected: [
      {
        lens: "경제학",
        verdict: "주의: 현금흐름 압박",
        tone: "blue",
        summary:
          "막연한 부족감과 실제 부족 금액은 다를 수 있습니다. 고정지출과 변동지출을 나누면 선택지가 생깁니다.",
      },
      {
        lens: "수학/통계",
        verdict: "균형: 최소 단위 계산",
        tone: "violet",
        summary:
          "한 달 전체 걱정보다 이번 주, 이번 달 최소 단위로 쪼개면 불안이 현실적인 문제로 바뀝니다.",
      },
      {
        lens: "심리학",
        verdict: "점검: 불안 증폭",
        tone: "amber",
        summary:
          "돈 문제는 실제 수치보다 통제감 상실이 더 크게 느껴질 때가 많습니다. 감정과 숫자를 분리해 보세요.",
      },
    ],
    excludedReasons: {
      역사학: "과거 패턴보다 현재 현금흐름 구조를 점검하는 편이 더 직접적입니다.",
      "생물학/진화": "생존 압박 해석 자체보다 예산 구조 정리가 더 중요합니다.",
      "물리학/공학": "시스템 설계 이전에 현재 부족 구조를 보는 것이 우선입니다.",
    },
    questions: [
      "지금의 돈 걱정은 실제 부족 때문인가요, 통제감이 무너진 느낌 때문인가요?",
      "반드시 내야 하는 돈과 줄일 수 있는 돈을 나누면 어떻게 보이나요?",
      "이번 달을 버티는 행동과 구조를 바꾸는 행동은 각각 무엇인가요?",
    ],
    closing:
      "돈 고민은 막연함을 숫자로 바꾸는 순간부터 해결 가능한 문제로 바뀝니다.",
  },
  family: {
    selected: [
      {
        lens: "심리학",
        verdict: "주의: 불안 확대",
        tone: "amber",
        summary:
          "아기와 출산 관련 고민은 아주 작은 변수도 크게 느껴질 수 있습니다. 지금 걱정이 준비 항목인지 감정 신호인지 먼저 나눠보세요.",
      },
      {
        lens: "경제학",
        verdict: "균형: 필수와 선택",
        tone: "blue",
        summary:
          "모든 걸 한 번에 준비하려 하면 비용과 에너지가 함께 커집니다. 꼭 필요한 것과 있으면 좋은 것을 분리해야 합니다.",
      },
      {
        lens: "물리학/공학",
        verdict: "점검: 순서 설계",
        tone: "emerald",
        summary:
          "준비는 감정으로 버티기보다 체크리스트와 순서로 나눌수록 부담이 줄어듭니다.",
      },
    ],
    excludedReasons: {
      역사학: "장기 패턴보다 현재 준비 우선순위를 정하는 것이 더 중요합니다.",
      "생물학/진화": "본능적 불안 해석보다 실제 준비 구조를 만드는 쪽이 먼저입니다.",
      "수학/통계": "정밀 계산보다는 준비 항목을 분류하는 단계가 더 핵심입니다.",
    },
    questions: [
      "지금 걱정하는 것 중 실제 준비 항목은 무엇이고, 막연한 불안은 무엇인가요?",
      "이번 달 안에 꼭 준비해야 하는 것 세 가지는 무엇인가요?",
      "정보를 더 모아야 하나요, 아니면 이미 충분히 모아서 정리만 하면 되나요?",
    ],
    closing:
      "출산과 육아 준비는 완벽함보다 우선순위 정리가 훨씬 큰 안정감을 줍니다.",
  },
  generic: {
    selected: [
      {
        lens: "심리학",
        verdict: "주의: 감정 개입",
        tone: "amber",
        summary:
          "지금 고민의 크기가 실제 문제보다 감정의 온도에 의해 커져 있을 수 있습니다. 먼저 감정을 이름 붙여 보세요.",
      },
      {
        lens: "경제학",
        verdict: "균형: 선택의 대가",
        tone: "blue",
        summary:
          "하나를 고르면 동시에 놓치는 것도 생깁니다. 얻는 것과 놓는 것을 함께 적으면 기준이 분명해집니다.",
      },
      {
        lens: "역사학",
        verdict: "점검: 반복 패턴",
        tone: "violet",
        summary:
          "이번 고민이 처음인지, 늘 비슷한 방식으로 반복되는지에 따라 풀어야 하는 방식이 달라집니다.",
      },
    ],
    excludedReasons: {
      "생물학/진화": "본능 반응 해석보다 현재 기준 정리가 먼저 필요한 단계입니다.",
      "물리학/공학": "구조 설계보다 지금 무엇이 문제인지 분리하는 것이 먼저입니다.",
      "수학/통계": "정량 계산 이전에 판단 기준을 분명히 하는 편이 낫습니다.",
    },
    questions: [
      "이 고민에서 내가 가장 두려워하는 건 무엇인가요?",
      "지금 정답이 필요한 걸까요, 아니면 기준 정리가 필요한 걸까요?",
      "이번 문제는 처음인가요, 반복되는 패턴인가요?",
    ],
    closing:
      "좋은 결정은 답을 빨리 고르는 것보다 기준을 먼저 세우는 데서 시작합니다.",
  },
};

export function getExpectedLensesForTopic(topic: Step2Topic) {
  return TEMPLATES[topic].selected.map((item) => item.lens);
}

export function detectStep2Topic(text: string): Step2Topic {
  const normalized = text.toLowerCase();

  for (const item of TOPIC_KEYWORDS) {
    if (item.keywords.some((keyword) => normalized.includes(keyword))) {
      return item.topic;
    }
  }

  return "generic";
}

export function extractStep2Keywords(text: string) {
  return Array.from(
    new Set(
      (text.toLowerCase().match(/[가-힣a-z0-9]{2,}/g) ?? []).filter(
        (token) => token.length >= 2 && !STOPWORDS.has(token),
      ),
    ),
  );
}

export function buildStep2Anchors(text: string) {
  const anchors = new Set<string>(extractStep2Keywords(text));
  const topic = detectStep2Topic(text);

  const topicAnchors: Record<Step2Topic, string[]> = {
    device: ["기기", "구매", "예산", "기능", "교체"],
    career: ["이직", "퇴사", "직장", "커리어", "성장"],
    relationship: ["관계", "대화", "감정", "갈등", "거리"],
    study: ["공부", "시험", "진도", "불안", "준비"],
    money: ["돈", "예산", "지출", "부족", "생활비"],
    family: ["아기", "출산", "준비", "육아", "예산"],
    meal: ["저녁", "메뉴", "배달", "식사", "배고픔"],
    generic: ["고민", "선택", "기준", "반복", "감정"],
  };

  topicAnchors[topic].forEach((anchor) => anchors.add(anchor));
  return Array.from(anchors);
}

export function countAnchorHits(text: string, anchors: string[]) {
  const normalized = text.toLowerCase();
  return anchors.filter((anchor) => normalized.includes(anchor.toLowerCase())).length;
}

function buildExcludedLenses(selected: Step2LensResult[], topic: Step2Topic): Step2ExcludedLens[] {
  const selectedSet = new Set(selected.map((item) => item.lens));
  return STEP2_LENSES.filter((lens) => !selectedSet.has(lens))
    .slice(0, 2)
    .map((lens) => ({
      lens,
      reason:
        TEMPLATES[topic].excludedReasons[lens] ??
        "이번 고민에서는 우선순위가 한 단계 뒤로 밀린 관점입니다.",
    }));
}

function buildBiasWarning(topBias: Step1TopCharacter, topic: Step2Topic): Step2BiasWarning {
  const topicLine: Record<Step2Topic, string> = {
    device: "최근에 본 정보와 새 기기 욕구가 실제 필요보다 더 크게 보일 수 있습니다.",
    career: "현재의 감정이 커리어 전체 가치 판단을 덮고 있을 수 있습니다.",
    relationship: "상대의 행동에 의미를 빠르게 붙이면서 감정이 커질 수 있습니다.",
    study: "비교와 불안이 실제 준비 상태보다 더 크게 느껴질 수 있습니다.",
    money: "막연한 부족감이 실제 숫자보다 더 크게 느껴질 수 있습니다.",
    family: "보호하고 싶은 마음이 준비 항목을 끝없이 늘리게 만들 수 있습니다.",
    meal: "지금 컨디션과 즉시 만족이 기준 전체를 밀어낼 수 있습니다.",
    generic: "익숙한 판단 방식이 반복되면서 다른 선택지를 줄여 볼 수 있습니다.",
  };

  return {
    title: "생각 경고등",
    tag: `${topBias.character_name} 성향`,
    body: `${topBias.character_name} 성향은 분명한 패턴을 빠르게 만드는 힘이 있지만, 이번 고민에서는 ${topicLine[topic]} 지금 필요한 검토와 이미 충분히 검토한 것을 나눠 보세요.`,
  };
}

export function buildStructuredStep2Fallback(params: {
  sessionId: string;
  dilemmaText: string;
  topBias: Step1TopCharacter;
}): Step2ResultData {
  const topic = detectStep2Topic(params.dilemmaText);
  const template = TEMPLATES[topic];
  const selected_lenses: Step2LensResult[] = template.selected.map((item) => ({ ...item }));

  return {
    session_id: params.sessionId,
    dilemma_text: params.dilemmaText,
    bias_warning: buildBiasWarning(params.topBias, topic),
    selected_lenses,
    excluded_lenses: buildExcludedLenses(selected_lenses, topic),
    critical_questions: template.questions.map((text, index) => ({
      id: `q${index + 1}`,
      text,
    })),
    closing: template.closing,
  };
}
