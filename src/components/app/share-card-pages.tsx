"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { MobileShell } from "@/components/ui/mobile-shell";
import { apiFetch } from "@/lib/client/api-client";
import { getStoredStep1SessionId } from "@/lib/client/session-storage";
import type { Step1ResultData } from "@/types/step1";
import type { Step2ResultData } from "@/types/step2";

export function StepOneShareCardPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") || getStoredStep1SessionId();
  const [data, setData] = useState<Step1ResultData | null>(null);

  useEffect(() => {
    async function bootstrap() {
      if (!sessionId) return;

      const response = await apiFetch("/api/step1/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });
      if (response.ok) {
        setData((await response.json()) as Step1ResultData);
      }
    }

    void bootstrap();
  }, [sessionId]);

  const top3 = data?.top3 ?? [];
  const first = top3[0];

  return (
    <MobileShell className="flex items-center justify-center bg-[#f4f4f6] px-6 py-10">
      <div className="w-full rounded-[2rem] border border-[rgba(239,63,143,0.16)] bg-white shadow-[var(--shadow-strong)]">
        <div className="rounded-t-[2rem] bg-[linear-gradient(135deg,#700d3c,#ff4087)] px-6 py-10 text-white">
          <p className="text-3xl font-black tracking-[-0.05em]">뇌피셜</p>
          <p className="mt-8 text-sm font-black uppercase tracking-[0.22em] text-pink-200">
            나의 Top 3 캐릭터
          </p>
          <h1 className="mt-4 font-[var(--font-serif)] text-[3.2rem] font-black leading-[1.06] tracking-[-0.05em]">
            {first?.character_name ?? "뇌피셜"}
          </h1>
          <p className="mt-6 text-[1.02rem] leading-8 text-white/90">
            {first?.subtitle ?? "지금 내 생각 패턴을 가장 잘 설명하는 캐릭터"}
          </p>
        </div>

        <div className="px-6 py-6">
          <div className="rounded-[1.6rem] border border-[rgba(239,63,143,0.16)] bg-[rgba(255,244,248,0.76)] p-5">
            <p className="text-2xl font-black tracking-[-0.04em]">Top 3 캐릭터</p>
            <ol className="mt-3 space-y-1 text-[1.02rem] leading-7 text-[var(--pink)]">
              {top3.map((item) => (
                <li key={item.rank}>
                  {item.rank}. {item.character_name}
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-6 flex items-end justify-between gap-4 border-t border-[var(--line)] pt-6">
            <div>
              <p className="text-[0.94rem] font-semibold text-[var(--muted)]">나만의 뇌피셜 찾기</p>
              <p className="mt-1 text-2xl font-black tracking-[-0.04em]">brain-official.ai</p>
            </div>
            <Link href="/" className="brain-secondary-button px-4 py-3 text-sm">
              나도 해보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

export function StepTwoShareCardPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") || getStoredStep1SessionId();
  const [data, setData] = useState<Step2ResultData | null>(null);

  useEffect(() => {
    async function bootstrap() {
      if (!sessionId) return;

      const response = await apiFetch("/api/step2/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });
      if (response.ok) {
        setData((await response.json()) as Step2ResultData);
      }
    }

    void bootstrap();
  }, [sessionId]);

  return (
    <MobileShell className="flex items-center justify-center bg-[#f4f4f6] px-6 py-10">
      <div className="brain-subtle-grid w-full rounded-[2rem] border border-[rgba(239,63,143,0.12)] bg-[linear-gradient(135deg,rgba(255,245,247,0.95),rgba(247,241,255,0.95))] p-6 shadow-[var(--shadow-strong)]">
        <p className="text-center text-3xl font-black tracking-[-0.05em]">뇌피셜</p>
        <span className="mt-8 inline-flex rounded-full bg-white/82 px-4 py-2 text-sm font-black text-[var(--pink)]">
          Step 2. 다각도 분석
        </span>
        <h1 className="mt-6 text-[2.4rem] font-black leading-[1.2] tracking-[-0.05em]">
          {data?.dilemma_text ?? "내 고민을 다각도로 분석해 봤어요"}
        </h1>

        <div className="mt-5 flex flex-wrap gap-3">
          {data?.selected_lenses.slice(0, 2).map((lens) => (
            <span key={lens.lens} className="brain-label bg-white">
              {lens.lens}
            </span>
          ))}
        </div>

        <blockquote className="mt-10 text-center text-[2.4rem] font-black italic leading-[1.3] tracking-[-0.05em]">
          &quot;{data?.critical_questions[0]?.text ?? "정말 지금이 최선의 결정일까요?"}&quot;
        </blockquote>

        <Link href="/step-2/input" className="brain-primary-button mt-12 flex w-full py-4 text-lg">
          내 고민도 분석해보기
        </Link>
      </div>
    </MobileShell>
  );
}
