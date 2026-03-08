import { createHash } from "node:crypto";

import { getAdminAuth } from "@/lib/server/firebase-admin";

export type RequestActor = {
  authenticated: boolean;
  uid?: string;
  scopeKey: string;
};

function fingerprint(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 24);
}

function buildAnonymousScopeKey(request: Request, seed?: string) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown-ip";
  const userAgent = request.headers.get("user-agent") || "unknown-ua";
  return `anon:${fingerprint(`${forwardedFor}|${userAgent}|${seed ?? ""}`)}`;
}

export async function resolveRequestActor(request: Request, seed?: string): Promise<RequestActor> {
  const authHeader = request.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length).trim();
    const adminAuth = getAdminAuth();

    if (token && adminAuth) {
      try {
        const decoded = await adminAuth.verifyIdToken(token);
        return {
          authenticated: true,
          uid: decoded.uid,
          scopeKey: `user:${decoded.uid}`,
        };
      } catch (error) {
        console.warn("Ignoring invalid Firebase ID token for quota scope:", error);
      }
    }
  }

  return {
    authenticated: false,
    scopeKey: buildAnonymousScopeKey(request, seed),
  };
}
