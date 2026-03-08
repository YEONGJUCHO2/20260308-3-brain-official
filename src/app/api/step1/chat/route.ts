import { NextResponse } from "next/server";

import { resolveRequestActor } from "@/lib/server/request-actor";
import { getSessionRecord } from "@/lib/server/session-repository";
import { runStep1Chat } from "@/lib/services/step1-service";
import {
  assertDailyUsageLimit,
  recordUsage,
  UsageLimitExceededError,
} from "@/lib/server/usage-limits";
import type { Step1ChatRequest, Step1ChatResponse } from "@/types/step1";

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => ({}))) as Step1ChatRequest;
    const existingSession = payload.session_id ? await getSessionRecord(payload.session_id) : null;

    if (!existingSession) {
      const actor = await resolveRequestActor(request, payload.session_id);
      await assertDailyUsageLimit(actor, "step1");
      const response: Step1ChatResponse = await runStep1Chat(payload);
      await recordUsage(actor, "step1");
      return NextResponse.json(response);
    }

    const response: Step1ChatResponse = await runStep1Chat(payload);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Step 1 세션을 처리하지 못했습니다.",
      },
      { status: error instanceof UsageLimitExceededError ? error.statusCode : 400 },
    );
  }
}
