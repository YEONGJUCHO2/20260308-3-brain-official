"use client";

import { useEffect, useMemo, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

type AdSlotProps = {
  slot: string | undefined;
  label?: string;
  layout?: "banner" | "rectangle" | "infeed";
  className?: string;
};

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
const isProduction = process.env.NODE_ENV === "production";

function getSlotStyle(layout: NonNullable<AdSlotProps["layout"]>) {
  switch (layout) {
    case "rectangle":
      return "min-h-[280px]";
    case "infeed":
      return "min-h-[220px]";
    case "banner":
    default:
      return "min-h-[140px]";
  }
}

export function AdSlot({
  slot,
  label = "Sponsored",
  layout = "banner",
  className = "",
}: AdSlotProps) {
  const initializedRef = useRef(false);
  const adRef = useRef<HTMLModElement | null>(null);

  const canRenderLiveAd = useMemo(
    () => Boolean(adsenseClient && slot && (isProduction || process.env.NEXT_PUBLIC_ADSENSE_TEST_MODE === "on")),
    [slot],
  );

  useEffect(() => {
    if (!canRenderLiveAd || initializedRef.current || !adRef.current) {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      initializedRef.current = true;
    } catch {
      initializedRef.current = false;
    }
  }, [canRenderLiveAd]);

  const shellClassName = `brain-ad-slot mt-6 ${getSlotStyle(layout)} ${className}`.trim();

  if (!canRenderLiveAd) {
    return (
      <aside className={shellClassName} aria-label={`${label} placeholder`}>
        <div className="brain-ad-label">{label}</div>
        <div className="brain-ad-placeholder">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--muted)]">
            AdSense slot
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            광고는 실제 AdSense 클라이언트와 슬롯 ID가 연결되면 이 위치에 노출됩니다.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className={shellClassName} aria-label={label}>
      <div className="brain-ad-label">{label}</div>
      <ins
        ref={adRef}
        className="adsbygoogle block w-full overflow-hidden rounded-[1.5rem] bg-white"
        data-ad-client={adsenseClient}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
        {...(process.env.NEXT_PUBLIC_ADSENSE_TEST_MODE === "on" ? { "data-adtest": "on" } : {})}
      />
    </aside>
  );
}
