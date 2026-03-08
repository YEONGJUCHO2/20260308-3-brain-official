"use client";

export async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

export async function shareLink(params: {
  title: string;
  text: string;
  url: string;
}) {
  if (navigator.share) {
    await navigator.share(params);
    return "shared";
  }

  await copyText(params.url);
  return "copied";
}

export async function downloadNodeAsPng(node: HTMLElement, filename: string) {
  const { toPng } = await import("html-to-image");
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: "#f8f2f7",
  });

  const anchor = document.createElement("a");
  anchor.download = filename;
  anchor.href = dataUrl;
  anchor.click();
}
