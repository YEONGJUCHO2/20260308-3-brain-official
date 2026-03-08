"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Download,
  FileText,
  Link2,
  MessageCircle,
  Share2,
  Sparkles,
  X,
} from "lucide-react";

import { AdSlot } from "@/components/ads/ad-slot";
import { MobileShell } from "@/components/ui/mobile-shell";
import { OptionalArtworkTile } from "@/components/ui/optional-artwork-tile";
import { PageHeader } from "@/components/ui/page-header";
import { RadarChart } from "@/components/ui/radar-chart";
import { apiFetch } from "@/lib/client/api-client";
import { copyText, downloadNodeAsPng, shareLink } from "@/lib/client/share-utils";
import {
  getStoredStep1SessionId,
  setStoredStep1SessionId,
} from "@/lib/client/session-storage";
import type { Step1ResultData, Step1TopCharacter } from "@/types/step1";

const toneMap = {
  pink: "from-pink-100 via-white to-violet-50",
  violet: "from-violet-100 via-white to-pink-50",
  indigo: "from-indigo-100 via-white to-violet-50",
};

function CharacterArtwork({
  character,
  imageClassName = "object-contain p-4",
}: {
  character: Step1TopCharacter;
  imageClassName?: string;
}) {
  return (
    <OptionalArtworkTile
      src={character.image_src}
      alt={character.character_name}
      className={`aspect-square rounded-[2rem] bg-gradient-to-br ${toneMap[character.tone]} shadow-inner`}
      imageClassName={imageClassName}
      fallback={
        <div className="flex h-full w-full items-center justify-center text-[var(--violet)]">
          <Sparkles className="h-8 w-8" />
        </div>
      }
    />
  );
}

function CharacterDetailModal({
  character,
  onClose,
}: {
  character: Step1TopCharacter;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-30 flex items-end bg-[rgba(17,17,30,0.45)] p-4 backdrop-blur-sm sm:items-center sm:justify-center">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-[var(--shadow-strong)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--pink)]">
              상세 해설
            </p>
            <h3 className="mt-2 break-keep text-[1.8rem] font-black tracking-[-0.05em] text-[var(--text)]">
              {character.character_name}
            </h3>
            <span className="mt-3 inline-flex rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.88)] px-3 py-1 text-xs font-bold text-[var(--muted)]">
              {character.bias_name_original} · {character.subtitle}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--text)]"
            aria-label="상세 팝업 닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 flex justify-center">
          <div className="h-56 w-56">
            <CharacterArtwork character={character} imageClassName="object-contain p-2" />
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="rounded-[1.3rem] border border-[var(--line)] bg-[rgba(255,255,255,0.86)] p-4">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--pink)]">
              한 줄 요약
            </p>
            <p className="mt-2 break-keep text-[0.98rem] leading-7 text-[var(--muted)]">
              {character.summary}
            </p>
          </div>

          <div className="rounded-[1.3rem] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(239,63,143,0.06),rgba(139,92,246,0.08))] p-4">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--pink)]">
              이 성향이 강할 때
            </p>
            <p className="mt-2 break-keep text-[0.98rem] leading-7 text-[var(--muted)]">
              {character.detail}
            </p>
          </div>

          <div className="rounded-[1.3rem] border border-[var(--line)] bg-white/90 p-4">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--pink)]">
              강점
            </p>
            <p className="mt-2 break-keep text-[0.98rem] leading-7 text-[var(--muted)]">
              {character.strength}
            </p>
          </div>

          <div className="rounded-[1.3rem] border border-[rgba(239,63,143,0.16)] bg-[rgba(255,242,247,0.9)] p-4">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--pink)]">
              주의할 점
            </p>
            <p className="mt-2 break-keep text-[0.98rem] leading-7 text-[var(--muted)]">
              {character.watch_out_for}
            </p>
          </div>

          <div className="rounded-[1.3rem] border border-[var(--line)] bg-[rgba(245,238,255,0.9)] p-4">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--pink)]">
              스스로에게 던질 질문
            </p>
            <p className="mt-2 break-keep text-[0.98rem] leading-7 text-[var(--muted)]">
              {character.reflection_question}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StepOneResultPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") || getStoredStep1SessionId() || undefined;
  const captureRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<Step1ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<Step1TopCharacter | null>(null);

  const loadResult = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!sessionId) {
        throw new Error("Step 1 결과를 보려면 먼저 진단을 진행해야 합니다.");
      }

      const response = await apiFetch("/api/step1/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });

      const json = (await response.json()) as Step1ResultData | { message: string };
      if (!response.ok || !("top3" in json)) {
        throw new Error("message" in json ? json.message : "결과를 불러오지 못했습니다.");
      }

      setStoredStep1SessionId(json.session_id);
      setData(json);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "결과를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    void loadResult();
  }, [loadResult]);

  const first = data?.top3[0];
  const rest = data?.top3.slice(1) ?? [];

  async function handlePrimaryShare() {
    await shareLink({
      title: "뇌피셜 결과",
      text: data?.share_line ?? "내 사고 패턴 결과를 확인해 보세요.",
      url: window.location.href,
    });
  }

  async function handleImageDownload() {
    if (!captureRef.current) return;
    await downloadNodeAsPng(captureRef.current, "brain-official-step1-result.png");
  }

  async function handleCopyLink() {
    await copyText(window.location.href);
  }

  return (
    <MobileShell>
      <PageHeader backHref="/step-1/chat" eyebrow="step 1 result" title="Step 1 결과" />

      <main className="px-6 pb-16 pt-8">
        <div ref={captureRef}>
          <div className="text-center">
            <h2 className="brain-section-title text-[2.8rem]">당신의 뇌피셜 캐릭터 Top 3</h2>
            <p className="mx-auto mt-4 max-w-[300px] text-base leading-8 text-[var(--muted)]">
              25개 편향 신호를 바탕으로 지금 가장 자주 드러나는 사고 패턴 세 개를 정리했습니다.
            </p>
          </div>

          {isLoading ? (
            <div className="mt-8 space-y-4">
              <div className="h-[540px] rounded-[2.4rem] bg-white/70 shadow-[var(--shadow-soft)]" />
              <div className="h-32 rounded-[2rem] bg-white/70 shadow-[var(--shadow-soft)]" />
              <div className="h-32 rounded-[2rem] bg-white/70 shadow-[var(--shadow-soft)]" />
            </div>
          ) : null}

          {!isLoading && error ? (
            <div className="brain-card mt-8 p-6">
              <p className="text-base font-semibold leading-7 text-[var(--muted)]">{error}</p>
              <Link
                href="/step-1/chat?fresh=1"
                className="brain-primary-button mt-5 inline-flex px-5 py-3 text-sm"
              >
                Step 1 다시 시작하기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : null}

          {!isLoading && data && first ? (
            <>
              <section className="mt-8 rounded-[2.4rem] bg-[linear-gradient(135deg,var(--pink),var(--violet))] p-[2px] shadow-[var(--shadow-strong)]">
                <div className="relative overflow-hidden rounded-[2.3rem] bg-[linear-gradient(180deg,#fffdfd_0%,#faf3f9_100%)] p-7">
                  <div className="absolute -right-16 top-0 h-52 w-52 rounded-full bg-[rgba(239,63,143,0.16)] blur-3xl" />
                  <div className="absolute -left-16 bottom-0 h-52 w-52 rounded-full bg-[rgba(139,92,246,0.16)] blur-3xl" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[0.72rem] font-black uppercase tracking-[0.26em] text-[var(--pink)]">
                        rank
                      </p>
                      <p className="mt-1 text-5xl font-black tracking-[-0.06em]">01</p>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/78 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--muted)] shadow-[var(--shadow-soft)]">
                      <Sparkles className="h-4 w-4 text-[var(--pink)]" />
                      Top 1
                    </span>
                  </div>

                  <div className="relative mt-7">
                    <CharacterArtwork character={first} />
                  </div>

                  <div className="relative mt-7 text-center">
                    <span className="brain-label">
                      {first.bias_name_original} · {first.subtitle}
                    </span>
                    <h3 className="mt-5 break-keep font-[var(--font-serif)] text-[2.25rem] font-black tracking-[-0.05em]">
                      {first.character_name}
                    </h3>
                    <p className="mt-4 text-[1.02rem] leading-8 text-[var(--muted)]">
                      {first.summary}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedCharacter(first)}
                      className="mt-5 inline-flex rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-bold text-[var(--muted)] shadow-[var(--shadow-soft)]"
                    >
                      클릭하여 상세보기
                    </button>
                  </div>
                </div>
              </section>

              <section className="mt-5 space-y-4">
                {rest.map((character) => (
                  <button
                    key={character.rank}
                    type="button"
                    onClick={() => setSelectedCharacter(character)}
                    className="brain-card w-full overflow-hidden px-5 py-5 text-left"
                  >
                    <div className="flex gap-4">
                      <div className="h-[104px] w-[104px] shrink-0">
                        <CharacterArtwork character={character} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <p className="text-[0.72rem] font-black uppercase tracking-[0.22em] text-[var(--muted)]">
                            rank 0{character.rank}
                          </p>
                          <span className="inline-flex max-w-full rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs font-bold text-[var(--muted)]">
                            {character.subtitle}
                          </span>
                        </div>
                        <h3 className="mt-2 break-keep text-[1.35rem] font-black tracking-[-0.04em]">
                          {character.character_name}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{character.summary}</p>
                        <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--pink)]">
                          클릭하여 상세보기
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </section>

              <div className="py-8 text-center">
                <div className="mx-auto h-16 w-1 rounded-full bg-[rgba(117,110,137,0.15)]" />
              </div>

              <section className="brain-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="brain-section-title text-[2.1rem]">나의 사고 지도</h3>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                      top 5 bias radar
                    </p>
                  </div>
                  <span className="brain-label">상위 5개 편향 요약</span>
                </div>

                <div className="mt-5 rounded-[1.8rem] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(239,63,143,0.05),rgba(139,92,246,0.08))] p-5">
                  <div className="rounded-[1.5rem] bg-white/80 p-5 shadow-[var(--shadow-soft)]">
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--pink)]">
                      읽는 법
                    </p>
                    <p className="mt-3 text-[1.06rem] leading-8 text-[var(--muted)]">
                      꼭짓점 라벨에는 편향 캐릭터 이름과 점수를 함께 표시했습니다. 5점 아래는 약하게 드러난 편, 7점 안팎은 반복적으로 드러나는 편으로 보면 됩니다.
                    </p>
                  </div>

                  <div className="mx-auto mt-6 aspect-square max-w-[360px]">
                    <RadarChart points={data.radar_scores} showLabels />
                  </div>

                  <div className="mt-6 grid gap-3">
                    {data.radar_scores.map((point, index) => (
                      <div
                        key={point.bias_key}
                        className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-[rgba(224,216,235,0.95)] bg-white/92 px-4 py-3 shadow-[var(--shadow-soft)]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(239,63,143,0.1)] text-sm font-black text-[var(--pink)]">
                            {index + 1}
                          </span>
                          <p className="break-keep text-[0.98rem] font-black leading-6 text-[var(--text)]">
                            {point.label}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-black text-[var(--pink)]">
                          {point.display_score.toFixed(1)}/10
                        </p>
                      </div>
                    ))}
                  </div>

                </div>

                <div className="mt-5 rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.88)] p-4">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--pink)]">
                    전체 흐름
                  </p>
                  <p className="mt-3 text-[0.98rem] leading-7 text-[var(--muted)]">
                    {data.overall_insight}
                  </p>
                </div>
              </section>
            </>
          ) : null}
        </div>

        {!isLoading && data ? (
          <>
            <section className="mt-8 rounded-[2rem] bg-[linear-gradient(135deg,rgba(239,63,143,0.16),rgba(139,92,246,0.14))] p-6 shadow-[var(--shadow-soft)]">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[var(--pink)]">
                next step
              </p>
              <h3 className="mt-2 text-[1.95rem] font-black tracking-[-0.04em]">
                이 편향들이 실제 고민에서 어떻게 작동하는지 확인해 볼까요?
              </h3>
              <p className="mt-3 text-[0.98rem] leading-7 text-[var(--muted)]">
                지금 떠오르는 고민 하나만 적으면, 뇌피셜이 여러 관점으로 나눠서 생각의 틈을 보여줍니다.
              </p>
              <Link
                href={`/step-2/input?sessionId=${data.session_id}`}
                className="brain-primary-button mt-5 flex w-full py-4 text-lg"
              >
                내 고민 분석해보기
                <ArrowRight className="h-5 w-5" />
              </Link>
            </section>

            <section className="mt-6 rounded-[1.8rem] border border-[var(--line)] bg-white/86 p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--pink)]">
                    full report
                  </p>
                  <h3 className="mt-2 text-[1.55rem] font-black tracking-[-0.04em] text-[var(--text)]">
                    25가지 편향 전체 리포트 보기
                  </h3>
                  <p className="mt-3 text-[0.98rem] leading-7 text-[var(--muted)]">
                    Top 3만 보는 화면에서 끝내지 않고, 25개 전체 편향을 강도순으로 훑어보며 어떤
                    축이 약하고 강한지 한 번에 정리할 수 있습니다.
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[rgba(139,92,246,0.1)] text-[var(--violet)]">
                  <FileText className="h-5 w-5" />
                </div>
              </div>

              <Link
                href={`/step-1/report?sessionId=${data.session_id}`}
                className="brain-secondary-button mt-5 flex w-full py-4 text-base"
              >
                전체 리포트 열기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>

            <AdSlot
              slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_STEP1_RESULT}
              label="Sponsored"
              layout="banner"
            />

            <section className="mt-6 rounded-[1.8rem] border border-[var(--line)] bg-white/80 p-5 shadow-[var(--shadow-soft)]">
              <button
                type="button"
                onClick={() => void handlePrimaryShare()}
                className="brain-primary-button flex w-full py-4 text-lg"
              >
                <Share2 className="h-5 w-5" />
                결과 공유하기
              </button>

              <div className="mt-4 flex items-center justify-center gap-6">
                <button
                  type="button"
                  onClick={() => void handleImageDownload()}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--text)]">
                    <Download className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-[var(--muted)]">이미지 저장</span>
                </button>
                <button
                  type="button"
                  onClick={() => void handlePrimaryShare()}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#FEE500] bg-[#FEE500] text-[#231815]">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-[var(--muted)]">카카오톡</span>
                </button>
                <button
                  type="button"
                  onClick={() => void handleCopyLink()}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--text)]">
                    <Link2 className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-[var(--muted)]">링크 복사</span>
                </button>
              </div>
            </section>
          </>
        ) : null}

        {selectedCharacter ? (
          <CharacterDetailModal
            character={selectedCharacter}
            onClose={() => setSelectedCharacter(null)}
          />
        ) : null}
      </main>
    </MobileShell>
  );
}
