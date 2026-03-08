# 뇌피셜 AI 모델 전략

## 목적

`뇌피셜`은 Step 1과 Step 2의 호출 특성이 다르기 때문에, 같은 모델을 무조건 쓰기보다 비용과 품질을 나눠서 관리하는 편이 낫다.

## 기본 원칙

- Step 1은 호출 횟수가 많다.
  - 1세션에 7~12턴이 발생할 수 있다.
  - 따라서 단가가 낮은 모델이 유리하다.
- Step 2는 호출 횟수는 적지만 결과 품질 체감이 크다.
  - 고민 문맥 해석, 렌즈 선택, 질문 생성 품질이 중요하다.
  - 그래서 필요하면 더 좋은 모델을 써도 된다.

## 추천 운영 모드

### 1. Budget

- `GEMINI_MODEL_STEP1=gemini-2.5-flash-lite`
- `GEMINI_MODEL_STEP2=gemini-2.5-flash-lite`

권장 상황:
- 초기 테스트
- 내부 QA
- 사용자 수가 적지 않은데 아직 수익화 전

장점:
- 비용이 가장 안정적이다.

단점:
- Step 2 결과가 더 일반론적으로 느껴질 수 있다.

### 2. Balanced

- `GEMINI_MODEL_STEP1=gemini-2.5-flash-lite`
- `GEMINI_MODEL_STEP2=gemini-2.5-flash`

권장 상황:
- 현재 MVP 운영 기본값
- Step 1은 저비용 유지
- Step 2만 품질을 더 챙기고 싶을 때

장점:
- 비용 상승을 제한하면서도 Step 2 품질을 끌어올릴 수 있다.

단점:
- Step 2 호출 비용은 `flash-lite` 대비 올라간다.

### 3. Quality

- `GEMINI_MODEL_STEP1=gemini-2.5-flash`
- `GEMINI_MODEL_STEP2=gemini-2.5-flash`

권장 상황:
- 사용자 수가 적고 데모 품질이 제일 중요할 때
- 프롬프트 튜닝 집중 기간

장점:
- 전체 응답 품질이 더 안정적일 가능성이 높다.

단점:
- 비용이 가장 빨리 오른다.

## 현재 추천

운영 기본값은 아래가 가장 현실적이다.

```env
GEMINI_MODEL_STEP1=gemini-2.5-flash-lite
GEMINI_MODEL_STEP2=gemini-2.5-flash-lite
```

그리고 Step 2 품질이 부족하다고 느껴질 때만 아래로 올린다.

```env
GEMINI_MODEL_STEP2=gemini-2.5-flash
```

즉:
- 기본은 `flash-lite`
- Step 2 품질 이슈가 확인되면 `Step 2만 flash`

## 비용 판단 기준

아래 중 2개 이상이면 `Step 2`를 `flash`로 올릴 가치가 있다.

- 사용자가 “결과가 너무 뻔하다”는 피드백을 반복한다.
- 고민 문맥을 제대로 못 읽는 사례가 자주 나온다.
- fallback 규칙보다 AI 결과가 확실히 나아야 하는 단계다.
- 아직 트래픽이 크지 않아 비용 압박이 제한적이다.

아래 중 2개 이상이면 다시 `flash-lite`로 내릴 수 있다.

- 하루 호출량이 예상보다 빠르게 증가한다.
- Step 2 품질 차이가 생각보다 크지 않다.
- 규칙 기반 fallback과 프롬프트 튜닝만으로도 충분히 커버된다.

## 실무 팁

- 모델 교체는 코드 수정이 아니라 `.env.local` 값 변경으로만 처리한다.
- Step 1/Step 2를 같은 모델로 묶지 않는다.
- 품질 문제를 모델 변경만으로 해결하려고 하지 말고:
  - 프롬프트 보강
  - few-shot 예시 추가
  - 응답 정규화
  - fallback 개선
  을 함께 본다.
