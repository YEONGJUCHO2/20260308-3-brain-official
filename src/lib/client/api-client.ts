"use client";

import { getFirebaseAuth } from "@/lib/firebase";

async function getAuthorizationHeader() {
  const auth = await getFirebaseAuth();
  const user = auth?.currentUser;

  if (!user) {
    return null;
  }

  try {
    const token = await user.getIdToken();
    return token ? `Bearer ${token}` : null;
  } catch {
    return null;
  }
}

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  const authorization = await getAuthorizationHeader();

  if (authorization && !headers.has("Authorization")) {
    headers.set("Authorization", authorization);
  }

  return fetch(input, {
    ...init,
    headers,
  });
}
