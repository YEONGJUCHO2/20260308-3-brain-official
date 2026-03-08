"use client";

export default function StepTwoInputError() {
  return (
    <div className="brain-page flex min-h-screen items-center justify-center px-6">
      <div className="brain-card p-8 text-center">
        <p className="text-xl font-black tracking-[-0.03em]">Step 2 입력 오류</p>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Step 1 세션을 확인한 뒤 다시 시도해 주세요.
        </p>
      </div>
    </div>
  );
}
