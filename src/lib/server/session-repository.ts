import {
  createSession,
  createSessionFromRecord,
  getSession,
  saveSession,
  type BrainSession,
} from "@/lib/server/session-store";
import { getAdminFirestore } from "@/lib/server/firebase-admin";

const COLLECTION_NAME = "anonymousSessions";

function getCollection() {
  const db = getAdminFirestore();
  return db ? db.collection(COLLECTION_NAME) : null;
}

function stripUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefinedDeep(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, entry]) => entry !== undefined)
        .map(([key, entry]) => [key, stripUndefinedDeep(entry)]),
    ) as T;
  }

  return value;
}

export async function getSessionRecord(sessionId?: string) {
  if (!sessionId) return null;

  const collection = getCollection();
  if (!collection) {
    return getSession(sessionId);
  }

  const snapshot = await collection.doc(sessionId).get();
  if (!snapshot.exists) {
    return null;
  }

  return createSessionFromRecord(snapshot.data() as BrainSession);
}

export async function getOrCreateSessionRecord(sessionId?: string) {
  const existing = await getSessionRecord(sessionId);
  if (existing) {
    return existing;
  }

  const created = createSession();
  await persistSessionRecord(created);
  return created;
}

export async function persistSessionRecord(session: BrainSession) {
  const collection = getCollection();
  const saved = saveSession(session);

  if (!collection) {
    return saved;
  }

  await collection.doc(saved.id).set(stripUndefinedDeep(saved), { merge: true });
  return saved;
}
