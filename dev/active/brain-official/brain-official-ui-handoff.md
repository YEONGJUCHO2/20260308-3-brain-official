# 뇌피셜 — Stitch UI 구현 Handoff

> Last Updated: 2026-03-06
> Source: `C:\projects\3-brain-official\stitch\`

## 목적

Stitch 최종 산출물을 개발 착수 기준으로 분류한다.
이 문서는 다음 3가지를 빠르게 판단하기 위한 기준이다.

- 어떤 화면은 시안 기준으로 바로 구현할지
- 어떤 화면은 참고만 하고 직접 재설계할지
- 어떤 파일은 폐기하거나 부분 참고만 할지

## 결론 요약

### 바로 구현 기준으로 사용

- `stitch/landing`
- `stitch/step_1_result`
- `stitch/step_2_result`
- `stitch/dashboard`
- `stitch/step_1_share`
- `stitch/step_2_share`

### 참고만 하고 직접 구현

- `stitch/step_1_chat`
- `stitch/step_2_input`
- `stitch/full_report`

### 최종 기준에서 제외

- `stitch/share_card`

## 화면별 판정

### 1. Landing

경로:
- `stitch/landing/screen.png`
- `stitch/landing/code.html`

판정:
- 구현 기준 시안으로 사용 가능

유지할 요소:
- 히어로 비주얼의 인지 지도/노드 모티프
- 강한 CTA
- 2단계 제품 소개 구조
- "성찰 도구" 안내 문구

개발 시 보정:
- 예시 캐릭터 이름은 최종 캐릭터 데이터와 일치시킬 것
- 히어로 이미지는 SVG/일러스트 또는 CSS 장식으로 재구성

### 2. Step 1 Chat

경로:
- `stitch/step_1_chat/screen.png`
- `stitch/step_1_chat/code.html`

판정:
- 선택형 채팅 상태 참고용
- 직접 구현 필요

문제:
- 진행률이 `4/10` 고정 문항형으로 표현됨
- 입력형 상태가 실제 화면으로 정리되지 않았고 HTML에서는 `hidden` 상태
- `뇌피셜 가이드` 같은 카피는 제품 톤에 비해 상담 앱 느낌이 남음

개발 기준:
- 기본 모드는 선택지 4개
- 입력형은 별도 페이지가 아니라 상태 변형
- 진행률은 적응형 표현 사용
- 선택형/입력형 둘 다 같은 헤더, 같은 질문 버블, 같은 하단 답변 영역 구조 유지

### 3. Step 1 Result

경로:
- `stitch/step_1_result/screen.png`
- `stitch/step_1_result/code.html`

판정:
- 구현 기준 시안으로 사용 가능

유지할 요소:
- Top 1 카드 중심 구조
- Top 2/3 요약 카드
- 레이더 차트 + 공유 버튼 + Step 2 CTA

개발 시 보정:
- 긴 캐릭터명 줄바꿈 제어
- 차트 라벨 위치 수동 조정
- 공유 버튼 그룹의 상태/간격만 추가 정리

### 4. Step 2 Input

경로:
- `stitch/step_2_input/screen.png`
- `stitch/step_2_input/code.html`

판정:
- 현재 구조는 재설계 필요

문제:
- 사용자가 렌즈를 직접 고르는 UI로 설계됨
- 현재 제품 명세와 충돌

개발 기준:
- 사용자 입력은 고민 텍스트만 받음
- 렌즈는 서버/AI가 결과 화면에서 선별
- 입력 화면은 textarea + 글자 수 + 제출 CTA 정도만 유지
- 렌즈 선택 카드 그리드는 제거

### 5. Step 2 Result

경로:
- `stitch/step_2_result/screen.png`
- `stitch/step_2_result/code.html`

판정:
- 구현 기준 시안으로 사용 가능

유지할 요소:
- 고민 카드
- 생각 경고등
- 선택 렌즈 카드 3개 비교
- 결정적 질문 블록
- 공유 버튼과 CTA 구조

개발 시 보정:
- 제외된 렌즈 아코디언 동작 추가
- 광고 슬롯 위치 반영
- CTA 카피는 성찰 중심 유지

### 6. Dashboard

경로:
- `stitch/dashboard/screen.png`
- `stitch/dashboard/code.html`

판정:
- 구현 기준 시안으로 사용 가능

유지할 요소:
- Top 3 캐릭터 요약
- 나의 사고 지도
- 최근 성찰 기록
- 새 고민 분석하기 / 편향 재검사 버튼

개발 시 보정:
- 하단 탭바는 선택 사항
- `더 깊은 자아탐구` 카드 같은 확장 기능은 MVP 범위에서 제외 가능
- Top 3 카드 overflow 처리는 실제 데이터 기준으로 조정

### 7. Full Report

경로:
- `stitch/full_report/screen.png`
- `stitch/full_report/code.html`

판정:
- 구조 참고만 가능
- 현재 카피/정보 구조는 재설계 필요

문제:
- `프리미엄 리포트` 표현이 들어감
- 원 편향명 직접 사용
- 영어 병기 사용
- 솔루션 제시형 리포트 톤이 강함

개발 기준:
- MVP에서는 무료 리포트
- 원 편향명 대신 리프레이밍 캐릭터/인지 특성 중심 표현 사용
- 영어 병기 제거
- 답을 주는 보고서보다 성찰 보조 리포트 톤 유지

### 8. Share Cards

경로:
- `stitch/step_1_share/screen.png`
- `stitch/step_2_share/screen.png`

판정:
- 둘 다 구현 기준 시안으로 사용 가능

유지할 요소:
- 강한 썸네일 가독성
- 짧은 제목 구조
- CTA 존재

개발 시 보정:
- 실제 도메인 확정 전 placeholder 제거
- 안전영역과 말줄임 규칙 반영

### 9. Generic Share Card

경로:
- `stitch/share_card/screen.png`
- `stitch/share_card/code.html`

판정:
- 최종 기준에서 제외

문제:
- `프리미엄 결과 공유`, `Brain-Official`, `My Cognitive Map`, `noepisyeol.com` 등 정리된 방향과 충돌

## 구현 우선순위

1. `landing`
2. `step_1_chat` 선택형 상태
3. `step_1_result`
4. `step_2_input` 재설계
5. `step_2_result`
6. `dashboard`
7. `step_1_share`
8. `step_2_share`
9. `step_1_chat` 입력형 상태 변형
10. `full_report` 재설계

## 절대 지킬 기준

- Step 1은 최소 7턴, 최대 12턴
- Step 1 기본 상호작용은 선택지 4개
- 짧은 직접 입력은 전체 플로우 중 1~2회
- 고정 총문항형 진행률 `4/10`, `7/10`, `2/3` 금지
- Step 2 렌즈는 사용자가 고르는 것이 아니라 서버/AI가 선별
- 비로그인 제한은 best-effort
- 결과/분석 원본 데이터는 서버 세션 기준
- 전체 리포트는 MVP 무료
- 원 편향명보다 캐릭터명/리프레이밍 표현 우선
- 모든 사용자 노출 카피는 한국어 우선

## Stitch HTML 사용 원칙

- `code.html`은 직접 복붙 소스가 아니라 레이아웃 참고용
- Tailwind CDN, Google Fonts, placeholder domain, 임시 카피는 제거하고 프로젝트 토큰으로 재작성
- 시안 구현 시 실제 기준은 `screen.png + 문서 명세` 조합

## 추천 작업 방식

- 결과 화면은 PNG를 기준으로 먼저 구현
- 채팅/입력 상태는 문서 명세를 기준으로 컴포넌트 설계
- Share는 별도 export용 컴포넌트로 분리
- Full report는 마지막에 정책/카피 재정리 후 착수
