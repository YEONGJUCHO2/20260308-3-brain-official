export function RouteLoading({ label }: { label: string }) {
  return (
    <div className="brain-page flex min-h-screen items-center justify-center px-6">
      <div className="brain-card w-full max-w-[320px] p-8 text-center">
        <div className="mx-auto h-14 w-14 animate-pulse rounded-full bg-[linear-gradient(135deg,var(--pink),var(--violet))]" />
        <p className="mt-5 text-lg font-black tracking-[-0.03em] text-[var(--text)]">
          {label}
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          화면을 준비하고 있습니다.
        </p>
      </div>
    </div>
  );
}
