"use client";

import { useEffect, useState } from "react";
import { Copy, ExternalLink, X } from "lucide-react";

import {
  handoffToExternalBrowser,
  isAndroidUserAgent,
  isEmbeddedInAppBrowser,
  isIosUserAgent,
} from "@/lib/client/browser-env";

export function InAppBrowserBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsVisible(isEmbeddedInAppBrowser());
  }, []);

  async function handleCopy() {
    const result = await handoffToExternalBrowser(window.location.href);
    if (result === "copied") {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
      return;
    }

    if (result === "unsupported") {
      window.alert("링크 복사에 실패했습니다. 주소창에서 직접 복사해 주세요.");
    }
  }

  if (!isVisible) {
    return null;
  }

  return (
    <section className="border-b border-[rgba(239,63,143,0.12)] bg-[linear-gradient(135deg,rgba(255,247,251,0.98),rgba(247,242,255,0.98))] px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-[var(--pink)]">인앱 브라우저에서 열려 있습니다</p>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
            Google 로그인은 네이버, 카카오, 인스타 같은 인앱 브라우저에서 막힐 수 있습니다.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {isAndroidUserAgent() ? (
              <button
                type="button"
                onClick={() => void handoffToExternalBrowser(window.location.href)}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-4 py-2 text-sm font-bold text-white"
              >
                <ExternalLink className="h-4 w-4" />
                Chrome에서 열기
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-bold text-[var(--text)]"
            >
              <Copy className="h-4 w-4" />
              {copied ? "복사됨" : "링크 복사"}
            </button>
          </div>
          {isIosUserAgent() ? (
            <p className="mt-2 text-xs font-semibold text-[var(--muted)]">
              iPhone에서는 링크를 복사한 뒤 Safari에서 직접 여는 방식이 가장 안정적입니다.
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted)]"
          aria-label="브라우저 안내 닫기"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
