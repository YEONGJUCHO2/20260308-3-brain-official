import { NextResponse } from "next/server";

import { resolveRequestActor } from "@/lib/server/request-actor";
import { getSessionRecord } from "@/lib/server/session-repository";
import { runStep1Chat } from "@/lib/services/step1-service";
import {
  assertDailyUsageLimit,
  recordUsage,
  UsageLimitExceededError,
} from "@/lib/server/usage-limits";
import type { Step1ChatResponse } from "@/types/step1";

function parseStep1ChatPayload(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;

  const session_id =
    typeof record.session_id === "string" ? record.session_id.slice(0, 128) : undefined;
  const selected_option_id =
    typeof record.selected_option_id === "string" ? record.selected_option_id.slice(0, 128) : undefined;
  const input_text =
    typeof record.input_text === "string" ? record.input_text.slice(0, 2000) : undefined;

  return { session_id, selected_option_id, input_text };
}

export async function POST(request: Request) {
  try {
    const raw: unknown = await request.json().catch(() => null);
    const payload = parseStep1ChatPayload(raw);
    if (!payload) {
      return NextResponse.json({ message: "유효한 요청 형식이 아닙니다." }, { status: 400 });
    }

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
    if (error instanceof UsageLimitExceededError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }
    console.error("Step 1 chat error:", error);
    return NextResponse.json(
      { message: "Step 1 세션을 처리하지 못했습니다." },
      { status: 400 },
    );
  }
}
