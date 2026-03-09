export function getUserAgent() {
  if (typeof navigator === "undefined") {
    return "";
  }

  return navigator.userAgent;
}

export function isMobileUserAgent() {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(getUserAgent());
}

export function isEmbeddedInAppBrowser() {
  return /KAKAOTALK|NAVER|FBAN|FBAV|Instagram|Line|; wv\)|\bwv\b/i.test(getUserAgent());
}

export function isAndroidUserAgent() {
  return /Android/i.test(getUserAgent());
}

export function isIosUserAgent() {
  return /iPhone|iPad|iPod/i.test(getUserAgent());
}

export function buildChromeIntentUrl(currentUrl: string) {
  const parsed = new URL(currentUrl);
  const path = `${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}`;
  return `intent://${path.replace(/^\/+/, "")}#Intent;scheme=${parsed.protocol.replace(":", "")};package=com.android.chrome;end`;
}

export async function handoffToExternalBrowser(currentUrl: string) {
  if (typeof window === "undefined") {
    return "unsupported" as const;
  }

  if (isAndroidUserAgent()) {
    window.location.href = buildChromeIntentUrl(currentUrl);
    return "opened" as const;
  }

  try {
    await navigator.clipboard.writeText(currentUrl);
    return "copied" as const;
  } catch {
    return "unsupported" as const;
  }
}
