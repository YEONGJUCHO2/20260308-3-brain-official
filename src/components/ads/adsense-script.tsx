"use client";

import Script from "next/script";

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();

export function AdSenseScript() {
  if (!adsenseClient) {
    return null;
  }

  return (
    <Script
      id="adsense-script"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
    />
  );
}
