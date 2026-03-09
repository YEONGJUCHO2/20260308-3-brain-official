# 뇌피셜 — 태스크 체크리스트

> Last Updated: 2026-03-09

## UI handoff 반영 (Stitch 기준)

- 기준 문서: `dev/active/brain-official/brain-official-ui-handoff.md`
- 구현 기준 시안:
  - `stitch/landing`
  - `stitch/step_1_result`
  - `stitch/step_2_result`
  - `stitch/dashboard`
  - `stitch/step_1_share`
  - `stitch/step_2_share`
- 참고만 하고 직접 구현:
  - `stitch/step_1_chat`
  - `stitch/step_2_input`
  - `stitch/full_report`
- 제외:
  - `stitch/share_card`

### UI 구현 시작 순서

1. 랜딩
2. Step 1 선택형 채팅
3. Step 1 결과
4. Step 2 입력 화면 재설계
5. Step 2 결과
6. 대시보드
7. Step 1 공유 카드
8. Step 2 공유 카드
9. Step 1 입력형 상태 변형
10. 전체 리포트 재설계

## Phase 0: 프로젝트 초기 설정

- [ ] **0-1** Next.js 15 프로젝트 생성 `[S]` ⚡ **진행 중**
  - ✅ `npx create-next-app@latest` 실행 완료 (App Router, TS, Tailwind 4, ESLint)
  - ⏳ `c:/projects/brain-temp/` → `c:/projects/3-brain-official/`로 파일 이동 필요
  - ⏳ `npm run dev`로 로컬 서버 정상 구동 확인
  - ⏳ `rm -rf c:/projects/brain-temp` 임시 폴더 삭제
- [ ] **0-1a** 앱 소스 이관 후 현재 저장소 구조 재검증 `[S]`
  - `package.json`, `src/`, `app/` 존재 확인
  - 기존 `dev/`, `docs/`, `stitch/` 폴더와 충돌 없는지 확인
- [ ] **0-2** CLAUDE.md 작성 (코딩 컨벤션, 아키텍처 규칙, 프로젝트 개요) `[S]`
- [ ] **0-3** Git 초기화 + .gitignore + Firebase 프로젝트 설정 (MCP) `[S]`
- [ ] **0-4** 환경변수 템플릿(.env.local.example) + 핵심 패키지 설치 `[S]`
  - @google/generative-ai, firebase, chart.js, html2canvas, @react-pdf/renderer
  - Pretendard 한글 폰트 설정 (font-display: swap, line-height 1.6~1.8)
- [ ] **0-5** 테스트/품질 기본 세팅 `[S]`
  - Vitest 또는 Jest 중 1개 선택
  - `npm run test`, `npm run lint`, `npm run typecheck` 스크립트 추가
  - CI 전이라도 로컬에서 반복 가능한 최소 검증 루틴 확보

## Phase 1: AI 프롬프트 엔진 + 캐릭터 콘텐츠

- [ ] **1-0** Step 1/Step 2 타입 + 런타임 검증 스키마 정의 `[M]`
  - `src/types/*.ts`와 API 검증 스키마를 동일 계약으로 유지
  - 요청/응답 구조를 문서가 아니라 코드 기준으로 고정
- [ ] **1-1** Step 1 적응형 진단 시스템 프롬프트 작성 `[L]`
  - 25개 편향 매핑, JSON 출력 형식, 적응형 질문 생성 규칙
  - ⚠️ 기획서 프롬프트와 서버 점수 계산 결정 조율 필요 (AI는 bias_map만 반환)
- [ ] **1-1b** Step 1 대화 API Route (`POST /api/step1/chat`) `[L]`
  - Gemini 2.5 Flash-Lite 호출 (질문+bias_map 생성)
  - 서버에서 bias_map 기반 점수 누적 + 확신도 계산 (AI와 분리)
  - Gemini API 실패 시 재시도 (3회, 지수 백오프) + JSON 파싱 fallback
  - 연타 방지: 중복 요청 차단
- [ ] **1-2** Step 1 결과 생성 프롬프트 + API (`POST /api/step1/result`) `[M]`
  - 최종 점수 → Top 3 캐릭터 상세 설명 생성
- [ ] **1-3** Step 2 고민 분석 프롬프트 + API (`POST /api/step2/analyze`) `[L]`
  - 편향 프로필 주입, 6개 렌즈 중 3~4개 선별, 찬반 + 결정적 질문
  - 입력 검증: 길이 제한(5000자) + HTML 태그 제거 + 프롬프트 인젝션 방어
- [ ] **1-4** 25개 편향 캐릭터 상세 콘텐츠 작성 `[L]` ← **신규**
  - `src/lib/bias/characters.ts`에 데이터 구조화
  - 각 캐릭터: 상세 설명(2~3문단) + 발동 상황(4개) + 대표 인물 + 멍거 명언
- [ ] **1-4b** `src/lib/bias/scoring.ts` 단위 테스트 작성 `[M]`
  - 점수 누적, Top 3 계산, 종료 조건(0.80+/12턴) 검증
  - 프롬프트 조정과 분리된 회귀 안전망 확보
- [ ] **1-5** 프롬프트 시뮬레이션 테스트 (5+ 페르소나) `[M]`
- [ ] **1-5b** 엣지 케이스 방어 (성의 없는 입력, JSON 깨짐, 반복 질문) `[M]`

## Phase 2: 핵심 UI

- [ ] **2-1** 랜딩 페이지 (서버 컴포넌트) `[M]`
  - 헤드라인 + CTA + 모바일 반응형
  - SEO metadata export (타이틀, 설명, OG 태그)
  - Stitch 기준 시안: `stitch/landing`
- [ ] **2-2** Step 1 대화 UI (클라이언트 컴포넌트) `[XL]`
  - 채팅 메시지 컴포넌트, 터치 선택지, 타이핑 입력
  - 마이크로 애니메이션 로딩, 진행 바, 스트리밍
  - beforeunload 경고, localStorage 백업, 네트워크 감지
  - error.tsx + loading.tsx
  - Stitch는 선택형 상태 참고용만 사용 (`stitch/step_1_chat`)
  - **직접 구현 기준:** 기본 4개 선택지, 적응형 진행률, 입력형은 별도 페이지가 아닌 상태 변형
- [ ] **2-3** Step 1 결과 페이지 `[L]`
  - Top 3 카드, 레이더 차트 (dynamic import), 상세 해설
  - **"전체 분석 리포트 받기" CTA** → MVP에서는 무료
  - **광고 슬롯:** Top 3 해설 아래 (배너 320x100)
  - Stitch 기준 시안: `stitch/step_1_result`
- [ ] **2-3b** 전체 리포트 PDF 생성 `[M]` ← **신규**
  - Flash + 확장 프롬프트로 25개 전체 분석 콘텐츠 생성
  - @react-pdf/renderer 또는 서버 HTML→PDF
  - MVP에서는 무료 다운로드
  - `stitch/full_report`는 구조 참고만 사용, 카피/정책/정보 구조는 재설계
- [ ] **2-4** Step 2 분석 UI `[L]`
  - 고민 입력, 렌즈+찬반 시각화, 편향 경고, 결정적 질문
  - **광고 슬롯:** 결정적 질문 아래 (배너 320x100)
  - 입력 화면은 `stitch/step_2_input`을 참고만 하고 직접 재설계
  - 결과 화면 기준 시안: `stitch/step_2_result`
  - **직접 구현 기준:** 렌즈는 사용자가 고르는 것이 아니라 서버/AI가 선별
- [ ] **2-5** 대시보드 `[M]`
  - 편향 프로필 요약, Step 2 히스토리 (최근 10개)
  - **광고 슬롯:** 히스토리 하단 (인피드 네이티브)
  - Stitch 기준 시안: `stitch/dashboard`
  - 확장 기능 카드/탭바는 MVP 범위에서 선택적 반영
- [ ] **2-6** 개인정보처리방침 + 이용약관 페이지 `[S]` ← AdSense 필수

## Phase 3: 인증 + 데이터

- [ ] **3-1** Firebase Auth (Google 로그인 + 세션 관리 + localStorage→Firestore 마이그레이션) `[M]`
- [ ] **3-2** Firebase Firestore 스키마 설계 + CRUD 함수 + Security Rules `[M]`
  - users, diagnoses, analyses 컬렉션
  - Security Rules: uid 기반 읽기/쓰기 격리 + 필드 크기 제한
- [ ] **3-2a** Firestore 문서 `schemaVersion` + 마이그레이션 유틸 설계 `[M]`
  - `anonymousSessions`, `diagnoses`, `analyses` 우선 적용
  - 기존/신규 문서 공존 가능한 읽기 경로 필요
- [ ] **3-3** 사용 횟수 제한 + middleware.ts `[S]`

## Phase 4: 공유 + 바이럴

- [ ] **4-1** 결과 카드 이미지 생성 — dynamic import html2canvas `[M]`
  - Step 1 기준 시안: `stitch/step_1_share`
  - Step 2 기준 시안: `stitch/step_2_share`
  - `stitch/share_card`는 최종 기준에서 제외
- [ ] **4-2** 카카오톡 공유 API 연동 (보조 — 이미지 다운로드가 기본) `[M]`
- [ ] **4-3** 링크 복사 + Open Graph 메타태그 `[S]`

## Phase 5: 테스트 + 배포

- [ ] **5-1** API contract 테스트 `[M]`
  - Step 1/2 요청/응답 구조 회귀 방지
  - 잘못된 입력과 JSON 파싱 실패 fallback 검증
- [ ] **5-2** E2E 플로우 테스트 `[M]`
- [ ] **5-3** 모바일 반응형 최적화 `[M]`
- [x] **5-4** Lighthouse 성능 최적화 (90+) + Vercel 배포 `[S]`
  - 프로덕션 배포 URL: `https://brain-official.vercel.app`
  - Firebase Auth Authorized Domains에 `brain-official.vercel.app` 추가 완료

## Post-MVP (V1.1): 결제 전환

> 사업자 등록 후 진행

- [ ] **V1.1-1** 토스페이먼츠 결제 연동 `[L]`
  - 가맹점 심사, @tosspayments/payment-sdk
  - `POST /api/payment/confirm` API
  - 리포트 무료 → 2,900원 유료 전환
- [ ] **V1.1-2** 결제 후 리포트 잠금 로직 `[S]`
  - Top 3 무료 + 전체 리포트 결제 CTA
  - Firestore 결제 기록 저장

---

**진행 상태:** 운영 문서 정비 완료, 실제 앱 소스 이관 후 Phase 0부터 실행
