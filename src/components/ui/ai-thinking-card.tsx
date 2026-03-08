"use client";

type AiThinkingCardProps = {
  title: string;
  description: string;
  lines?: number;
};

export function AiThinkingCard({
  title,
  description,
  lines = 3,
}: AiThinkingCardProps) {
  return (
    <div className="rounded-[1.8rem] border border-[rgba(239,63,143,0.14)] bg-[linear-gradient(135deg,rgba(255,244,249,0.95),rgba(245,238,255,0.95))] p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-2 shadow-[var(--shadow-soft)]">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--pink)]" />
          <span
            className="h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--violet)]"
            style={{ animationDelay: "120ms" }}
          />
          <span
            className="h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--pink)]"
            style={{ animationDelay: "240ms" }}
          />
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--pink)]">
            AI 분석 중
          </p>
          <h3 className="mt-1 text-[1.02rem] font-black text-[var(--text)]">{title}</h3>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{description}</p>

      <div className="mt-4 space-y-2.5">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className="h-3.5 animate-pulse rounded-full bg-[rgba(117,110,137,0.12)]"
            style={{ width: `${100 - index * 12}%` }}
          />
        ))}
      </div>
    </div>
  );
}
