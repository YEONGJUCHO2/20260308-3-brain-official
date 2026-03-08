"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Edit3, Send } from "lucide-react";

import { AiThinkingCard } from "@/components/ui/ai-thinking-card";
import { MobileShell } from "@/components/ui/mobile-shell";
import { OptionalArtworkTile } from "@/components/ui/optional-artwork-tile";
import { PageHeader } from "@/components/ui/page-header";
import { apiFetch } from "@/lib/client/api-client";
import {
  clearStoredBrainSession,
  getStoredStep1SessionId,
  setStoredStep1SessionId,
} from "@/lib/client/session-storage";
import type { Step1ChatResponse } from "@/types/step1";

function getProgressLabel(progress: number) {
  if (progress >= 86) return "Top 3를 정리하는 중";
  if (progress >= 56) return "편향 후보를 좁히는 중";
  return "생각 패턴을 탐색하는 중";
}

export function StepOneChat() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFresh = searchParams.get("fresh") === "1";
  const [data, setData] = useState<Step1ChatResponse | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedValue, setTypedValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = data?.question ?? null;
  const history = data?.history ?? [];
  const canAdvance = currentQuestion
    ? currentQuestion.interaction === "choice"
      ? Boolean(selectedOption)
      : typedValue.trim().length > 0
    : false;

  const progressLabel = useMemo(() => getProgressLabel(data?.progress ?? 0), [data?.progress]);

  const bootstrapSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (isFresh) {
        clearStoredBrainSession();
      }

      const existingSessionId = isFresh ? null : getStoredStep1SessionId();
      const response = await apiFetch("/api/step1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(existingSessionId ? { session_id: existingSessionId } : {}),
      });

      const json = (await response.json()) as Step1ChatResponse | { message: string };
      if (!response.ok || !("session_id" in json)) {
        throw new Error("message" in json ? json.message : "Step 1 세션을 시작하지 못했습니다.");
      }

      setStoredStep1SessionId(json.session_id);
      setData(json);

      if (json.status === "ready_for_result") {
        router.push(`/step-1/result?sessionId=${json.session_id}`);
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "Step 1 세션을 시작하지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [isFresh, router]);

  useEffect(() => {
    void bootstrapSession();
  }, [bootstrapSession]);

  async function submitAnswer() {
    if (!data || !currentQuestion || !canAdvance) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload =
        currentQuestion.interaction === "choice"
          ? { session_id: data.session_id, selected_option_id: selectedOption ?? undefined }
          : { session_id: data.session_id, input_text: typedValue.trim() };

      const response = await apiFetch("/api/step1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await response.json()) as Step1ChatResponse | { message: string };
      if (!response.ok || !("session_id" in json)) {
        throw new Error("message" in json ? json.message : "답변을 처리하지 못했습니다.");
      }

      setStoredStep1SessionId(json.session_id);
      setSelectedOption(null);
      setTypedValue("");
      setData(json);

      if (json.status === "ready_for_result") {
        router.push(`/step-1/result?sessionId=${json.session_id}`);
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "답변을 처리하지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <MobileShell>
      <PageHeader backHref="/" eyebrow="step 1 chat" title="Step 1 질문" />

      <div className="border-b border-[var(--line)] px-6 pb-5 pt-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--muted)]">
            {progressLabel}
          </p>
          <p className="text-sm font-bold text-[var(--muted)]">{data?.progress ?? 0}%</p>
        </div>
        <div className="mt-3 h-2 rounded-full bg-[rgba(117,110,137,0.12)]">
          <div
            className="h-2 rounded-full bg-[linear-gradient(135deg,var(--pink),var(--violet))] transition-all duration-300"
            style={{ width: `${data?.progress ?? 0}%` }}
          />
        </div>
      </div>

      <main className="px-5 pb-8 pt-6">
        {isLoading ? (
          <div className="space-y-5">
            <AiThinkingCard
              title="AI가 다음 질문을 준비하고 있어요"
              description="방금까지의 답변을 읽고, 더 잘 드러나는 편향 신호를 좁히는 중입니다."
            />
            <div className="brain-card p-6">
              <div className="h-4 w-24 rounded-full bg-[rgba(117,110,137,0.12)]" />
              <div className="mt-4 h-8 w-full rounded-full bg-[rgba(117,110,137,0.08)]" />
              <div className="mt-3 h-8 w-4/5 rounded-full bg-[rgba(117,110,137,0.08)]" />
            </div>
            <div className="brain-card p-6">
              <div className="h-28 rounded-[1.5rem] bg-[rgba(117,110,137,0.06)]" />
            </div>
          </div>
        ) : null}

        {!isLoading && currentQuestion ? (
          <>
            <section className="rounded-[2rem] bg-[linear-gradient(135deg,#101c4e,#14245c)] px-6 py-6 text-white shadow-[var(--shadow-strong)]">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/70">
                지금 질문
              </p>
              <h2 className="mt-3 break-keep text-[1.85rem] font-black leading-[1.45] tracking-[-0.05em]">
                {currentQuestion.prompt}
              </h2>
            </section>

            <section className="mt-4 flex items-start gap-3">
              <OptionalArtworkTile
                alt="뇌피셜 가이드"
                src="/illustrations/step1-guide.png"
                className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-[1.3rem]"
                imageClassName="object-contain p-2"
                fallback={<div className="text-3xl">안내</div>}
              />
              <div className="brain-card flex-1 rounded-[1.8rem] p-5">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--pink)]">
                  뇌피셜 가이드
                </p>
                <p className="mt-3 break-keep text-[1rem] leading-7 text-[var(--text)]">
                  {currentQuestion.helper}
                </p>
              </div>
            </section>

            {history.length > 0 ? (
              <section className="mt-5 rounded-[1.8rem] border border-[var(--line)] bg-white/80 p-4 shadow-[var(--shadow-soft)]">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--muted)]">
                    지금까지의 흐름
                  </p>
                  <p className="text-xs font-semibold text-[var(--muted)]">
                    스크롤해서 이전 질문과 답변을 다시 볼 수 있어요
                  </p>
                </div>
                <div className="max-h-[250px] space-y-3 overflow-y-auto pr-1">
                  {history.map((turn) => (
                    <div key={turn.turn_number} className="space-y-2">
                      <div className="mr-7 rounded-[1.4rem] rounded-bl-md bg-[rgba(16,28,78,0.06)] px-4 py-3">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">
                          질문 {turn.turn_number}
                        </p>
                        <p className="mt-1 break-keep text-[0.95rem] leading-7 text-[var(--text)]">
                          {turn.question}
                        </p>
                      </div>
                      <div className="ml-9 rounded-[1.4rem] rounded-br-md bg-[linear-gradient(135deg,rgba(255,239,247,0.9),rgba(245,238,255,0.95))] px-4 py-3">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--pink)]">
                          내 답변
                        </p>
                        <p className="mt-1 break-keep text-[0.94rem] font-semibold leading-7 text-[var(--text)]">
                          {turn.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="mt-6 rounded-[2rem] border border-[var(--line)] bg-white/90 p-5 shadow-[var(--shadow-soft)]">
              {isSubmitting ? (
                <div className="mb-5">
                  <AiThinkingCard
                    title="AI가 방금 답변을 읽고 있어요"
                    description="다음 질문을 더 날카롭게 만들기 위해 이전 답변 흐름과 함께 비교하고 있습니다."
                    lines={2}
                  />
                </div>
              ) : null}

              {currentQuestion.interaction === "choice" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {currentQuestion.options?.map((option) => {
                      const active = selectedOption === option.id;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setSelectedOption(option.id)}
                          disabled={isSubmitting}
                          className={`min-h-[132px] rounded-[1.6rem] border px-4 py-4 text-left transition ${
                            active
                              ? "border-[var(--pink)] bg-[linear-gradient(135deg,rgba(255,239,247,0.96),rgba(245,238,255,0.96))] shadow-[var(--shadow-soft)]"
                              : "border-[var(--line)] bg-white"
                          }`}
                        >
                          <div className="flex h-full flex-col justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(139,92,246,0.08)] text-[var(--violet)]">
                              {active ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <Edit3 className="h-4 w-4" />
                              )}
                            </div>
                            <p className="break-keep text-[0.95rem] font-black leading-7 tracking-[-0.03em] text-[var(--text)]">
                              {option.label}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                    기본은 4개 선택지입니다. 직접 입력은 전체 흐름 중 1~2번만 등장합니다.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    {currentQuestion.examples?.map((example) => (
                      <button
                        key={example}
                        type="button"
                        onClick={() => setTypedValue(example)}
                        className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--muted)]"
                      >
                        예: {example}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <input
                      value={typedValue}
                      onChange={(event) => setTypedValue(event.target.value)}
                      placeholder={currentQuestion.placeholder}
                      className="h-14 flex-1 rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.88)] px-5 outline-none placeholder:text-[rgba(117,110,137,0.7)] focus:border-[rgba(239,63,143,0.5)]"
                    />
                    <button
                      type="button"
                      onClick={() => void submitAnswer()}
                      disabled={!canAdvance || isSubmitting}
                      className="brain-primary-button h-14 w-14 rounded-full disabled:opacity-40"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                    길게 쓸 필요 없어요. 한두 단어에서 짧은 문장 정도면 충분합니다.
                  </p>
                </>
              )}

              {error ? <p className="mt-4 text-sm font-semibold text-[var(--pink)]">{error}</p> : null}

              {currentQuestion.interaction === "choice" ? (
                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => void submitAnswer()}
                    disabled={!canAdvance || isSubmitting}
                    className="brain-primary-button shrink-0 px-5 py-3 text-sm disabled:opacity-40"
                  >
                    {isSubmitting ? "처리 중..." : "다음 질문"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : null}
            </section>
          </>
        ) : null}
      </main>
    </MobileShell>
  );
}
