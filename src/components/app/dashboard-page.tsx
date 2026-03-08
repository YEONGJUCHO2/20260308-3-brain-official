"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, RefreshCw, Sparkles } from "lucide-react";

import { AdSlot } from "@/components/ads/ad-slot";
import { MobileShell } from "@/components/ui/mobile-shell";
import { PageHeader } from "@/components/ui/page-header";
import { RadarChart } from "@/components/ui/radar-chart";
import { apiFetch } from "@/lib/client/api-client";
import { getStoredStep1SessionId, getStoredStep2Input } from "@/lib/client/session-storage";
import type { Step1ResultData } from "@/types/step1";
import type { Step2ResultData } from "@/types/step2";

export function DashboardPage() {
  const [step1Result, setStep1Result] = useState<Step1ResultData | null>(null);
  const [step2Result, setStep2Result] = useState<Step2ResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      const sessionId = getStoredStep1SessionId();
      const step2Input = getStoredStep2Input();
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        const [step1Outcome, step2Outcome] = await Promise.allSettled([
          apiFetch("/api/step1/result", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: sessionId }),
          }).then(async (response) => {
            const json = (await response.json()) as Step1ResultData;
            return response.ok ? json : null;
          }),
          step2Input
            ? apiFetch("/api/step2/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_id: sessionId }),
              }).then(async (response) => {
                const json = (await response.json()) as Step2ResultData;
                return response.ok ? json : null;
              })
            : Promise.resolve(null),
        ]);

        if (step1Outcome.status === "fulfilled" && step1Outcome.value) {
          setStep1Result(step1Outcome.value);
        }

        if (step2Outcome.status === "fulfilled" && step2Outcome.value) {
          setStep2Result(step2Outcome.value);
        }
      } finally {
        setIsLoading(false);
      }
    }

    void bootstrap();
  }, []);

  return (
    <MobileShell>
      <PageHeader title="나의 뇌피셜 기록소" />

      <main className="px-6 pb-16 pt-7">
        <section>
          <h2 className="text-[2.05rem] font-black leading-[1.24] tracking-[-0.05em]">
            반가워요,
            <br />
            <span className="brain-gradient-text">당신의 뇌피셜 기록입니다.</span>
          </h2>
          <p className="mt-3 text-[1rem] leading-7 text-[var(--muted)]">
            최근 생각 패턴과 고민 분석 기록을 한 번에 살펴보세요.
          </p>
        </section>

        {isLoading ? (
          <div className="mt-8 space-y-4">
            <div className="h-32 rounded-[1.8rem] bg-white/70 shadow-[var(--shadow-soft)]" />
            <div className="h-72 rounded-[1.8rem] bg-white/70 shadow-[var(--shadow-soft)]" />
          </div>
        ) : null}

        {!isLoading && step1Result ? (
          <>
            <section className="mt-8">
              <h3 className="text-sm font-black uppercase tracking-[0.22em] text-[var(--muted)]">
                Top 3 나의 생각 캐릭터
              </h3>
              <div className="brain-scroll-x mt-4 flex gap-3 overflow-x-auto pb-2">
                {step1Result.top3.map((character) => (
                  <div key={character.rank} className="brain-card min-w-[168px] p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(239,63,143,0.1)] text-[var(--pink)]">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h4 className="mt-5 break-keep text-[1.24rem] font-black leading-8 tracking-[-0.04em]">
                      {character.character_name}
                    </h4>
                    <span className="mt-3 inline-flex rounded-full bg-[rgba(239,63,143,0.08)] px-3 py-1 text-xs font-black text-[var(--pink)]">
                      {character.rank}위
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="brain-card mt-8 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="brain-section-title text-[2rem]">나의 사고 지도</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">상위 5개 편향 요약</p>
                </div>
                <span className="brain-label">최근 결과 기반</span>
              </div>
              <div className="mx-auto mt-6 aspect-square max-w-[280px] text-[var(--text)]">
                <RadarChart points={step1Result.radar_scores} compact showLabels={false} />
              </div>
            </section>
          </>
        ) : null}

        {!isLoading && !step1Result ? (
          <section className="brain-card mt-8 p-6">
            <h3 className="text-[1.55rem] font-black tracking-[-0.04em]">아직 저장된 결과가 없어요</h3>
            <p className="mt-3 text-[0.98rem] leading-7 text-[var(--muted)]">
              Step 1을 먼저 완료하면 Top 3 캐릭터와 사고 지도를 이곳에서 다시 볼 수 있습니다.
            </p>
          </section>
        ) : null}

        <section className="mt-6 flex gap-3">
          <Link href="/step-2/input" className="brain-primary-button flex-1 py-4 text-base">
            새 고민 분석하기
          </Link>
          <Link href="/step-1/chat?fresh=1" className="brain-secondary-button flex-[0.82] py-4 text-base">
            <RefreshCw className="h-4 w-4" />
            편향 재검사
          </Link>
        </section>

        <section className="mt-9">
          <div className="mb-4 flex items-end justify-between gap-4">
            <h3 className="text-[1.5rem] font-black tracking-[-0.04em]">최근 성찰 기록</h3>
          </div>

          {step2Result ? (
            <div className="space-y-4">
              <article className="brain-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="text-[1.34rem] font-black leading-8 tracking-[-0.04em]">
                    {step2Result.dilemma_text}
                  </h4>
                  <span className="whitespace-nowrap text-xs font-semibold text-[var(--muted)]">
                    최신
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {step2Result.selected_lenses.map((lens) => (
                    <span
                      key={lens.lens}
                      className="rounded-full bg-[rgba(139,92,246,0.08)] px-3 py-1 text-xs font-bold text-[var(--muted)]"
                    >
                      {lens.lens}
                    </span>
                  ))}
                </div>
              </article>
            </div>
          ) : (
            <div className="brain-card p-5">
              <p className="text-[0.98rem] leading-7 text-[var(--muted)]">
                아직 저장된 Step 2 분석이 없습니다. 고민을 입력하면 최근 성찰 기록이 이곳에
                쌓입니다.
              </p>
            </div>
          )}
        </section>

        <AdSlot
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_DASHBOARD}
          label="Sponsored"
          layout="infeed"
        />

        <section className="mt-6 rounded-[1.8rem] border border-[rgba(239,63,143,0.16)] bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(255,241,247,0.74))] p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black tracking-[-0.03em] text-[var(--pink)]">
                다음 고민 이어보기
              </p>
              <p className="mt-2 text-[1rem] leading-7 text-[var(--muted)]">
                지금 떠오르는 고민이 있으면 바로 다시 분석해 보고, 내 생각 패턴이 어떤 식으로
                작동하는지 이어서 확인해 보세요.
              </p>
            </div>
            <Link href="/step-2/input" className="brain-secondary-button px-4 py-3 text-sm">
              시작하기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </MobileShell>
  );
}
