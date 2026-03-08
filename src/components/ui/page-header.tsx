"use client";

import Link from "next/link";
import { ArrowLeft, Menu } from "lucide-react";
import { isValidElement } from "react";

import { HeaderActions } from "@/components/ui/header-actions";
import { cn } from "@/lib/cn";

type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  backHref?: string;
  homeHref?: string;
  rightSlot?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  eyebrow,
  backHref,
  homeHref = "/",
  rightSlot,
  className,
}: PageHeaderProps) {
  const placeholderClassName =
    isValidElement<{ className?: string }>(rightSlot) &&
    typeof rightSlot.props.className === "string"
      ? rightSlot.props.className.trim()
      : null;

  const shouldUseDefaultActions =
    !rightSlot || placeholderClassName === "h-11 w-11";

  return (
    <header
      className={cn(
        "sticky top-0 z-20 border-b border-[var(--line)] bg-[rgba(255,255,255,0.78)] px-5 py-4 backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        {backHref ? (
          <Link
            href={backHref}
            aria-label="이전 화면으로 이동"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--text)]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--text)]">
            <Menu className="h-5 w-5" />
          </div>
        )}
        <div className="min-w-0 flex-1 text-center">
          {eyebrow ? (
            <p className="mb-1 text-[0.68rem] font-black uppercase tracking-[0.26em] text-[var(--muted)]">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="truncate text-lg font-black tracking-[-0.03em] text-[var(--text)]">
            {title}
          </h1>
        </div>
        <div className="flex items-center justify-end">
          {shouldUseDefaultActions ? <HeaderActions homeHref={homeHref} /> : rightSlot}
        </div>
      </div>
    </header>
  );
}
