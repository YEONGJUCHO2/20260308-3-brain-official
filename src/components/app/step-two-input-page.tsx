"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Search, Sparkles } from "lucide-react";

import { AiThinkingCard } from "@/components/ui/ai-thinking-card";
import { MobileShell } from "@/components/ui/mobile-shell";
import { PageHeader } from "@/components/ui/page-header";
import { apiFetch } from "@/lib/client/api-client";
import {
  getStoredStep1SessionId,
  getStoredStep2Input,
  setStoredStep1SessionId,
  setStoredStep2Input,
} from "@/lib/client/session-storage";
import type { Step2ResultData } from "@/types/step2";

const prompts = ["새 핸드폰을 사야 할지 고민", "이직을 해야 할지 고민", "친구와 거리를 둘지 고민"];

export function StepTwoInputPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setValue(getStoredStep2Input() || "");
  }, []);

  async function handleSubmit() {
    const sessionId = searchParams.get("sessionId") || getStoredStep1SessionId() || undefined;
    if (!sessionId) {
      setError("Step 2로 넘어가기 전에 Step 1 결과 세션이 필요합니다.");
      return;
    }

    if (value.trim().length === 0) {
      setError("고민 텍스트를 먼저 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await apiFetch("/api/step2/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          dilemma_text: value.trim(),
        }),
      });

      const json = (await response.json()) as Step2ResultData | { message: string };
      if (!response.ok || !("dilemma_text" in json)) {
        throw new Error("message" in json ? json.message : "Step 2 분석을 시작하지 못했습니다.");
      }

      setStoredStep1SessionId(json.session_id);
      setStoredStep2Input(json.dilemma_text);
      router.push(`/step-2/result?sessionId=${json.session_id}`);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Step 2 분석을 시작하지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <MobileShell>
      <PageHeader backHref="/step-1/result" eyebrow="step 2 input" title="고민을 입력해 주세요" />

      <main className="px-6 pb-10 pt-8">
        <section className="brain-card overflow-hidden p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-[76px] w-[76px] items-center justify-center rounded-[1.2rem] border border-white/70 bg-white/88 shadow-[var(--shadow-soft)]">
              <Search className="h-8 w-8 text-[var(--pink)]" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[var(--pink)]">
                before step 2
              </p>
              <h2 className="mt-2 text-[2rem] font-black leading-[1.25] tracking-[-0.05em]">
                실제 고민만 적어 주면 됩니다
              </h2>
              <p className="mt-3 text-[1rem] leading-7 text-[var(--muted)]">
                렌즈는 직접 고르지 않습니다. 입력한 고민을 기준으로 AI가 적절한 관점을
                골라 정리합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 brain-card p-6">
          <label className="text-sm font-black uppercase tracking-[0.22em] text-[var(--muted)]">
            나의 고민
          </label>
          <textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            rows={6}
            className="mt-4 w-full rounded-[1.6rem] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-5 py-4 text-[1.02rem] leading-8 outline-none focus:border-[rgba(239,63,143,0.5)]"
            placeholder="예: 새 핸드폰을 사야 할지, 아니면 조금 더 버텨야 할지 고민이야."
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setValue(prompt)}
                className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--muted)]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[1.8rem] bg-[linear-gradient(135deg,rgba(239,63,143,0.08),rgba(139,92,246,0.08))] p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--text)]">
            <Sparkles className="h-4 w-4 text-[var(--pink)]" />
            분석은 이렇게 진행됩니다
          </div>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-[var(--muted)]">
            <li>1. 고민의 핵심 갈등을 먼저 요약합니다.</li>
            <li>2. 상황에 맞는 3~4개 렌즈를 골라 비교합니다.</li>
            <li>3. 편향 경고와 결정적 질문 3개를 정리해 줍니다.</li>
          </ul>
        </section>

        {error ? <p className="mt-4 text-sm font-semibold text-[var(--pink)]">{error}</p> : null}

        {isSubmitting ? (
          <div className="mt-6">
            <AiThinkingCard
              title="AI가 고민을 다각도로 읽고 있어요"
              description="핵심 갈등을 요약하고, 맞는 렌즈 3~4개를 고른 뒤 편향 경고와 질문을 정리하는 중입니다."
              lines={4}
            />
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={isSubmitting}
          className="brain-primary-button mt-8 flex w-full py-4 text-lg disabled:opacity-50"
        >
          {isSubmitting ? "분석 중..." : "생각 분석 시작하기"}
          <ArrowRight className="h-5 w-5" />
        </button>
      </main>
    </MobileShell>
  );
}
