"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Download,
  Link2,
  MessageCircle,
  Share2,
} from "lucide-react";

import { AdSlot } from "@/components/ads/ad-slot";
import { MobileShell } from "@/components/ui/mobile-shell";
import { PageHeader } from "@/components/ui/page-header";
import { apiFetch } from "@/lib/client/api-client";
import { copyText, downloadNodeAsPng, shareLink } from "@/lib/client/share-utils";
import { getStoredStep1SessionId, setStoredStep1SessionId } from "@/lib/client/session-storage";
import type { Step2ResultData } from "@/types/step2";

const lensToneMap = {
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  violet: "bg-violet-50 text-violet-700 border-violet-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function collectHighlightTerms(tag: string, body: string) {
  const terms = new Set<string>();
  const normalizedTag = tag.replace(/\s*성향$/, "").trim();
  const normalizedBody = body.replace(/\s+/g, " ").trim();
  const stopTerms = new Set([
    "실제 나의 상황",
    "몇 가지",
    "주의 깊게",
    "판단하게",
    "유도할 수",
    "있습니다",
  ]);

  if (normalizedTag.length >= 2) {
    terms.add(normalizedTag);
  }

  for (const match of normalizedBody.matchAll(/["'“”‘’「」『』《》〈〉]([^"'“”‘’「」『』《》〈〉]{2,30})["'“”‘’「」『』《》〈〉]/g)) {
    const term = match[1]?.trim();
    if (term) {
      terms.add(term);
    }
  }

  for (const match of normalizedBody.matchAll(/([가-힣A-Za-z0-9][가-힣A-Za-z0-9\s]{2,24}?)(?=(?:은|는|이|가|을|를|와|과|처럼|으로|로|에서|보다))/g)) {
    const term = match[1]?.trim();
    if (!term || stopTerms.has(term)) {
      continue;
    }

    if (term.length >= 3 && term.length <= 18) {
      terms.add(term);
    }
  }

  return Array.from(terms)
    .filter((term) => normalizedBody.includes(term))
    .sort((left, right) => right.length - left.length)
    .slice(0, 3);
}

function HighlightedParagraph({
  text,
  terms,
  tone = "amber",
}: {
  text: string;
  terms: string[];
  tone?: "amber" | "violet";
}) {
  if (terms.length === 0) {
    return <p className="mt-4 text-[0.98rem] leading-7 text-[#835640]">{text}</p>;
  }

  const matchingTerms = terms.filter((term) => text.includes(term));
  if (matchingTerms.length === 0) {
    return <p className="mt-4 text-[0.98rem] leading-7 text-[#835640]">{text}</p>;
  }

  const pattern = new RegExp(
    `(${matchingTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "g",
  );
  const chunks = text.split(pattern);
  const highlightClass =
    tone === "violet"
      ? "bg-violet-100 text-violet-800 ring-violet-200"
      : "bg-amber-100 text-amber-900 ring-amber-200";

  return (
    <p className="mt-4 text-[0.98rem] leading-7 text-[#835640]">
      {chunks.map((chunk, index) =>
        matchingTerms.includes(chunk) ? (
          <span
            key={`${chunk}-${index}`}
            className={`mx-[1px] inline rounded-md px-1.5 py-0.5 font-black ring-1 ${highlightClass}`}
          >
            {chunk}
          </span>
        ) : (
          <span key={`${chunk}-${index}`}>{chunk}</span>
        ),
      )}
    </p>
  );
}

export function StepTwoResultPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") || getStoredStep1SessionId() || undefined;
  const captureRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<Step2ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const highlightTerms = data
    ? collectHighlightTerms(data.bias_warning.tag, data.bias_warning.body)
    : [];

  const loadResult = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!sessionId) {
        throw new Error("Step 2 결과를 보려면 Step 1 세션이 필요합니다.");
      }

      const response = await apiFetch("/api/step2/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });

      const json = (await response.json()) as Step2ResultData | { message: string };
      if (!response.ok || !("selected_lenses" in json)) {
        throw new Error("message" in json ? json.message : "Step 2 결과를 불러오지 못했습니다.");
      }

      setStoredStep1SessionId(json.session_id);
      setData(json);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Step 2 결과를 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    void loadResult();
  }, [loadResult]);

  async function handlePrimaryShare() {
    const result = await shareLink({
      title: "뇌피셜 다각도 분석 결과",
      text: "내 고민을 여러 렌즈로 분석한 결과를 확인해 보세요.",
      url: window.location.href,
    });
    setActionMessage(result === "copied" ? "공유 링크를 복사했어요." : "공유 창을 열었어요.");
  }

  async function handleImageDownload() {
    if (!captureRef.current) return;
    await downloadNodeAsPng(captureRef.current, "brain-official-step2-result.png");
    setActionMessage("결과 이미지를 저장했어요.");
  }

  async function handleCopyLink() {
    await copyText(window.location.href);
    setActionMessage("결과 링크를 복사했어요.");
  }

  async function handleReflectionCopy() {
    if (!data) return;
    const text = [
      `고민: ${data.dilemma_text}`,
      "",
      "생각 정리 질문",
      ...data.critical_questions.map((question, index) => `${index + 1}. ${question.text}`),
    ].join("\n");
    await copyText(text);
    setActionMessage("생각 정리 질문 3개를 복사했어요.");
  }

  return (
    <MobileShell>
      <PageHeader backHref="/step-2/input" title="Step 2 결과" />

      <main className="px-5 pb-16 pt-6">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-28 rounded-[1.8rem] bg-white/70 shadow-[var(--shadow-soft)]" />
            <div className="h-40 rounded-[1.8rem] bg-white/70 shadow-[var(--shadow-soft)]" />
            <div className="h-48 rounded-[1.8rem] bg-white/70 shadow-[var(--shadow-soft)]" />
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className="brain-card p-6">
            <p className="text-base font-semibold leading-7 text-[var(--muted)]">{error}</p>
          </div>
        ) : null}

        {!isLoading && data ? (
          <div ref={captureRef}>
            <section>
              <p className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-[var(--pink)]">
                <BrainCircuit className="h-4 w-4" />
                나의 고민
              </p>
              <div className="brain-card p-6">
                <p className="text-[1.14rem] leading-8">{data.dilemma_text}</p>
              </div>
            </section>

            <section className="mt-6 rounded-[1.9rem] border border-[rgba(245,158,11,0.22)] bg-[linear-gradient(135deg,rgba(255,243,214,0.9),rgba(255,245,240,0.96))] p-5 shadow-[var(--shadow-soft)]">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[1.1rem] font-black tracking-[-0.03em] text-[#9a5800]">
                  <AlertTriangle className="h-5 w-5" />
                  {data.bias_warning.title}
                </div>
                <span className="mt-3 inline-flex rounded-full bg-white/65 px-3 py-1 text-xs font-black text-[#b46b00]">
                  {data.bias_warning.tag}
                </span>
                <HighlightedParagraph
                  text={data.bias_warning.body}
                  terms={highlightTerms}
                />
              </div>
            </section>

            <section className="mt-7">
              <h2 className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-[var(--muted)]">
                선택된 분석 렌즈
              </h2>
              <div className="space-y-4">
                {data.selected_lenses.map((lens) => (
                  <article key={lens.lens} className="brain-card p-5">
                    <h3 className="text-[1.45rem] font-black tracking-[-0.04em]">{lens.lens}</h3>
                    <span
                      className={`mt-3 inline-flex rounded-full border px-3 py-1 text-sm font-bold ${lensToneMap[lens.tone]}`}
                    >
                      {lens.verdict}
                    </span>
                    <p className="mt-4 text-[1rem] leading-8 text-[var(--muted)]">{lens.summary}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-7 rounded-[1.9rem] bg-[linear-gradient(135deg,#6b1f8c,#a31d67)] p-6 text-white shadow-[var(--shadow-strong)]">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-pink-200">
                결정적 질문 3
              </p>
              <ol className="mt-4 space-y-5">
                {data.critical_questions.map((question, index) => (
                  <li key={question.id} className="flex gap-3">
                    <span className="text-lg font-black text-pink-200">{index + 1}.</span>
                    <p className="text-[1rem] leading-8 text-white/95">{question.text}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-6">
              <details className="brain-card group p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-[var(--muted)]">
                  이번 분석에서 뒤로 밀린 렌즈 ({data.excluded_lenses.length})
                  <span className="transition-transform group-open:rotate-180">⌄</span>
                </summary>
                <div className="mt-3 space-y-2">
                  {data.excluded_lenses.map((lens) => (
                    <div
                      key={lens.lens}
                      className="rounded-[1rem] border border-[var(--line)] bg-white px-3 py-3"
                    >
                      <p className="text-sm font-black text-[var(--text)]">{lens.lens}</p>
                      <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{lens.reason}</p>
                    </div>
                  ))}
                </div>
              </details>
            </section>

            <AdSlot
              slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_STEP2_RESULT}
              label="Sponsored"
              layout="banner"
            />
          </div>
        ) : null}

        {!isLoading && data ? (
          <>
            <section className="mt-8 rounded-[2rem] bg-[linear-gradient(135deg,rgba(239,63,143,0.16),rgba(139,92,246,0.14))] p-6 shadow-[var(--shadow-soft)]">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[var(--pink)]">
                next step
              </p>
              <h3 className="mt-2 text-[1.9rem] font-black tracking-[-0.04em]">
                이 질문들로 생각을 다시 정리해 보세요
              </h3>
              <p className="mt-3 text-[0.98rem] leading-7 text-[var(--muted)]">{data.closing}</p>
              <button
                type="button"
                onClick={() => void handleReflectionCopy()}
                className="brain-primary-button mt-5 flex w-full py-4 text-lg"
              >
                생각 정리하기
                <ArrowRight className="h-5 w-5" />
              </button>
              {actionMessage ? (
                <div className="mt-4 flex items-center gap-2 rounded-[1rem] bg-white/75 px-4 py-3 text-sm font-semibold text-[var(--text)] shadow-[var(--shadow-soft)]">
                  <CheckCircle2 className="h-4 w-4 text-[var(--pink)]" />
                  {actionMessage}
                </div>
              ) : null}
            </section>

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
      </main>
    </MobileShell>
  );
}
