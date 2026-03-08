"use client";

import Link from "next/link";
import { Home } from "lucide-react";

import { AuthActionButton } from "@/components/ui/auth-action-button";

type HeaderActionsProps = {
  homeHref?: string;
};

export function HeaderActions({ homeHref = "/" }: HeaderActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={homeHref}
        aria-label="랜딩으로 이동"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--text)] shadow-[var(--shadow-soft)]"
      >
        <Home className="h-5 w-5" />
      </Link>
      <AuthActionButton />
    </div>
  );
}
