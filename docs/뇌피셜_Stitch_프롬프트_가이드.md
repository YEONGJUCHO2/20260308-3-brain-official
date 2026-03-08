# 뇌피셜 (Brain-fficial) — Google Stitch 프롬프트 가이드

> 기준 문서: `docs/뇌피셜_디자이너_가이드.md`
> 목적: Google Stitch에서 초기 UI/UX 시안을 빠르게 생성하기 위한 프롬프트 세트

---

## 1. 작업 원칙

- 모바일 퍼스트 웹앱으로 생성
- 한국어 UI 기준
- 톤은 친근하고 가벼운 반말
- 심리테스트 같은 가벼움은 유지하되, 싸구려 테스트처럼 보이지 않게 설계
- 결과 화면은 공유 욕구가 생기도록 시각적 임팩트 확보
- 비로그인 결과와 Step 2 결과도 서버 세션 기준으로 복구되는 UX를 전제
- 전체 리포트는 MVP 무료, 추후 유료 전환 가능성을 고려한 CTA 구조 유지
- 다크모드 제외
- 접근성 준수: 색만으로 상태 구분 금지, 터치 영역 충분히 확보
- 필요 시 브랜드 마스코트 사용: **줄무늬 고양이 장인 캐릭터**를 픽셀아트 느낌으로 재해석하여 보조 비주얼로 활용

### 1-1. 마스코트 활용 방향

- 기본 캐릭터 키워드:
  - 줄무늬 고양이
  - 고글
  - 가죽 앞치마
  - 메이커/장인 분위기
- 사용 방식:
  - 실사 복제가 아니라 **픽셀아트 또는 픽셀아트 감성의 단순화 일러스트**
  - 정보 카드의 주인공이 아니라 보조 안내자
  - 로딩, 빈 상태, 랜딩 보조 비주얼, 공유 카드 장식에 우선 사용
- 피해야 할 것:
  - 지나치게 사실적인 털 표현
  - 메인 데이터 영역 위 중첩
  - 결과 카드보다 더 튀는 대형 일러스트

---

## 2. 공통 베이스 프롬프트

아래 프롬프트를 Stitch의 첫 입력으로 사용:

```text
Design a mobile-first Korean web app called "뇌피셜".

All user-facing UI copy must be in Korean.
Use Korean typography and layouts optimized for Korean text length and readability.

Product concept:
- AI-powered self-analysis app based on 25 cognitive biases inspired by Charlie Munger
- Step 1: adaptive chat to identify the user's top 3 cognitive bias characters
- Step 2: analyze a real-life dilemma through 3 to 4 selected lenses such as psychology, economics, probability, biology, engineering, and history

Brand direction:
- playful but intelligent
- emotionally warm, not clinical
- shareable result-card energy, similar to modern personality-test products but more editorial and premium
- avoid generic startup SaaS look

Visual direction:
- mobile-first responsive web
- Korean typography optimized for readability
- soft but distinctive gradients
- card-based layout with clear hierarchy
- expressive illustrations or abstract brain/connection motifs are welcome
- no dark mode

UX constraints:
- users are mostly on mobile
- touch targets must feel large and comfortable
- loading states should feel like part of the experience, not plain spinners
- status must never rely on color alone; use text labels and icons too
- anonymous users can later log in and keep their results, so the UX should feel recoverable and continuous

Please generate a coherent design system and key screens for this product.
```

---

## 2-1. Stitch 첫 입력용 단일 프롬프트

아래 프롬프트는 Stitch에 처음 넣는 "한 방 프롬프트" 용도:

```text
Design a mobile-first Korean web app called "뇌피셜" with a complete, coherent UI system and key product screens.

All user-facing UI copy must be in Korean.
Use Korean typography and layouts optimized for Korean text length and readability.

What the product is:
- an AI-powered self-reflection web app inspired by Charlie Munger's 25 cognitive biases
- Step 1 identifies the user's top 3 bias characters through an adaptive chat flow
- Step 2 helps the user think through a real-life dilemma using 3 to 4 selected lenses such as psychology, economics, probability, biology, engineering, and history
- the product does not give final answers; it helps users ask better questions

Target users:
- Korean users in their late teens to 30s
- mobile-heavy audience
- interested in self-analysis, psychology-test style experiences, and shareable results

Brand and tone:
- playful but intelligent
- warm, conversational, and emotionally engaging
- Korean copy tone should feel friendly and light, usually in casual language
- not clinical, not corporate, not generic startup SaaS
- should feel premium enough to share

Visual direction:
- mobile-first responsive web
- Korean typography with strong readability
- clean but memorable card-based interface
- editorial and modern rather than bland
- soft but distinctive gradients or abstract brain/connection motifs
- no dark mode
- accessible contrast and large touch targets

Important UX rules:
- loading states should feel like part of the product experience, not plain spinners
- status should never rely only on color; always combine icon, text, and color
- anonymous users can continue later and keep results after login, so the UX should feel recoverable and continuous
- Step 1 and Step 2 results should feel worth saving and sharing
- the full report is free in MVP, but the CTA structure should be reusable for a future paid version

Please design these screens in one coherent style:
1. Landing page
2. Step 1 adaptive chat screen
3. Step 1 result page
4. Full report page
5. Step 2 input screen
6. Step 2 result screen
7. Logged-in dashboard
8. Share card variants for Step 1 and Step 2

Screen requirements:

Landing page:
- strong hero section
- headline about the brain deceiving us every day
- primary CTA to start the test
- short explanation of the 2-step product flow
- trust-building note that this is reflection, not diagnosis

Step 1 chat:
- sticky progress area
- AI message bubble and large answer buttons
- occasional short text input
- engaging loading state
- progress should feel reassuring, not medically precise

Step 1 result:
- top 3 ranked character cards
- radar chart area for 25 biases with top 3 to 5 emphasized
- expandable detail sections
- quote block
- full report CTA
- ad placement area
- share actions
- CTA into Step 2

Full report:
- long-form but readable
- should feel premium even though it is free in MVP
- visually structured so it could later become a paid report without redesigning the page

Step 2:
- input screen for writing a real 고민
- result screen with selected lenses, verdict badges, excluded lenses, bias warning, and 2 to 3 critical reflection questions
- should feel like structured thinking support, not an answer engine

Dashboard:
- top 3 summary
- compact radar chart
- recent history list
- primary actions for new analysis and retest

Share cards:
- optimized for 1:1 and 4:5
- strong thumbnail readability
- safe area around edges
- graceful truncation for long Korean text
- avoid exposing raw sensitive personal details

Please make the result screens especially beautiful, memorable, and shareable.
```

---

## 3. 스타일 보정 프롬프트

첫 결과가 너무 평범하면 아래 중 하나를 이어서 입력:

### A. 더 감각적으로
```text
Push the visual identity further. Make it feel more editorial, memorable, and Korean-mobile-native. Use stronger typography contrast, more intentional spacing, and a bolder hero section. Keep it clean, but not generic.
```

### B. 더 가볍고 바이럴하게
```text
Make the experience feel more playful and shareable, like a premium social personality test. Increase the emotional appeal of the result cards and CTA sections, but keep the interface credible and not childish.
```

### C. 더 실용적으로
```text
Reduce decorative elements slightly and improve clarity for production. Keep the same personality, but make component structure, spacing, and content groupings more implementation-friendly.
```

---

## 4. 화면별 프롬프트

### 4-1. 랜딩 페이지

```text
Design the landing page for "뇌피셜", a Korean mobile-first web app.

Required content:
- headline: "당신의 뇌는 매일 당신을 속이고 있습니다"
- subheadline about finding the user's top 3 cognitive biases out of 25
- primary CTA: "내 뇌피셜 알아보기"
- small time estimate: "약 3분 소요"

Design goals:
- immediate curiosity and viral-test energy
- strong first-screen conversion
- visually premium, not academic
- SEO-friendly structure

Add sections that help conversion:
- what the app does in 2 concise steps
- why the result is fun to share
- trust-building microcopy that this is for reflection, not diagnosis
```

### 4-2. Step 1 대화 화면

```text
Design the Step 1 chat experience for "뇌피셜".

Requirements:
- mobile-first chat interface
- sticky top progress bar
- AI assistant message bubble
- 4 answer options displayed as touch-friendly buttons
- occasional short text input mode
- loading state integrated into the experience

UX notes:
- progress should feel reassuring, not medically precise
- use copy like "거의 다 왔어요" or "Top 3를 정리 중이에요"
- one tap should clearly lock the selected option
- users should feel safe from accidental double taps
- error state and retry state should exist
- tone should be light, warm, and conversational in Korean

Avoid:
- generic messenger app styling
- plain spinner-only waiting states
```

### 4-3. Step 1 결과 화면

```text
Design the Step 1 result page for "뇌피셜".

Required sections:
- hero title for the user's Top 3 bias characters
- 3 ranked character cards
- radar chart area for 25 biases, with top 3 to 5 emphasized
- expandable detailed explanations
- one Charlie Munger quote block
- CTA for full report download
- ad placement area between content sections
- share buttons: image download, Kakao share, link copy
- CTA leading into Step 2 dilemma analysis
- small donation/support section at the bottom

Policy notes:
- full report is free in MVP, but the CTA structure should be reusable for a future paid version
- the result should feel recoverable after refresh or return
- design for screenshot/share value

Make the page feel highly shareable, scrollable, and emotionally rewarding.
```

### 4-4. Step 2 입력 + 결과 화면

```text
Design the Step 2 dilemma analysis flow for "뇌피셜".

Flow:
- input screen where the user writes a real 고민
- result screen showing 3 to 4 selected analysis lenses
- expandable section for excluded lenses
- bias warning section showing how the user's top bias may affect judgment
- 2 to 3 critical reflective questions
- ad slot below the key questions
- share buttons

Visual requirements:
- lenses must use icon + text label + verdict badge
- never rely on color alone for verdict status
- verdicts: 찬성, 반대, 조건부
- warning section should feel distinct but not alarming
- reflective questions should feel important and actionable

Product notes:
- this should not feel like the app is giving the final answer
- it should feel like structured reflection
- anonymous users can later log in and keep this result
```

### 4-5. 대시보드

```text
Design the logged-in dashboard for "뇌피셜".

Required sections:
- profile summary with top 3 bias characters
- compact radar chart
- primary actions: "새 고민 분석하기", "편향 재검사"
- recent Step 2 history list, up to 10 items
- ad placement near the lower section

Design goals:
- feel like a personal insight archive
- quick re-entry into the product
- clean and compact on mobile
```

### 4-6. 공유 카드

```text
Design social share cards for "뇌피셜".

Need two variants:
1. Step 1 result card
2. Step 2 dilemma analysis card

Requirements:
- optimized for 1:1 and 4:5 ratios
- strong visual identity even when viewed as a thumbnail
- safe area around edges
- long Korean text should truncate gracefully
- avoid exposing overly personal raw user text

Step 1 card content:
- top 3 character names
- short subtitle
- mini chart or compact visual motif
- one short memorable quote or line

Step 2 card content:
- short dilemma summary
- selected lenses with verdict badges
- one teaser critical question
```

---

## 5. 후속 수정 프롬프트

### 컴포넌트 정리
```text
Refine this into a more production-ready component system. Standardize button styles, card spacing, section headings, form fields, and status components while preserving the same visual direction.
```

### 접근성 강화
```text
Improve accessibility. Increase contrast where needed, ensure status is not color-only, make text sizes safer for Korean mobile readability, and make touch targets clearly at least thumb-friendly.
```

### 광고 영역 정리
```text
Adjust the ad placements so they feel integrated but clearly separated from primary CTAs. Ads should never visually compete with key actions.
```

### 로그인 유도 흐름 정리
```text
Refine the anonymous-to-login transition so it feels like users are continuing their progress, not starting over. Emphasize result continuity and saved history.
```

### 마스코트 삽입 보정
```text
Introduce a brand mascot as a supporting visual element.

The mascot should be:
- a tabby cat maker/artisan
- wearing goggles and a work apron
- reinterpreted in a pixel-art or pixel-art-inspired style
- cute, clever, and memorable

Use it as a supporting visual only, not as the main information block.
Best placements are:
- landing hero support visual
- loading states
- empty states
- small decorative element on share cards

Keep all UI copy in Korean and preserve the same premium soft pink-purple product identity.
```

---

## 5-1. AI 이미지용 마스코트 프롬프트

UI 밖에서 별도 이미지 생성 툴에 넣을 수 있는 공통 프롬프트:

```text
Create a pixel-art inspired mascot illustration for a Korean AI self-reflection product.

Character:
- a tabby cat artisan / maker
- wearing round goggles
- wearing a brown work apron
- smart, curious, warm expression
- slightly nerdy but lovable

Style:
- pixel-art inspired, clean silhouette
- hybrid 16-bit game sprite feeling with modern polish
- transparent or simple soft background
- pink-purple accent lighting that matches a premium Korean mobile product
- cute but not childish
- iconic and readable even at small sizes

Avoid:
- photorealism
- overly detailed fur rendering
- dark fantasy tone
- aggressive or chaotic pose
```

---

## 5-2. 화면별 마스코트 삽입 프롬프트

### 랜딩
```text
Add the pixel-art-inspired tabby cat artisan mascot as a supporting visual on the landing page.
Place it near the hero or near the product explanation cards, but do not let it overpower the headline or CTA.
Keep it small-to-medium, cute, and clearly secondary to the main conversion flow.
```

### Step 1 대화
```text
Add the mascot as a small supporting guide in the Step 1 chat screen.
Use it near the loading microcopy or as a subtle helper element, not as the main avatar and not as the main focal point.
It should make the adaptive analysis feel warmer without making the screen feel childish.
```

### Step 1 결과
```text
Add the mascot only as a very small decorative sticker or emblem on the Step 1 result screen.
Do not replace the Top 3 result visuals, the character cards, or the radar chart.
Keep the mascot near the share area or the Step 2 CTA as a supporting brand element.
```

### Step 2 입력
```text
Add the mascot as a small encouraging helper near the text input area of the Step 2 input screen.
It should reduce pressure and make the writing experience feel friendlier, but it must not distract from the main textarea and CTA.
```

### Step 2 결과
```text
Add the mascot as a subtle decorative element near the bias warning section or near the lower CTA area of the Step 2 result screen.
Do not place it inside the lens cards or over the key question block.
```

### 대시보드
```text
Use the mascot on the dashboard as a friendly return anchor.
It can appear in the greeting area or as the main visual for empty states, but it should still feel secondary to the Top 3 summary and recent history.
```

### 공유 카드
```text
Add the mascot as a tiny sticker-like brand seal on the share card.
Place it near a corner, near the QR area, or near the participation CTA.
Keep it readable at thumbnail size and never let it compete with the main message.
```

---

## 6. Stitch 사용 순서

1. 공통 베이스 프롬프트 입력
2. 랜딩 또는 Step 1 결과 화면부터 생성
3. 마음에 드는 시안이 나오면 같은 스타일로 다른 화면 확장
4. 공유 카드와 상태 화면을 별도 프롬프트로 생성
5. 마지막에 컴포넌트 정리 프롬프트로 일관성 보정

---

## 7. 리뷰 체크리스트

- 첫 화면에서 CTA가 명확한가
- 모바일에서 카드와 버튼이 답답하지 않은가
- 결과 화면이 공유하고 싶게 보이는가
- Step 2가 답변 제공 서비스가 아니라 사고 보조 도구처럼 보이는가
- 광고 영역이 CTA와 충돌하지 않는가
- 긴 한글 텍스트가 깨지지 않는가
- 로딩/에러/빈 상태가 메인 화면과 같은 톤을 유지하는가
- 로그인 유도 문구가 "저장/이어보기" 중심으로 보이는가

---

## 8. Step 1 입력형 채팅 화면 구현 메모

Stitch 결과 품질이 불안정하므로, Step 1의 짧은 입력 화면은 별도 완성 시안보다 **선택형 채팅 화면의 상태 변형**으로 구현하는 것을 권장한다.

### 핵심 원칙

- 새로운 페이지처럼 만들지 않는다
- `Step 1 선택형 채팅 화면`과 같은 헤더, 진행 바, 질문 버블 스타일을 유지한다
- 하단 답변 영역만 `선택지 목록`에서 `짧은 입력 모드`로 전환한다
- 전체 플로우에서 1~2회만 등장하는 보조 상호작용으로 취급한다

### 레이아웃 기준

- 상단 헤더: 선택형 채팅 화면과 동일
- 진행 표시: 고정 총문항처럼 보이는 `7/10`보다 `분석 중`, `%`, `Top 3 정리 중` 같은 유연한 표현 사용
- AI 질문 버블: 선택형 화면과 동일한 말풍선/톤 유지
- 하단 입력 영역:
  - 예시 칩 2~3개 노출
  - 한 줄 또는 최대 2줄 입력창
  - 입력창 우측에 전송 아이콘 버튼 배치
  - 큰 `입력 완료` 단일 버튼은 사용하지 않음

### 입력 영역 권장 구성

- placeholder 예시:
  - `예: 퇴사`
  - `예: 아이패드`
  - `예: 이직`
- 예시 칩은 누르면 입력창에 즉시 반영되거나 바로 제출 가능한 형태
- 입력 길이는 `단어 ~ 짧은 문장` 수준
- 긴 서술형 textarea처럼 보이지 않게 한다

### 인터랙션 기준

- 포커스 시 모바일 키보드가 자연스럽게 올라오도록 처리
- 입력 전송 후:
  - 입력창은 비활성 또는 로딩 상태
  - 선택형 화면과 동일한 로딩 마이크로카피 사용
- 입력값이 비어 있으면 전송 버튼 비활성
- 연타 방지를 위해 전송 직후 중복 입력 차단

### 시각 톤 기준

- 빈 여백이 지나치게 큰 단독 폼 화면처럼 보이지 않게 한다
- 입력 모드도 대화 흐름의 일부처럼 보여야 한다
- 색상, 둥근 모서리, 그림자, 간격은 결과 화면/선택형 채팅 화면과 같은 제품군으로 유지
- 과도한 폼 UI, 메신저 UI, 상담 앱 UI 느낌은 피한다

### 구현 체크포인트

- 기본 모드가 `선택지 4개`라는 사실이 유지되는가
- 입력형은 예외 상태처럼 자연스럽게 섞이는가
- 입력창이 하단 고정일 때도 화면이 답답하지 않은가
- 선택형 채팅 화면과 전환 시 제품이 달라 보이지 않는가
- 한글 placeholder, 칩, 버튼 라벨 줄바꿈이 어색하지 않은가
