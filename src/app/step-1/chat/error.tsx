"use client";

export default function StepOneChatError() {
  return (
    <div className="brain-page flex min-h-screen items-center justify-center px-6">
      <div className="brain-card p-8 text-center">
        <p className="text-xl font-black tracking-[-0.03em]">Step 1 화면 오류</p>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          화면을 다시 열어도 문제가 계속되면 진단을 처음부터 시작해 주세요.
        </p>
      </div>
    </div>
  );
}
