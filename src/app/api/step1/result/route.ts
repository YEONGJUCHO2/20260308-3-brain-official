import { NextResponse } from "next/server";

import { getSessionRecord } from "@/lib/server/session-repository";
import { runStep1Result } from "@/lib/services/step1-service";
import type { Step1ResultRequest } from "@/types/step1";

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => ({}))) as Step1ResultRequest;
    const session = await getSessionRecord(payload.session_id);

    if (!session) {
      return NextResponse.json(
        { message: "유효한 Step 1 session_id가 필요합니다." },
        { status: 404 },
      );
    }

    if (session.step1_status !== "ready_for_result") {
      return NextResponse.json(
        { message: "Step 1 진단이 아직 끝나지 않았습니다." },
        { status: 409 },
      );
    }

    const result = await runStep1Result(payload);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Step 1 결과를 생성하지 못했습니다.",
      },
      { status: 400 },
    );
  }
}
