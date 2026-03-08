type Step2FewShotExample = {
  id: string;
  tags: string[];
  topBiasKeys: string[];
  dilemma: string;
  selectedLenses: string[];
  excludedLenses: string[];
  biasWarningTag: string;
  biasWarningBody: string;
  questionTeaser: string;
};

const EXAMPLES: Step2FewShotExample[] = [
  {
    id: "buy-phone",
    tags: ["핸드폰", "휴대폰", "아이폰", "갤럭시", "기기", "구매"],
    topBiasKeys: ["availability", "representativeness", "status-quo"],
    dilemma: "핸드폰이 아직 돌아가긴 하는데 새 모델이 자꾸 눈에 들어와. 지금 바꿀지 더 버틸지 고민이야.",
    selectedLenses: ["경제학", "심리학", "역사학"],
    excludedLenses: ["생물학/진화", "물리학/공학"],
    biasWarningTag: "트렌드 감지자 성향",
    biasWarningBody: "최근 본 리뷰와 주변 반응이 필요 이상으로 크게 느껴질 수 있다.",
    questionTeaser: "지금 바꾸는 이유가 실제 필요인지, 새로움의 자극인지 구분하고 있는가?",
  },
  {
    id: "career-change",
    tags: ["퇴사", "이직", "회사", "직장", "연봉", "커리어"],
    topBiasKeys: ["sunk-cost", "status-quo", "overconfidence"],
    dilemma: "지금 회사를 계속 다닐지, 연봉이 더 높은 곳으로 이직할지 고민 중이야.",
    selectedLenses: ["경제학", "심리학", "수학/확률"],
    excludedLenses: ["생물학/진화", "물리학/공학"],
    biasWarningTag: "안정 추구형 전략가 성향",
    biasWarningBody: "익숙한 환경의 안전감이 기회비용을 작게 보이게 만들 수 있다.",
    questionTeaser: "지금 남는 선택의 장점이 성장인지, 익숙함인지 분리해서 보고 있는가?",
  },
  {
    id: "relationship-distance",
    tags: ["연애", "관계", "거리두기", "연락", "고백", "친구"],
    topBiasKeys: ["reciprocity", "mere-association", "negativity-bias"],
    dilemma: "상대와 계속 연락을 이어갈지, 조금 거리를 둘지 고민돼.",
    selectedLenses: ["심리학", "역사학", "경제학"],
    excludedLenses: ["물리학/공학", "생물학/진화"],
    biasWarningTag: "의리의 사람 성향",
    biasWarningBody: "지켜야 한다는 마음이 관계의 실제 균형보다 먼저 앞설 수 있다.",
    questionTeaser: "내가 지키고 싶은 건 관계 자체인가, 관계에 대한 내 이미지인가?",
  },
  {
    id: "startup",
    tags: ["창업", "사업", "사이드프로젝트", "서비스", "런칭"],
    topBiasKeys: ["overoptimism", "lollapalooza", "curiosity"],
    dilemma: "지금 아이디어로 바로 창업할지, 더 검증하고 시작할지 고민이야.",
    selectedLenses: ["수학/확률", "경제학", "심리학"],
    excludedLenses: ["역사학", "생물학/진화"],
    biasWarningTag: "타고난 낙관주의자 성향",
    biasWarningBody: "가능성의 크기가 실행 난이도와 손실 위험을 가릴 수 있다.",
    questionTeaser: "지금의 확신은 사용자 근거에서 왔는가, 내 열정에서 왔는가?",
  },
  {
    id: "investment",
    tags: ["주식", "투자", "추가매수", "코인", "손절", "매수"],
    topBiasKeys: ["sunk-cost", "overconfidence", "availability"],
    dilemma: "이미 많이 물린 종목을 더 사야 할지, 정리해야 할지 모르겠어.",
    selectedLenses: ["수학/확률", "경제학", "심리학"],
    excludedLenses: ["역사학", "생물학/진화"],
    biasWarningTag: "끈기의 투자자 성향",
    biasWarningBody: "버텨 온 시간이 판단의 근거처럼 느껴질 수 있다.",
    questionTeaser: "지금 추가 매수는 새 판단인가, 이전 선택을 지키려는 반응인가?",
  },
  {
    id: "study-major",
    tags: ["공부", "전공", "학원", "시험", "편입", "대학원"],
    topBiasKeys: ["authority", "status-quo", "curiosity"],
    dilemma: "지금 전공을 계속 밀고 갈지, 늦기 전에 다른 길로 틀지 고민이야.",
    selectedLenses: ["역사학", "심리학", "경제학"],
    excludedLenses: ["물리학/공학", "생물학/진화"],
    biasWarningTag: "지식의 수집가 성향",
    biasWarningBody: "남들이 인정한 길이라는 이유로 내 기준을 뒤로 미룰 수 있다.",
    questionTeaser: "이 길을 계속 가는 이유가 내 적성인가, 검증된 길이라는 안도감인가?",
  },
  {
    id: "move-house",
    tags: ["이사", "집", "전세", "월세", "동네"],
    topBiasKeys: ["status-quo", "contrast-effect", "availability"],
    dilemma: "지금 집이 익숙하긴 한데 너무 좁아. 이사를 갈지 버틸지 고민이야.",
    selectedLenses: ["경제학", "심리학", "물리학/공학"],
    excludedLenses: ["생물학/진화", "역사학"],
    biasWarningTag: "안정 추구형 전략가 성향",
    biasWarningBody: "익숙함의 가치가 실제 불편 비용보다 크게 느껴질 수 있다.",
    questionTeaser: "지금 참는 비용을 숫자로 적어보면 정말 감당 가능한 수준인가?",
  },
  {
    id: "consumption",
    tags: ["돈", "소비", "지출", "카드값", "과소비", "절약"],
    topBiasKeys: ["present-focus", "availability", "liking-bias"],
    dilemma: "요즘 돈이 너무 부족한데도 소비가 잘 안 줄어. 어디부터 손봐야 할지 고민이야.",
    selectedLenses: ["경제학", "심리학", "역사학"],
    excludedLenses: ["물리학/공학", "생물학/진화"],
    biasWarningTag: "순간 집중형 실행가 성향",
    biasWarningBody: "지금의 만족이 다음 달 부담보다 더 생생하게 느껴질 수 있다.",
    questionTeaser: "지출을 줄이기 어려운 이유가 진짜 필요인지, 순간 보상인지 구분했는가?",
  },
  {
    id: "side-project",
    tags: ["사이드", "프로젝트", "병행", "시간", "체력"],
    topBiasKeys: ["curiosity", "pain-avoiding", "sunk-cost"],
    dilemma: "본업이 바쁜데도 새로운 사이드프로젝트를 시작할지 고민이야.",
    selectedLenses: ["경제학", "심리학", "물리학/공학"],
    excludedLenses: ["생물학/진화", "역사학"],
    biasWarningTag: "끝없는 탐구자 성향",
    biasWarningBody: "새로움의 매력이 현재 자원 한계를 작게 보이게 만들 수 있다.",
    questionTeaser: "이 프로젝트는 지금 내 시간을 갉아먹는가, 진짜 우선순위를 밀어주는가?",
  },
  {
    id: "trip-vs-save",
    tags: ["여행", "저축", "예산", "휴가"],
    topBiasKeys: ["present-focus", "overoptimism", "status-quo"],
    dilemma: "돈이 빠듯한데 여행을 다녀올지, 그냥 저축할지 고민이야.",
    selectedLenses: ["경제학", "심리학", "수학/확률"],
    excludedLenses: ["역사학", "생물학/진화"],
    biasWarningTag: "타고난 낙관주의자 성향",
    biasWarningBody: "나중에 어떻게든 되겠지라는 감각이 현재 예산 압박을 가볍게 만들 수 있다.",
    questionTeaser: "이 여행은 회복을 위한 지출인가, 불안을 잠깐 덮는 지출인가?",
  },
  {
    id: "presentation",
    tags: ["발표", "지원", "면접", "도전", "지원서"],
    topBiasKeys: ["negativity-bias", "overconfidence", "mere-association"],
    dilemma: "잘할 자신은 없지만 이번 발표 기회에 지원해볼지 고민돼.",
    selectedLenses: ["심리학", "수학/확률", "역사학"],
    excludedLenses: ["생물학/진화", "물리학/공학"],
    biasWarningTag: "신중한 기억가 성향",
    biasWarningBody: "과거의 실패 기억이 현재 가능성을 실제보다 더 작게 만들 수 있다.",
    questionTeaser: "지원하지 않았을 때의 손실도 같은 무게로 계산하고 있는가?",
  },
  {
    id: "car-buy",
    tags: ["자동차", "차", "할부", "중고차"],
    topBiasKeys: ["availability", "contrast-effect", "sunk-cost"],
    dilemma: "대중교통으로 버틸 수는 있는데 차를 사는 게 맞을지 고민이야.",
    selectedLenses: ["경제학", "물리학/공학", "심리학"],
    excludedLenses: ["역사학", "생물학/진화"],
    biasWarningTag: "트렌드 감지자 성향",
    biasWarningBody: "주변의 편리함 사례가 실제 총비용보다 먼저 크게 들어올 수 있다.",
    questionTeaser: "차를 사면 편해지는 것과 묶이는 비용을 같은 단위로 비교했는가?",
  },
  {
    id: "friend-business",
    tags: ["동업", "친구", "사업", "같이"],
    topBiasKeys: ["reciprocity", "mere-association", "kant-fairness"],
    dilemma: "친구와 같이 일하자는 제안을 받았는데 같이할지 고민이야.",
    selectedLenses: ["심리학", "경제학", "역사학"],
    excludedLenses: ["생물학/진화", "물리학/공학"],
    biasWarningTag: "의리의 사람 성향",
    biasWarningBody: "관계를 지키려는 마음이 역할과 책임의 불균형을 흐릴 수 있다.",
    questionTeaser: "관계와 계약을 분리해도 같은 선택을 할 것인가?",
  },
  {
    id: "marriage",
    tags: ["결혼", "동거", "가족", "미래"],
    topBiasKeys: ["reciprocity", "status-quo", "contrast-effect"],
    dilemma: "지금 관계에서 결혼 이야기를 꺼내도 될지 고민이야.",
    selectedLenses: ["심리학", "경제학", "역사학"],
    excludedLenses: ["물리학/공학", "생물학/진화"],
    biasWarningTag: "맥락의 해석가 성향",
    biasWarningBody: "주변 비교 기준이 내 관계의 실제 속도를 가릴 수 있다.",
    questionTeaser: "지금의 조급함은 관계의 단계에서 왔는가, 비교에서 왔는가?",
  },
  {
    id: "ipad",
    tags: ["아이패드", "태블릿", "전자기기", "공부", "구매"],
    topBiasKeys: ["liking-bias", "availability", "overoptimism"],
    dilemma: "공부할 때 쓰면 좋을 것 같아서 아이패드를 살지 고민이야.",
    selectedLenses: ["경제학", "심리학", "역사학"],
    excludedLenses: ["생물학/진화", "물리학/공학"],
    biasWarningTag: "열정적 몰입가 성향",
    biasWarningBody: "공부 자체보다 도구가 주는 기대감에 더 끌리고 있을 수 있다.",
    questionTeaser: "이 기기가 없어서 못 하고 있는 공부가 지금 실제로 존재하는가?",
  },
  {
    id: "exercise-pt",
    tags: ["운동", "pt", "헬스", "등록", "건강"],
    topBiasKeys: ["present-focus", "authority", "pain-avoiding"],
    dilemma: "비용이 부담되는데 PT를 등록할지 말지 고민돼.",
    selectedLenses: ["경제학", "심리학", "생물학/진화"],
    excludedLenses: ["역사학", "물리학/공학"],
    biasWarningTag: "평화로운 전략가 성향",
    biasWarningBody: "지금의 불편을 피하려다 장기 습관 설계를 미룰 수 있다.",
    questionTeaser: "PT가 필요한 이유가 진짜 습관 설계인지, 시작 불안을 대신 맡기고 싶은 건지 보았는가?",
  },
  {
    id: "overwork",
    tags: ["번아웃", "야근", "회사", "일", "휴식"],
    topBiasKeys: ["pain-avoiding", "negativity-bias", "overconfidence"],
    dilemma: "요즘 너무 지치는데도 일을 계속 밀어붙일지 쉬어야 할지 고민이야.",
    selectedLenses: ["심리학", "생물학/진화", "경제학"],
    excludedLenses: ["역사학", "물리학/공학"],
    biasWarningTag: "자기확신의 리더 성향",
    biasWarningBody: "버틸 수 있다는 자기 인식이 회복 비용을 작게 만들 수 있다.",
    questionTeaser: "지금 버티는 게 성과를 높이는가, 회복력을 깎아먹는가?",
  },
  {
    id: "parent-conflict",
    tags: ["부모", "가족", "갈등", "대화"],
    topBiasKeys: ["reciprocity", "negativity-bias", "mere-association"],
    dilemma: "부모님과 계속 부딪히는데 내가 먼저 대화를 시도해야 할지 고민이야.",
    selectedLenses: ["심리학", "역사학", "경제학"],
    excludedLenses: ["물리학/공학", "생물학/진화"],
    biasWarningTag: "신중한 기억가 성향",
    biasWarningBody: "과거 상처가 현재 대화의 가능성까지 닫아버릴 수 있다.",
    questionTeaser: "이번 대화의 목표는 해결인가, 억울함을 확인받는 것인가?",
  },
  {
    id: "graduate-school",
    tags: ["대학원", "석사", "박사", "연구", "진학"],
    topBiasKeys: ["authority", "curiosity", "sunk-cost"],
    dilemma: "연구가 재미있긴 한데 대학원에 가는 게 맞을지 고민이야.",
    selectedLenses: ["경제학", "심리학", "역사학"],
    excludedLenses: ["물리학/공학", "생물학/진화"],
    biasWarningTag: "지식의 수집가 성향",
    biasWarningBody: "배움의 가치가 경로 비용과 생활 조건을 가릴 수 있다.",
    questionTeaser: "내가 원하는 건 연구 과정인가, 연구자라는 정체성인가?",
  },
  {
    id: "resign-without-plan",
    tags: ["퇴사", "사표", "불안", "계획", "그만두기"],
    topBiasKeys: ["stress-bias", "pain-avoiding", "overconfidence"],
    dilemma: "지금 회사가 너무 힘든데 다음 계획 없이 퇴사해도 될지 고민이야.",
    selectedLenses: ["심리학", "경제학", "수학/확률"],
    excludedLenses: ["역사학", "물리학/공학"],
    biasWarningTag: "감성 스프린터 성향",
    biasWarningBody: "현재 고통을 빨리 끊고 싶은 마음이 다음 리스크 계산을 밀어낼 수 있다.",
    questionTeaser: "퇴사가 문제 해결의 시작인지, 통증을 끊는 즉각 반응인지 나눠 보았는가?",
  },
];

function tokenize(text: string) {
  return Array.from(
    new Set(
      (text.toLowerCase().match(/[가-힣a-z0-9]{2,}/g) ?? []).filter(
        (token) =>
          ![
            "그냥",
            "지금",
            "정말",
            "너무",
            "요즘",
            "고민",
            "문제",
            "선택",
            "이거",
            "저거",
            "이건",
            "저건",
          ].includes(token),
      ),
    ),
  );
}

export function selectStep2FewShotExamples(params: {
  dilemmaText: string;
  topBiasKeys: string[];
  limit?: number;
}) {
  const keywords = tokenize(params.dilemmaText);
  const selected = EXAMPLES.map((example) => {
    const keywordHits = example.tags.filter((tag) =>
      keywords.some((keyword) => tag.includes(keyword) || keyword.includes(tag)),
    ).length;
    const biasHits = example.topBiasKeys.filter((key) => params.topBiasKeys.includes(key)).length;
    return {
      example,
      score: keywordHits * 3 + biasHits * 2,
    };
  })
    .sort((left, right) => right.score - left.score)
    .slice(0, params.limit ?? 5)
    .map((item) => item.example);

  return selected
    .map(
      (example, index) => `예시 ${index + 1}
- 고민: ${example.dilemma}
- 추천 렌즈: ${example.selectedLenses.join(", ")}
- 제외 렌즈: ${example.excludedLenses.join(", ")}
- 편향 경고 예시: ${example.biasWarningTag} / ${example.biasWarningBody}
- 질문 톤 예시: ${example.questionTeaser}`,
    )
    .join("\n\n");
}
