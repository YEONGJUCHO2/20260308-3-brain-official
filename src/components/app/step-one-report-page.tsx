"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

import { MobileShell } from "@/components/ui/mobile-shell";
import { OptionalArtworkTile } from "@/components/ui/optional-artwork-tile";
import { PageHeader } from "@/components/ui/page-header";
import { apiFetch } from "@/lib/client/api-client";
import { getStoredStep1SessionId, setStoredStep1SessionId } from "@/lib/client/session-storage";
import type { Step1BiasBreakdownItem, Step1ResultData } from "@/types/step1";

const toneMap = {
  pink: "from-pink-100 via-white to-violet-50",
  violet: "from-violet-100 via-white to-pink-50",
  indigo: "from-indigo-100 via-white to-violet-50",
};

function BreakdownArtwork({ item }: { item: Step1BiasBreakdownItem }) {
  return (
    <OptionalArtworkTile
      src={item.image_src}
      alt={item.character_name}
      className={`aspect-square rounded-[1.6rem] bg-gradient-to-br ${toneMap[item.tone]} shadow-inner`}
      imageClassName="object-contain p-3"
      fallback={
        <div className="flex h-full w-full items-center justify-center text-[var(--violet)]">
          <Sparkles className="h-6 w-6" />
        </div>
      }
    />
  );
}

function BreakdownCard({
  item,
  rank,
}: {
  item: Step1BiasBreakdownItem;
  rank: number;
}) {
  return (
    <article className="brain-card p-5">
      <div className="flex gap-4">
        <div className="h-[104px] w-[104px] shrink-0">
          <BreakdownArtwork item={item} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[0.72rem] font-black uppercase tracking-[0.22em] text-[var(--muted)]">
                #{rank}
              </p>
              <h3 className="mt-2 break-keep text-[1.28rem] font-black tracking-[-0.04em] text-[var(--text)]">
                {item.character_name}
              </h3>
              <p className="mt-2 break-keep text-xs font-bold text-[var(--muted)]">
                {item.bias_name_original} · {item.subtitle}
              </p>
            </div>
            <div className="rounded-full bg-[rgba(239,63,143,0.1)] px-3 py-2 text-right">
              <p className="text-[0.7rem] font-black uppercase tracking-[0.16em] text-[var(--muted)]">
                score
              </p>
              <p className="mt-1 text-sm font-black text-[var(--pink)]">{item.display_score.toFixed(1)}/10</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="rounded-[1.2rem] border border-[var(--line)] bg-white/88 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--pink)]">한 줄 요약</p>
          <p className="mt-2 break-keep text-[0.96rem] leading-7 text-[var(--muted)]">{item.summary}</p>
        </div>
        <div className="rounded-[1.2rem] border border-[var(--line)] bg-[rgba(245,238,255,0.92)] p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--pink)]">더 깊게 보면</p>
          <p className="mt-2 break-keep text-[0.96rem] leading-7 text-[var(--muted)]">{item.detail}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.2rem] border border-[var(--line)] bg-white/88 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--pink)]">강점</p>
            <p className="mt-2 break-keep text-[0.94rem] leading-7 text-[var(--muted)]">{item.strength}</p>
          </div>
          <div className="rounded-[1.2rem] border border-[rgba(239,63,143,0.16)] bg-[rgba(255,242,247,0.92)] p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--pink)]">주의할 점</p>
            <p className="mt-2 break-keep text-[0.94rem] leading-7 text-[var(--muted)]">{item.watch_out_for}</p>
          </div>
        </div>
        <div className="rounded-[1.2rem] border border-[var(--line)] bg-[rgba(241,244,255,0.96)] p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--pink)]">
            스스로에게 던질 질문
          </p>
          <p className="mt-2 break-keep text-[0.96rem] leading-7 text-[var(--muted)]">
            {item.reflection_question}
          </p>
        </div>
      </div>
    </article>
  );
}

export function StepOneReportPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") || getStoredStep1SessionId() || undefined;
  const [data, setData] = useState<Step1ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!sessionId) {
        throw new Error("전체 리포트를 열기 전에 Step 1 결과가 먼저 필요합니다.");
      }

      const response = await apiFetch("/api/step1/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });

      const json = (await response.json()) as Step1ResultData | { message: string };
      if (!response.ok || !("bias_breakdown" in json)) {
        throw new Error("message" in json ? json.message : "리포트를 불러오지 못했습니다.");
      }

      setStoredStep1SessionId(json.session_id);
      setData(json);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "리포트를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  return (
    <MobileShell>
      <PageHeader backHref="/step-1/result" eyebrow="step 1 full report" title="전체 리포트" />

      <main className="px-6 pb-16 pt-8">
        <section>
          <h2 className="brain-section-title text-[2.5rem]">25가지 편향 전체 리포트</h2>
          <p className="mt-4 text-[1rem] leading-8 text-[var(--muted)]">
            Top 3만 보는 화면을 넘어서, 전체 편향 스펙트럼을 강도순으로 정리한 페이지입니다.
            자주 튀어나오는 편향부터 약하게 드러나는 편향까지 한 번에 훑어볼 수 있습니다.
          </p>
        </section>

        {isLoading ? (
          <div className="mt-8 space-y-4">
            <div className="h-40 rounded-[2rem] bg-white/70 shadow-[var(--shadow-soft)]" />
            <div className="h-56 rounded-[2rem] bg-white/70 shadow-[var(--shadow-soft)]" />
            <div className="h-56 rounded-[2rem] bg-white/70 shadow-[var(--shadow-soft)]" />
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className="brain-card mt-8 p-6">
            <p className="text-base font-semibold leading-7 text-[var(--muted)]">{error}</p>
            <Link href="/step-1/result" className="brain-primary-button mt-5 inline-flex px-5 py-3 text-sm">
              Step 1 결과로 돌아가기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : null}

        {!isLoading && data ? (
          <>
            <section className="mt-8 rounded-[2rem] border border-[var(--line)] bg-white/88 p-6 shadow-[var(--shadow-soft)]">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--pink)]">Top 3 요약</p>
              <div className="mt-4 grid gap-3">
                {data.top3.map((character) => (
                  <div
                    key={character.rank}
                    className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,255,255,0.88)] px-4 py-3"
                  >
                    <div>
                      <p className="text-[0.72rem] font-black uppercase tracking-[0.22em] text-[var(--muted)]">
                        rank 0{character.rank}
                      </p>
                      <p className="mt-1 break-keep text-[1.04rem] font-black text-[var(--text)]">
                        {character.character_name}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-black text-[var(--pink)]">
                      {character.score.toFixed(1)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-8 space-y-4">
              {data.bias_breakdown.map((item, index) => (
                <BreakdownCard key={item.bias_key} item={item} rank={index + 1} />
              ))}
            </section>
          </>
        ) : null}
      </main>
    </MobileShell>
  );
}
