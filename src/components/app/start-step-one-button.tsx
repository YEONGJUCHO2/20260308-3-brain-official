"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { clearStoredBrainSession } from "@/lib/client/session-storage";

export function StartStepOneButton() {
  return (
    <Link
      href="/step-1/chat?fresh=1"
      onClick={() => clearStoredBrainSession()}
      className="brain-primary-button mx-auto mt-8 flex w-full max-w-[340px] px-7 py-5 text-lg"
    >
      지금 나의 뇌피셜 확인하기
      <ArrowRight className="h-5 w-5" />
    </Link>
  );
}
