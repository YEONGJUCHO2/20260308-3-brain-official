"use client";

export default function StepOneResultError() {
  return (
    <div className="brain-page flex min-h-screen items-center justify-center px-6">
      <div className="brain-card p-8 text-center">
        <p className="text-xl font-black tracking-[-0.03em]">Step 1 결과 오류</p>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          세션이 만료됐거나 결과를 만드는 중 문제가 생겼습니다.
        </p>
      </div>
    </div>
  );
}
