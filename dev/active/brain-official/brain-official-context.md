# 뇌피셜 — 핵심 컨텍스트

> Last Updated: 2026-03-09

## 현재 상태: Vercel 프로덕션 배포 전환 완료

### UI 상태 업데이트
- `C:\projects\3-brain-official\stitch\`에 Stitch 최종 산출물 정리 완료
- 개발 착수 기준 분류 문서: `dev/active/brain-official/brain-official-ui-handoff.md`
- 마스코트 활용 기준: `docs/뇌피셜_디자이너_가이드.md` + `docs/뇌피셜_Stitch_프롬프트_가이드.md` 참조
- **바로 구현 가능:** landing, step_1_result, step_2_result, dashboard, step_1_share, step_2_share
- **참고만 하고 직접 구현:** step_1_chat, step_2_input, full_report
- **제외:** generic `share_card`

### 배포 상태
- Vercel 프로덕션 배포 완료: `https://brain-official.vercel.app`
- Firebase Auth Authorized Domains에 `brain-official.vercel.app` 추가 완료
- Firebase는 호스팅이 아니라 **Auth + Firestore + 웹앱 설정** 용도로 유지
- Firebase App Hosting backend는 더 이상 주 배포 경로로 보지 않음

### 현재 운영 메모
- App Hosting에서 겪었던 PEM/IAM/Firestore 권한 이슈를 피하기 위해 Vercel로 전환
- Vercel 프로젝트: `yeongju-chos-projects/brain-official`
- 배포 기준 도메인: `brain-official.vercel.app`
- Firebase App Hosting 관련 문서는 과거 기록으로만 유지하고, 신규 작업은 Vercel 기준으로 판단

## Key Files

| 파일 | 역할 |
|------|------|
| `뇌피셜_앱기획서_v6 (1).md` | 전체 기획서 (최종) — 모든 요구사항의 원천 |
| `C:\Users\JYJ\.claude\plans\twinkly-skipping-neumann.md` | 종합 개발 전략 계획 (승인 완료) |
| `dev/active/brain-official/brain-official-ui-handoff.md` | Stitch 최종 시안 구현 우선순위 + 사용/제외 기준 |
| `src/lib/prompts/step1-chat.ts` | Step 1 적응형 진단 시스템 프롬프트 (기획서 §13-1) |
| `src/lib/prompts/step1-result.ts` | Step 1 결과 생성 프롬프트 (기획서 §13-2) |
| `src/lib/prompts/step1-premium.ts` | Step 1 유료 리포트 프롬프트 (MVP: Flash + 확장) |
| `src/lib/prompts/step2-analyze.ts` | Step 2 고민 분석 프롬프트 (기획서 §13-3) |
| `src/lib/bias/characters.ts` | 25개 편향 캐릭터 데이터 (기획서 §4) |
| `src/lib/bias/scoring.ts` | 편향 점수 계산/확신도 로직 |

## Key Decisions

### 1. AI 모델 선택
- **Step 1:** Gemini 2.5 Flash-Lite — 입력 $0.10, 출력 $0.40 /1M tokens
- **Step 2:** Gemini 2.5 Flash — 입력 $0.30, 출력 $2.50 /1M tokens
- **유료 리포트:** MVP에서는 Flash + 확장 프롬프트 (별도 LLM 투자 X)
- **모델명:** `.env.local` 환경변수로 관리 (`GEMINI_MODEL_STEP1`, `GEMINI_MODEL_STEP2`)
- **사용자당 비용:** ~$0.004 (약 6원)

### 2. DB: Firebase Firestore
- 서버리스, Firebase 유지 (Auth + Firestore)
- Firebase MCP로 통합 관리
- **컬렉션:** `users/{uid}`, `users/{uid}/diagnoses/{id}`, `users/{uid}/analyses/{id}`, `anonymousSessions/{sessionId}` (서버 전용)

### 3. 인증: Firebase Auth (Google 로그인)
- Step 1 + Step 2 맛보기 1회는 비로그인
- 비로그인: localStorage → 로그인 시 Firestore 마이그레이션
- 로그인 유저: Step 2 히스토리 최근 10개 무료 보관

### 4. 진단 상태 소유권은 서버
- AI는 질문+선택지+bias_map만 생성
- 서버가 bias_map 기반 점수 누적/확신도 계산
- **클라이언트는 session_id만 보유**, bias_scores/bias_map 등 원본 상태는 서버 세션에 저장
- API 요청: session_id + selected_option_id만 전송 (클라이언트가 점수를 보내지 않음)
- 비로그인: `anonymousSessions/{sessionId}` Firestore 문서 (Admin SDK만 접근)
- localStorage는 UX 복구용 캐시(session_id + 렌더링 스냅샷)로만 사용
- **익명 사용자 제한은 best-effort:** 강한 quota 보장은 로그인 사용자만 대상

### 5. 수익화
- 일회성 리포트 2,900원 (구독 X) + AdSense + 토스 후원
- 광고 슬롯: 결과 페이지(Top3 아래) + Step2 결과(질문 아래) + 대시보드(하단)
- 필수 페이지: 개인정보처리방침 + 이용약관 (AdSense 심사 요건)

### 6. 유지보수
- `dev/maintenance-checklist.md`로 주기별 체크
- GCP Budget Alert 일일 $50 자동 알림
- Gemini 모델명 .env로 관리 → 코드 수정 없이 교체
- `schemaVersion`을 `anonymousSessions`, `diagnoses`, `analyses`에 우선 적용
- 테스트 우선순위는 `scoring.ts` 단위 테스트 → API contract 테스트 → E2E
- Vercel env와 Firebase Auth Authorized Domains 변경 시 문서 같이 갱신

## Dependencies (External)

| 서비스 | 용도 | 필요 키 |
|--------|------|---------|
| Google AI Studio | Gemini API | `GEMINI_API_KEY` |
| Firebase | Auth + Firestore | `FIREBASE_*` |
| Vercel | Next.js 호스팅 | `VERCEL_*` (managed) |
| Kakao Developers | 공유 API | `KAKAO_JS_KEY` |

## Architecture

```
[Client] ←→ [Next.js API Routes] ←→ [Gemini API]
                    ↕
            [Firebase Firestore]
```

- **서버 컴포넌트:** 랜딩, 결과 페이지 (SEO + 초기 로딩)
- **클라이언트 컴포넌트:** 대화 UI, 대시보드 (인터랙션)
- **API Routes:** AI 호출 + DB CRUD + 점수 계산 (서버사이드)

## Constraints

- Step 1 대화: 최소 7턴 ~ 최대 12턴
- Step 1 종료 조건: Top 3 확신도 전부 0.80+ 또는 12턴 도달
- Step 2 비로그인: 1회 / 로그인: 하루 3회
- 일간 API 상한: 10만 회
- Tier 1 RPD 1,500 = 하루 ~150명 → 빠른 Tier 업그레이드 필요
