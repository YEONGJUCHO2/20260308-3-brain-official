import { NextResponse } from "next/server";

import { resolveRequestActor } from "@/lib/server/request-actor";
import { getSessionRecord } from "@/lib/server/session-repository";
import { runStep2Analyze } from "@/lib/services/step2-service";
import {
  assertDailyUsageLimit,
  recordUsage,
  UsageLimitExceededError,
} from "@/lib/server/usage-limits";
import type { Step2AnalyzeRequest } from "@/types/step2";

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => ({}))) as Step2AnalyzeRequest;
    const session = await getSessionRecord(payload.session_id);

    if (!session) {
      return NextResponse.json(
        { message: "Step 2 분석을 위해 session_id가 필요합니다." },
        { status: 404 },
      );
    }

    if (session.step1_status !== "ready_for_result") {
      return NextResponse.json(
        { message: "Step 2 분석 전에는 Step 1 결과가 먼저 필요합니다." },
        { status: 409 },
      );
    }

    const incomingText = payload.dilemma_text?.trim();
    const storedText = session.step2_input?.trim();
    const needsFreshAnalysis =
      !session.step2_result || Boolean(incomingText && incomingText !== storedText);

    if (needsFreshAnalysis) {
      const actor = await resolveRequestActor(request, payload.session_id);
      await assertDailyUsageLimit(actor, "step2");
      const result = await runStep2Analyze(payload);
      await recordUsage(actor, "step2");
      return NextResponse.json(result);
    }

    const result = await runStep2Analyze(payload);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Step 2 분석을 처리하지 못했습니다.",
      },
      { status: error instanceof UsageLimitExceededError ? error.statusCode : 400 },
    );
  }
}
