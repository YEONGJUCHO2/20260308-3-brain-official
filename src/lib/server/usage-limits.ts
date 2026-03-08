import { createHash } from "node:crypto";

import { FieldValue } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/server/firebase-admin";
import type { RequestActor } from "@/lib/server/request-actor";

type DailyUsageRecord = {
  date: string;
  scope_key: string;
  authenticated: boolean;
  uid?: string;
  step1_starts: number;
  step2_runs: number;
  updated_at: string;
};

type UsageKind = "step1" | "step2";

const usageMemory = new Map<string, DailyUsageRecord>();

function usageLimitsDisabled() {
  // Temporary override during active product debugging.
  // Re-enable once the onboarding flow is verified in production.
  return true;
}

export class UsageLimitExceededError extends Error {
  statusCode = 429;

  constructor(message: string) {
    super(message);
    this.name = "UsageLimitExceededError";
  }
}

function nowIso() {
  return new Date().toISOString();
}

function getDateKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function buildDocId(date: string, scopeKey: string) {
  return createHash("sha256").update(`${date}:${scopeKey}`).digest("hex");
}

function getDefaultRecord(actor: RequestActor, date: string): DailyUsageRecord {
  return {
    date,
    scope_key: actor.scopeKey,
    authenticated: actor.authenticated,
    ...(actor.uid ? { uid: actor.uid } : {}),
    step1_starts: 0,
    step2_runs: 0,
    updated_at: nowIso(),
  };
}

function getFieldName(kind: UsageKind) {
  return kind === "step1" ? "step1_starts" : "step2_runs";
}

function getLimit(actor: RequestActor, kind: UsageKind) {
  if (kind === "step1") {
    return 1;
  }

  return actor.authenticated ? 3 : 1;
}

function getExceededMessage(actor: RequestActor, kind: UsageKind) {
  if (kind === "step1") {
    return actor.authenticated
      ? "오늘 Step 1 진단 사용 횟수를 모두 사용했습니다."
      : "오늘 무료 Step 1 체험을 이미 사용했습니다.";
  }

  return actor.authenticated
    ? "오늘 Step 2 분석 가능 횟수(3회)를 모두 사용했습니다."
    : "오늘 무료 Step 2 체험을 이미 사용했습니다.";
}

async function readRecord(actor: RequestActor, date = getDateKey()) {
  const db = getAdminFirestore();
  const docId = buildDocId(date, actor.scopeKey);

  if (!db) {
    return usageMemory.get(docId) ?? getDefaultRecord(actor, date);
  }

  const ref = db.collection("dailyUsage").doc(docId);
  const snapshot = await ref.get();

  if (!snapshot.exists) {
    return getDefaultRecord(actor, date);
  }

  return snapshot.data() as DailyUsageRecord;
}

export async function assertDailyUsageLimit(actor: RequestActor, kind: UsageKind) {
  if (usageLimitsDisabled()) {
    return;
  }

  const record = await readRecord(actor);
  const field = getFieldName(kind);
  const current = record[field];
  const limit = getLimit(actor, kind);

  if (current >= limit) {
    throw new UsageLimitExceededError(getExceededMessage(actor, kind));
  }
}

export async function recordUsage(actor: RequestActor, kind: UsageKind) {
  if (usageLimitsDisabled()) {
    return getDefaultRecord(actor, getDateKey());
  }

  const date = getDateKey();
  const field = getFieldName(kind);
  const db = getAdminFirestore();
  const docId = buildDocId(date, actor.scopeKey);

  if (!db) {
    const current = usageMemory.get(docId) ?? getDefaultRecord(actor, date);
    const next = {
      ...current,
      [field]: current[field] + 1,
      updated_at: nowIso(),
    } as DailyUsageRecord;
    usageMemory.set(docId, next);
    return next;
  }

  const ref = db.collection("dailyUsage").doc(docId);
  await ref.set(getDefaultRecord(actor, date), { merge: true });
  await ref.set(
    {
      [field]: FieldValue.increment(1),
      updated_at: nowIso(),
    },
    { merge: true },
  );

  const snapshot = await ref.get();
  return snapshot.data() as DailyUsageRecord;
}
