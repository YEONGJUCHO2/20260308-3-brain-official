"use client";

export default function StepTwoResultError() {
  return (
    <div className="brain-page flex min-h-screen items-center justify-center px-6">
      <div className="brain-card p-8 text-center">
        <p className="text-xl font-black tracking-[-0.03em]">Step 2 결과 오류</p>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          고민 분석 결과를 다시 불러오는 데 실패했습니다.
        </p>
      </div>
    </div>
  );
}
