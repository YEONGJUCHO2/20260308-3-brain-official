import { NextResponse } from "next/server";

import { getSessionRecord } from "@/lib/server/session-repository";
import { runStep1Result } from "@/lib/services/step1-service";

export async function POST(request: Request) {
  try {
    const raw: unknown = await request.json().catch(() => null);
    if (!raw || typeof raw !== "object") {
      return NextResponse.json({ message: "유효한 요청 형식이 아닙니다." }, { status: 400 });
    }

    const sessionId =
      typeof (raw as Record<string, unknown>).session_id === "string"
        ? ((raw as Record<string, unknown>).session_id as string).slice(0, 128)
        : undefined;

    const session = await getSessionRecord(sessionId);

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

    const result = await runStep1Result({ session_id: session.id });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Step 1 result error:", error);
    return NextResponse.json(
      { message: "Step 1 결과를 생성하지 못했습니다." },
      { status: 400 },
    );
  }
}
