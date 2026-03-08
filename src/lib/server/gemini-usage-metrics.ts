import { FieldValue } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/server/firebase-admin";

type DailyGeminiMetric = {
  date: string;
  total_calls: number;
  updated_at: string;
  model_counts: Record<string, number>;
  source_counts: Record<string, number>;
};

const geminiMetricMemory = new Map<string, DailyGeminiMetric>();

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

function sanitizeMetricKey(value: string) {
  return value.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "").toLowerCase() || "unknown";
}

export async function logGeminiInvocation({
  model,
  source,
}: {
  model: string;
  source: string;
}) {
  const date = getDateKey();
  const db = getAdminFirestore();
  const modelKey = sanitizeMetricKey(model);
  const sourceKey = sanitizeMetricKey(source);

  if (!db) {
    const current = geminiMetricMemory.get(date) ?? {
      date,
      total_calls: 0,
      updated_at: nowIso(),
      model_counts: {},
      source_counts: {},
    };
    const next = {
      ...current,
      total_calls: current.total_calls + 1,
      model_counts: {
        ...current.model_counts,
        [modelKey]: (current.model_counts[modelKey] ?? 0) + 1,
      },
      source_counts: {
        ...current.source_counts,
        [sourceKey]: (current.source_counts[sourceKey] ?? 0) + 1,
      },
      updated_at: nowIso(),
    };
    geminiMetricMemory.set(date, next);
    return;
  }

  const ref = db.collection("dailyGeminiMetrics").doc(date);
  await ref.set(
    {
      date,
      total_calls: FieldValue.increment(1),
      [`models.${modelKey}`]: FieldValue.increment(1),
      [`sources.${sourceKey}`]: FieldValue.increment(1),
      updated_at: nowIso(),
    },
    { merge: true },
  );
}
