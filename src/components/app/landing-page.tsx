"use client";

import { Brain, CircleAlert, Compass, Radar, ShieldCheck } from "lucide-react";

import { StartStepOneButton } from "@/components/app/start-step-one-button";
import { AuthActionButton } from "@/components/ui/auth-action-button";
import { MobileShell } from "@/components/ui/mobile-shell";
import { OptionalArtworkTile } from "@/components/ui/optional-artwork-tile";

const topCharacters = [
  {
    label: "트렌드 감지자",
    tone: "text-[var(--pink)]",
    imageSrc: "/characters/trend-sensor.png",
    icon: Radar,
  },
  {
    label: "직관의 프로파일러",
    tone: "text-[var(--violet)]",
    imageSrc: "/characters/intuitive-profiler.png",
    icon: Compass,
  },
  {
    label: "안정 추구형 전략가",
    tone: "text-[#4f7cff]",
    imageSrc: "/characters/stability-strategist.png",
    icon: ShieldCheck,
  },
];

export function LandingPage() {
  return (
    <MobileShell className="overflow-hidden">
      <div className="border-b border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-5 py-4 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="h-11 w-11" />
          <p className="text-2xl font-black tracking-[-0.05em] text-[var(--text)]">뇌피셜</p>
          <AuthActionButton />
        </div>
      </div>

      <main className="px-5 pb-14 pt-10 sm:px-7">
        <section className="relative overflow-hidden rounded-[2rem] px-2 pb-10 text-center">
          <div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(239,63,143,0.22),_rgba(139,92,246,0.12),_transparent_72%)]" />
          <OptionalArtworkTile
            src="/illustrations/representative.png"
            alt="뇌피셜 대표 캐릭터"
            className="relative mx-auto mb-8 flex h-40 w-40 items-center justify-center rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(244,232,255,0.82))] shadow-[var(--shadow-strong)]"
            imageClassName="object-contain p-5"
            fallback={
              <div className="flex h-24 w-24 items-center justify-center rounded-[1.4rem] bg-[rgba(255,255,255,0.72)] text-[var(--violet)]">
                <Brain className="h-10 w-10" />
              </div>
            }
          />

          <h1 className="mx-auto max-w-[320px] text-[2.35rem] font-black leading-[1.2] tracking-[-0.055em] text-[var(--text)]">
            당신이 모르는 당신의
            <br />
            진짜 생각, 뇌피셜로
            <br />
            마주하세요
          </h1>
          <p className="mx-auto mt-5 max-w-[320px] text-lg font-medium leading-8 text-[var(--muted)]">
            내 안의 인지 편향을 발견하고, AI와 함께
            <br />
            스스로를 성찰해 보세요.
          </p>

          <StartStepOneButton />
        </section>

        <section className="mt-12">
          <div className="text-center">
            <h2 className="brain-section-title text-[2.1rem]">어떻게 성찰하나요?</h2>
            <p className="mt-2 text-base font-medium text-[var(--muted)]">
              2단계로 알아보는 나의 뇌피셜
            </p>
          </div>

          <div className="mt-7 space-y-4">
            <div className="brain-card p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-lg font-black text-[var(--pink)] shadow-[var(--shadow-soft)]">
                  1
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[1.6rem] font-black tracking-[-0.04em]">
                    내 뇌피셜 캐릭터 Top 3 찾기
                  </h3>
                  <p className="mt-3 text-[1.02rem] leading-7 text-[var(--muted)]">
                    상황별 테스트를 통해 내가 자주 빠지는 인지 편향 캐릭터 3가지를
                    발견합니다.
                  </p>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {topCharacters.map(({ label, tone, imageSrc, icon: Icon }) => (
                      <div
                        key={label}
                        className="rounded-[1.3rem] border border-white/70 bg-white/62 px-2 py-4 text-center shadow-[var(--shadow-soft)]"
                      >
                        <OptionalArtworkTile
                          src={imageSrc}
                          alt={label}
                          className="mx-auto mb-2 h-14 w-14 rounded-full"
                          imageClassName="object-contain p-1"
                          fallback={
                            <div className={`flex h-full w-full items-center justify-center bg-white ${tone}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                          }
                        />
                        <p className="break-keep text-[0.78rem] font-black leading-5 tracking-[-0.03em]">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="brain-card p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-lg font-black text-[var(--violet)] shadow-[var(--shadow-soft)]">
                  2
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[1.6rem] font-black tracking-[-0.04em]">
                    실제 고민을 다각도로 분석하기
                  </h3>
                  <p className="mt-3 text-[1.02rem] leading-7 text-[var(--muted)]">
                    고민을 입력하면 AI가 렌즈를 골라 심리, 경제, 확률 같은 관점으로
                    질문을 정리해 줍니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/78 px-5 py-3 text-sm font-semibold text-[var(--muted)] shadow-[var(--shadow-soft)]">
            <CircleAlert className="h-4 w-4 text-[var(--muted)]" />
            이 서비스는 성찰을 위한 도구이며, 의학적 진단이 아닙니다.
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] bg-[linear-gradient(135deg,rgba(239,63,143,0.08),rgba(139,92,246,0.08))] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--muted)]">
                why share
              </p>
              <h3 className="mt-2 text-2xl font-black tracking-[-0.04em]">
                친구에게 보여주고 싶은 결과가 남아요
              </h3>
              <p className="mt-3 leading-7 text-[var(--muted)]">
                딱딱한 검사 결과 대신, 나를 설명하는 캐릭터와 질문 카드로
                친구에게 보여주기 좋은 결과를 만듭니다.
              </p>
            </div>
            <div className="hidden rounded-[1.6rem] bg-white/80 p-3 shadow-[var(--shadow-soft)] sm:block">
              <Brain className="h-10 w-10 text-[var(--pink)]" />
            </div>
          </div>
        </section>
      </main>
    </MobileShell>
  );
}
