import { NextResponse } from "next/server";

import { resolveRequestActor } from "@/lib/server/request-actor";
import { getSessionRecord } from "@/lib/server/session-repository";
import { runStep2Analyze } from "@/lib/services/step2-service";
import {
  assertDailyUsageLimit,
  recordUsage,
  UsageLimitExceededError,
} from "@/lib/server/usage-limits";

const MAX_DILEMMA_LENGTH = 2000;

export async function POST(request: Request) {
  try {
    const raw: unknown = await request.json().catch(() => null);
    if (!raw || typeof raw !== "object") {
      return NextResponse.json({ message: "유효한 요청 형식이 아닙니다." }, { status: 400 });
    }
    const record = raw as Record<string, unknown>;

    const sessionId =
      typeof record.session_id === "string" ? record.session_id.slice(0, 128) : undefined;
    const dilemmaText =
      typeof record.dilemma_text === "string"
        ? record.dilemma_text.slice(0, MAX_DILEMMA_LENGTH).trim()
        : undefined;

    const session = await getSessionRecord(sessionId);

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

    const payload = { session_id: session.id, dilemma_text: dilemmaText };

    const incomingText = dilemmaText;
    const storedText = session.step2_input?.trim();
    const needsFreshAnalysis =
      !session.step2_result || Boolean(incomingText && incomingText !== storedText);

    if (needsFreshAnalysis) {
      const actor = await resolveRequestActor(request, session.id);
      await assertDailyUsageLimit(actor, "step2");
      const result = await runStep2Analyze(payload);
      await recordUsage(actor, "step2");
      return NextResponse.json(result);
    }

    const result = await runStep2Analyze(payload);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof UsageLimitExceededError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }
    console.error("Step 2 analyze error:", error);
    return NextResponse.json(
      { message: "Step 2 분석을 처리하지 못했습니다." },
      { status: 400 },
    );
  }
}
