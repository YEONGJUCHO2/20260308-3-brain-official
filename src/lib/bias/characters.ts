export type BiasTone = "pink" | "violet" | "indigo";

export type BiasCatalogueEntry = {
  biasId: number;
  key: string;
  biasNameOriginal: string;
  characterName: string;
  subtitle: string;
  summary: string;
  detail: string;
  strength: string;
  watchOutFor: string;
  reflectionQuestion: string;
  tone: BiasTone;
  imageSlug: string;
};

const tones: BiasTone[] = ["pink", "violet", "indigo"];

function toneAt(index: number): BiasTone {
  return tones[index % tones.length]!;
}

const IMAGE_SLUGS: Record<string, string> = {
  "reward-response": "instinctive-actor",
  "liking-bias": "passionate-diver",
  "disliking-bias": "intuitive-critic",
  "doubt-avoidance": "fast-decision-maker",
  "inconsistency-avoidance": "conviction-guardian",
  curiosity: "endless-explorer",
  "kant-fairness": "scales-of-justice",
  "envy-jealousy": "passionate-competitor",
  reciprocity: "loyal-reciprocator",
  "mere-association": "mood-leader",
  "negativity-bias": "careful-memory-keeper",
  overoptimism: "born-optimist",
  "pain-avoiding": "peaceful-strategist",
  overconfidence: "self-assured-leader",
  "sunk-cost": "persistent-investor",
  availability: "trend-sensor",
  representativeness: "intuitive-profiler",
  authority: "knowledge-collector",
  "social-proof": "empathetic-trendsetter",
  "contrast-effect": "context-interpreter",
  "stress-bias": "emotional-sprinter",
  "status-quo": "stability-strategist",
  "present-focus": "moment-focus-executor",
  "aging-bias": "guardian-of-experience",
  lollapalooza: "all-in-breakthrough",
};

const rawEntries = [
  {
    key: "reward-response",
    biasNameOriginal: "보상/처벌 초반응",
    characterName: "본능적 행동가",
    subtitle: "보상이 보이면 먼저 움직이는 사람",
    summary: "작은 보상 신호에도 빠르게 반응하며 실행 버튼을 먼저 누르는 편입니다.",
    detail:
      "즉각적인 보상과 자극을 잘 포착해서 흐름을 빨리 타는 편입니다. 덕분에 새로운 기회에 먼저 올라타지만, 눈앞의 보상이 장기적인 손익보다 더 크게 느껴질 때가 있습니다.",
    strength: "시작이 빠르고 추진력이 강해서 남들이 망설일 때 먼저 움직일 수 있습니다.",
    watchOutFor: "바로 주어지는 만족감 때문에 나중 비용이나 후회 가능성을 작게 볼 수 있습니다.",
    reflectionQuestion: "내가 지금 끌리는 이유는 진짜 필요여서일까, 아니면 즉시 보상이 달콤해서일까?",
  },
  {
    key: "liking-bias",
    biasNameOriginal: "좋아하는 것 편향",
    characterName: "애정형 몰입가",
    subtitle: "좋아하면 깊게 파고드는 사람",
    summary: "호감이 생긴 대상에는 시간과 에너지를 아낌없이 쓰는 편입니다.",
    detail:
      "좋아하는 사람, 브랜드, 일, 취향과 만났을 때 몰입도가 크게 올라갑니다. 몰입 자체는 강점이지만, 호감이 판단의 기준을 지나치게 넓게 덮어버리면 단점이 잘 안 보일 수 있습니다.",
    strength: "에너지를 오래 유지하고 관계나 프로젝트를 깊게 키워나갈 힘이 있습니다.",
    watchOutFor: "좋아한다는 이유만으로 검증 기준이 느슨해질 수 있습니다.",
    reflectionQuestion: "나는 지금 대상을 좋아해서 높게 평가하는 걸까, 실제 근거가 충분해서 높게 평가하는 걸까?",
  },
  {
    key: "disliking-bias",
    biasNameOriginal: "싫어하는 것 편향",
    characterName: "직감형 비평가",
    subtitle: "불편한 신호를 먼저 감지하는 사람",
    summary: "거슬리는 점을 빠르게 발견하고 경계선을 세우는 감각이 예민합니다.",
    detail:
      "무언가가 불편하거나 납득되지 않을 때 그 신호를 빨리 알아차립니다. 위험 회피에는 도움이 되지만, 첫 거부감이 전체 대상을 덮어버리면 평가가 지나치게 가혹해질 수 있습니다.",
    strength: "리스크와 불쾌감을 초기에 감지해 손실을 줄이는 데 강합니다.",
    watchOutFor: "첫인상의 거부감이 장점이나 맥락까지 함께 밀어낼 수 있습니다.",
    reflectionQuestion: "내가 지금 싫어하는 건 대상 전체일까, 아니면 특정 요소 하나일까?",
  },
  {
    key: "doubt-avoidance",
    biasNameOriginal: "의심 회피",
    characterName: "속도형 결단가",
    subtitle: "불확실함 속에서도 빨리 결론내는 사람",
    summary: "애매한 상태를 오래 끌기보다 빠르게 정리하고 앞으로 나아가고 싶어합니다.",
    detail:
      "정보가 완벽하지 않아도 결정을 내리고 움직이며, 정체된 상태를 싫어합니다. 속도는 강점이지만, 성급한 확정이 검토 부족으로 이어지면 나중에 수정 비용이 커질 수 있습니다.",
    strength: "불확실성을 견디며 결정을 밀어붙일 실행력이 있습니다.",
    watchOutFor: "애매함을 빨리 끝내고 싶은 마음이 검토 자체를 줄일 수 있습니다.",
    reflectionQuestion: "내가 지금 답을 찾은 걸까, 아니면 답답함을 끝내고 싶은 걸까?",
  },
  {
    key: "inconsistency-avoidance",
    biasNameOriginal: "비일관성 회피",
    characterName: "신념의 수호자",
    subtitle: "한번 믿으면 쉽게 흔들리지 않는 사람",
    summary: "스스로 세운 기준과 입장을 오래 지키려는 힘이 강합니다.",
    detail:
      "이미 정한 원칙과 판단을 유지하려는 경향이 있어서 쉽게 오락가락하지 않습니다. 일관성은 신뢰를 주지만, 새 정보가 들어와도 기존 관점을 고수하면 수정 타이밍을 놓칠 수 있습니다.",
    strength: "기준이 분명하고 쉽게 흔들리지 않아 추진과 설득의 중심을 잡아줍니다.",
    watchOutFor: "이미 믿은 결론을 지키려다 반대 근거를 충분히 보지 못할 수 있습니다.",
    reflectionQuestion: "내가 이 생각을 지키는 이유는 근거가 여전히 유효해서일까, 아니면 틀리고 싶지 않아서일까?",
  },
  {
    key: "curiosity",
    biasNameOriginal: "호기심 편향",
    characterName: "끝없는 탐구자",
    subtitle: "궁금하면 끝까지 파고드는 사람",
    summary: "한번 궁금증이 생기면 스스로 납득할 때까지 더 알아보고 싶어합니다.",
    detail:
      "표면적인 설명보다 구조와 맥락을 확인하고 싶어하는 경향이 강합니다. 덕분에 깊이 있는 이해에 유리하지만, 탐색이 길어지면 결정이 늦어질 수 있습니다.",
    strength: "문제의 구조를 파고들며 얕은 결론에 머물지 않는 힘이 있습니다.",
    watchOutFor: "탐색 자체가 목적이 되어 결정을 계속 미루게 될 수 있습니다.",
    reflectionQuestion: "지금 더 알아야 해서 멈추는 걸까, 아니면 결정이 부담돼서 탐색으로 버티는 걸까?",
  },
  {
    key: "kant-fairness",
    biasNameOriginal: "칸트식 공정성 편향",
    characterName: "정의의 저울",
    subtitle: "공정함에 민감하게 반응하는 사람",
    summary: "손해보다도 불공정함 자체에 더 크게 반응하는 편입니다.",
    detail:
      "룰이 맞는지, 절차가 공정한지, 기준이 균형적인지를 중요하게 봅니다. 덕분에 억울함을 잘 포착하지만, 모든 판단을 공정성 렌즈 하나로만 보면 현실적인 타협이 어려워질 수 있습니다.",
    strength: "불합리한 구조와 편파적인 기준을 빠르게 감지합니다.",
    watchOutFor: "공정성 감각이 강할수록 감정적 피로와 분노도 커질 수 있습니다.",
    reflectionQuestion: "나는 지금 손해가 싫은 걸까, 아니면 이 상황이 불공정해서 더 힘든 걸까?",
  },
  {
    key: "envy-jealousy",
    biasNameOriginal: "질투/시기 편향",
    characterName: "열정형 경쟁자",
    subtitle: "비교 속에서 추진력이 올라가는 사람",
    summary: "남의 성과를 보면 자극을 강하게 받아 속도를 끌어올리는 편입니다.",
    detail:
      "비교 상황에서 동기와 추진력이 올라가며, 경쟁을 자원으로 활용합니다. 다만 비교가 심해지면 원래 목표보다 남보다 앞서는 것 자체가 중심이 될 수 있습니다.",
    strength: "경쟁을 에너지로 바꾸는 능력이 있어 성과를 빠르게 끌어올릴 수 있습니다.",
    watchOutFor: "타인의 속도가 내 기준을 잠식하면 방향을 잃기 쉽습니다.",
    reflectionQuestion: "나는 지금 진짜 원하는 걸 향해 달리는 걸까, 아니면 남을 따라잡기 위해 달리는 걸까?",
  },
  {
    key: "reciprocity",
    biasNameOriginal: "상호성 편향",
    characterName: "관계의 의리파",
    subtitle: "받은 만큼 돌려주고 싶은 사람",
    summary: "호의와 도움을 그냥 넘기지 않고 관계의 빚으로 기억하는 편입니다.",
    detail:
      "도움을 받으면 갚고 싶고, 신세를 지면 책임감을 느끼는 경향이 큽니다. 관계를 오래 지키는 장점이 있지만, 마음의 빚이 판단을 흐리게 만들면 원치 않는 선택도 계속 하게 됩니다.",
    strength: "신뢰를 쌓고 관계를 오래 유지하는 힘이 큽니다.",
    watchOutFor: "호의에 대한 부담감이 내 경계선과 우선순위를 흐릴 수 있습니다.",
    reflectionQuestion: "이 선택이 내 의지에서 나오는 걸까, 아니면 미안함을 줄이기 위한 반응일까?",
  },
  {
    key: "mere-association",
    biasNameOriginal: "단순 연상 편향",
    characterName: "분위기 리더",
    subtitle: "분위기와 인상에 민감한 사람",
    summary: "대상 자체보다 함께 붙어 있는 인상과 분위기를 크게 받아들입니다.",
    detail:
      "좋은 분위기, 세련된 이미지, 누군가의 말투 같은 주변 요소가 판단에 큰 영향을 줍니다. 덕분에 맥락을 읽는 데 강하지만, 본질보다 포장에 더 끌릴 수 있습니다.",
    strength: "분위기와 관계의 흐름을 빠르게 파악합니다.",
    watchOutFor: "느낌이 좋다는 이유만으로 내용도 좋아 보일 수 있습니다.",
    reflectionQuestion: "내가 지금 반응하는 건 내용일까, 아니면 그걸 둘러싼 분위기일까?",
  },
  {
    key: "negativity-bias",
    biasNameOriginal: "부정성 편향",
    characterName: "신중한 기록가",
    subtitle: "안 좋은 사례를 오래 기억하는 사람",
    summary: "좋은 일보다 불편했던 사건과 실수를 더 선명하게 기억하는 편입니다.",
    detail:
      "부정적인 경험은 생존에 중요했기 때문에 더 오래 남는 경향이 있습니다. 덕분에 실수 예방에는 강하지만, 예외적인 실패 하나가 전체 가능성을 덮어버릴 수 있습니다.",
    strength: "리스크를 기억하고 같은 실수를 줄이는 데 유리합니다.",
    watchOutFor: "한 번의 나쁜 경험이 전체 확률보다 훨씬 크게 느껴질 수 있습니다.",
    reflectionQuestion: "내가 지금 참고하는 건 반복된 패턴일까, 아니면 강하게 남은 한 번의 기억일까?",
  },
  {
    key: "overoptimism",
    biasNameOriginal: "과도한 낙관주의",
    characterName: "타고난 낙관주의자",
    subtitle: "가능성을 먼저 보는 사람",
    summary: "상황이 어려워도 잘될 방향과 회복 가능성을 먼저 떠올립니다.",
    detail:
      "가능성과 회복력을 먼저 보는 태도는 큰 장점입니다. 다만 최선의 시나리오가 머릿속에서 너무 생생해지면 비용과 제약을 작게 볼 위험도 생깁니다.",
    strength: "침체된 분위기에서도 시도와 회복의 동력을 만들어냅니다.",
    watchOutFor: "잘될 수 있다는 감각이 준비 부족을 덮어줄 수는 없습니다.",
    reflectionQuestion: "나는 가능성을 보는 걸까, 아니면 불편한 현실 점검을 미루는 걸까?",
  },
  {
    key: "pain-avoiding",
    biasNameOriginal: "고통 회피 편향",
    characterName: "평화로운 완화가",
    subtitle: "불편한 충돌을 줄이고 싶은 사람",
    summary: "갈등과 마찰을 오래 끌기보다 빨리 완화하고 싶어합니다.",
    detail:
      "불필요한 상처와 긴장을 줄이는 감각이 뛰어나며, 관계를 부드럽게 조정하는 데 강합니다. 하지만 필요한 충돌까지 피하게 되면 문제를 미루는 방향으로 흐를 수 있습니다.",
    strength: "상황을 부드럽게 만들고 과열을 빠르게 낮추는 데 강합니다.",
    watchOutFor: "지금의 평온을 지키려다 더 큰 문제를 뒤로 미룰 수 있습니다.",
    reflectionQuestion: "나는 지금 문제를 푸는 걸까, 아니면 불편함을 잠깐 덮고 있는 걸까?",
  },
  {
    key: "overconfidence",
    biasNameOriginal: "과신 편향",
    characterName: "자기확신형 리더",
    subtitle: "자신의 판단을 신뢰하는 사람",
    summary: "방향을 정하면 머뭇거리지 않고 스스로의 판단을 밀어붙이는 편입니다.",
    detail:
      "확신이 강하면 팀과 상황을 앞으로 끌고 가는 추진력이 생깁니다. 다만 확신의 속도가 검증의 속도보다 빨라지면 오판을 오래 끌고 갈 수 있습니다.",
    strength: "결정이 필요한 순간에 중심을 잡고 행동을 만들 수 있습니다.",
    watchOutFor: "확신이 높을수록 반대 근거를 일부러 더 챙겨봐야 균형이 잡힙니다.",
    reflectionQuestion: "내 확신은 검증을 거친 결과일까, 아니면 익숙한 감각의 힘일까?",
  },
  {
    key: "sunk-cost",
    biasNameOriginal: "매몰비용 편향",
    characterName: "끈기의 투자자",
    subtitle: "이미 들인 것을 쉽게 놓지 못하는 사람",
    summary: "시간, 돈, 애정을 많이 쏟은 대상일수록 계속 붙잡고 싶은 마음이 커집니다.",
    detail:
      "버티는 힘 자체는 귀한 자원입니다. 하지만 이미 쓴 비용은 되돌아오지 않기 때문에, 과거의 투자량이 앞으로의 판단까지 지배하면 손실이 더 커질 수 있습니다.",
    strength: "쉽게 포기하지 않고 오래 밀어붙일 체력이 있습니다.",
    watchOutFor: "버틴 만큼 더 좋아질 거라는 믿음이 냉정한 손절을 늦출 수 있습니다.",
    reflectionQuestion: "내가 지금 지키는 건 미래 가치일까, 아니면 이미 쏟아부은 과거일까?",
  },
  {
    key: "availability",
    biasNameOriginal: "가용성 편향",
    characterName: "트렌드 감지자",
    subtitle: "최근 정보에 빠르게 반응하는 사람",
    summary: "방금 본 사례나 자주 떠오르는 이미지에 판단이 민감하게 반응합니다.",
    detail:
      "최근 접한 정보는 생생해서 실제보다 더 중요하게 느껴집니다. 덕분에 변화 흐름을 빨리 읽지만, 눈앞의 사례 몇 개가 전체 현실을 대표한다고 착각할 수 있습니다.",
    strength: "최신 분위기와 눈앞의 변화 신호를 빠르게 읽어냅니다.",
    watchOutFor: "생생한 사례가 통계와 전체 맥락을 밀어낼 수 있습니다.",
    reflectionQuestion: "지금 내 판단은 전체 데이터를 보고 있나, 아니면 방금 떠오른 사례에 끌리고 있나?",
  },
  {
    key: "representativeness",
    biasNameOriginal: "대표성 편향",
    characterName: "직관의 프로파일러",
    subtitle: "첫인상에서 많은 걸 읽어내는 사람",
    summary: "몇 가지 단서만 봐도 패턴을 재빨리 읽고 분류하는 편입니다.",
    detail:
      "짧은 관찰로도 분위기와 성격, 가능성을 빠르게 추정합니다. 빠른 판단엔 유리하지만, 표본이 적을수록 ‘그럴듯함’이 실제 확률을 이길 수 있습니다.",
    strength: "복잡한 상황을 빨리 구조화하고 첫 판단을 내리는 데 강합니다.",
    watchOutFor: "그럴듯한 패턴이 실제 데이터보다 더 설득력 있게 느껴질 수 있습니다.",
    reflectionQuestion: "내가 지금 본 건 진짜 패턴일까, 아니면 패턴처럼 보이는 몇 개의 단서일까?",
  },
  {
    key: "authority",
    biasNameOriginal: "권위 편향",
    characterName: "지식 수집가",
    subtitle: "전문가의 근거를 모으는 사람",
    summary: "검증된 출처와 전문가 의견을 통해 판단의 기준을 세우려는 편입니다.",
    detail:
      "전문가와 권위 있는 정보는 판단의 오류를 줄이는 데 도움을 줍니다. 하지만 권위 자체가 정답의 보증은 아니기 때문에, 말한 사람이 누구인지와 말의 내용은 분리해서 볼 필요가 있습니다.",
    strength: "근거와 자료를 찾아보며 판단을 체계화합니다.",
    watchOutFor: "신뢰하는 출처라고 해서 항상 내 상황에 맞는 답은 아닐 수 있습니다.",
    reflectionQuestion: "나는 지금 좋은 근거를 믿는 걸까, 아니면 권위 있는 사람이라서 믿는 걸까?",
  },
  {
    key: "social-proof",
    biasNameOriginal: "사회적 증거",
    characterName: "공감형 트렌드세터",
    subtitle: "주변의 흐름에 민감한 사람",
    summary: "다른 사람들의 반응과 선택을 중요한 참고 정보로 삼습니다.",
    detail:
      "사람들의 선택은 때로 좋은 힌트가 됩니다. 하지만 다수가 고른 것과 나에게 맞는 것은 다를 수 있어서, 분위기와 개인 기준을 분리해 보는 습관이 필요합니다.",
    strength: "집단의 흐름과 공감 포인트를 빠르게 파악합니다.",
    watchOutFor: "남들이 한다는 이유가 내 선택의 핵심 근거가 될 수 있습니다.",
    reflectionQuestion: "나는 지금 다수의 선택을 참고하는 걸까, 아니면 그대로 따라가고 있는 걸까?",
  },
  {
    key: "contrast-effect",
    biasNameOriginal: "대비 효과",
    characterName: "맥락 해석가",
    subtitle: "비교와 맥락에 민감한 사람",
    summary: "같은 대상도 무엇과 나란히 놓이느냐에 따라 다르게 느끼는 편입니다.",
    detail:
      "가격, 선택지, 성과, 사람 모두 단독이 아니라 비교 속에서 인식됩니다. 맥락을 읽는 능력은 좋지만, 바로 앞에 놓인 기준점 하나가 전체 판단을 끌고 갈 수 있습니다.",
    strength: "비교 구조와 기준점의 힘을 빨리 파악합니다.",
    watchOutFor: "기준점이 바뀌면 내 판단도 크게 흔들릴 수 있습니다.",
    reflectionQuestion: "내가 이걸 높게 보는 이유는 절대값이 좋아서일까, 아니면 비교 대상이 바뀌어서일까?",
  },
  {
    key: "stress-bias",
    biasNameOriginal: "스트레스 편향",
    characterName: "감정형 스프린터",
    subtitle: "압박 속에서 속도가 붙는 사람",
    summary: "긴장과 압박이 오면 감정 에너지와 행동 속도가 함께 올라갑니다.",
    detail:
      "압박 상황에서 집중력과 추진력이 폭발하는 타입입니다. 다만 감정의 속도가 빨라질수록 판단이 거칠어질 수 있어, 속도와 정밀도를 구분해서 관리할 필요가 있습니다.",
    strength: "압박 속에서도 멈추지 않고 행동을 만들어냅니다.",
    watchOutFor: "스트레스 에너지가 강할수록 결론도 지나치게 급해질 수 있습니다.",
    reflectionQuestion: "나는 지금 집중력이 올라간 걸까, 아니면 조급함이 판단을 밀어내는 걸까?",
  },
  {
    key: "status-quo",
    biasNameOriginal: "현상유지 편향",
    characterName: "안정 추구형 전략가",
    subtitle: "검증된 것을 선호하는 사람",
    summary: "익숙하고 검증된 선택지를 기본값으로 놓고 판단하는 편입니다.",
    detail:
      "안정성을 우선하는 태도는 큰 실수를 줄여줍니다. 하지만 바뀌지 않는 것이 가장 안전한 선택이라는 전제가 굳어지면, 필요한 변화도 늦게 받아들일 수 있습니다.",
    strength: "충동적 변화보다 안정적 선택을 고르는 감각이 좋습니다.",
    watchOutFor: "익숙함이 곧 최선이라는 착각이 생기기 쉽습니다.",
    reflectionQuestion: "나는 이 선택이 안전해서 고르는 걸까, 아니면 바꾸는 부담이 싫어서 고르는 걸까?",
  },
  {
    key: "present-focus",
    biasNameOriginal: "현재 효용 편향",
    characterName: "순간 몰입형 실행가",
    subtitle: "지금의 체감에 강하게 반응하는 사람",
    summary: "먼 미래보다 지금 바로 느껴지는 만족과 효율을 크게 봅니다.",
    detail:
      "현재의 만족과 생생한 체감은 행동을 만드는 강력한 힘입니다. 하지만 지금 편한 선택이 나중 비용을 키울 수도 있어서, 현재 효용과 미래 비용을 함께 봐야 균형이 맞습니다.",
    strength: "지금 필요한 에너지와 동기를 빠르게 확보합니다.",
    watchOutFor: "당장의 편안함이 미래의 부담을 가릴 수 있습니다.",
    reflectionQuestion: "내가 지금 원하는 건 진짜 우선순위일까, 아니면 당장 편해지고 싶은 마음일까?",
  },
  {
    key: "aging-bias",
    biasNameOriginal: "노화 편향",
    characterName: "경험 우선주의자",
    subtitle: "검증된 경험을 신뢰하는 사람",
    summary: "새로운 방식보다 오래 검증된 방식과 경험의 축적을 더 신뢰합니다.",
    detail:
      "경험은 불확실성을 줄여주는 강력한 자산입니다. 하지만 과거에 잘 통했던 방식이 현재에도 그대로 맞는지 따로 검증하지 않으면, 환경 변화에 둔감해질 수 있습니다.",
    strength: "즉흥성보다 축적된 경험과 패턴을 잘 활용합니다.",
    watchOutFor: "익숙한 해법이 바뀐 현실을 따라가지 못할 수 있습니다.",
    reflectionQuestion: "이 방식이 지금도 맞아서 유지하는 걸까, 아니면 오래 써왔기 때문에 놓기 어려운 걸까?",
  },
  {
    key: "lollapalooza",
    biasNameOriginal: "롤라팔루자 효과",
    characterName: "올인 돌파형",
    subtitle: "여러 확신이 겹치면 과감하게 밀어붙이는 사람",
    summary: "여러 근거와 감정이 한 방향으로 겹치면 추진력이 폭발적으로 커집니다.",
    detail:
      "확신, 분위기, 보상, 비교, 사회적 압력 같은 요소가 한꺼번에 맞물리면 행동 에너지가 크게 솟습니다. 이 힘은 강력하지만, 한 방향으로 쏠릴수록 브레이크가 늦어질 수 있습니다.",
    strength: "판단이 맞을 때는 누구보다 빠르게 큰 실행을 만들어냅니다.",
    watchOutFor: "여러 신호가 한쪽으로 겹칠수록 오히려 멈춰서 검토해야 합니다.",
    reflectionQuestion: "나는 지금 여러 근거가 겹쳐서 확신하는 걸까, 아니면 여러 자극이 동시에 나를 밀어붙이는 걸까?",
  },
] as const;

export const BIAS_CATALOGUE: BiasCatalogueEntry[] = rawEntries.map((entry, index) => ({
  biasId: index + 1,
  ...entry,
  tone: toneAt(index),
  imageSlug: IMAGE_SLUGS[entry.key],
}));

export const BIAS_BY_KEY = Object.fromEntries(
  BIAS_CATALOGUE.map((entry) => [entry.key, entry]),
) as Record<string, BiasCatalogueEntry>;

export const BIAS_KEY_ORDER = BIAS_CATALOGUE.map((entry) => entry.key);

export function getBiasEntry(key: string) {
  return BIAS_BY_KEY[key];
}
