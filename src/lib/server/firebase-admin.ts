import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function shouldPreferDefaultCredentials() {
  // Firebase App Hosting / Cloud Run expose FIREBASE_CONFIG at runtime.
  // In managed Google runtimes, prefer ADC over explicit private keys.
  return Boolean(process.env.FIREBASE_CONFIG) && process.env.NODE_ENV !== "development";
}

function getPrivateKey() {
  const key = process.env.ADMIN_PRIVATE_KEY;
  if (!key) return undefined;

  // Handle both literal "\\n" strings and actual newline characters
  // from local .env files or secret manager injections.
  return key
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\\n/g, "\n");
}

export function hasFirebaseAdminConfig() {
  if (shouldPreferDefaultCredentials()) {
    return false;
  }

  return Boolean(
    process.env.ADMIN_PROJECT_ID &&
    process.env.ADMIN_CLIENT_EMAIL &&
    process.env.ADMIN_PRIVATE_KEY,
  );
}

export function getFirebaseAdminApp() {
  if (!hasFirebaseAdminConfig()) {
    if (getApps().length > 0) {
      return getApps()[0]!;
    }

    return initializeApp({
      projectId:
        process.env.NEXT_PUBLIC_ADMIN_PROJECT_ID ??
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }

  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  try {
    return initializeApp({
      credential: cert({
        projectId: process.env.ADMIN_PROJECT_ID,
        clientEmail: process.env.ADMIN_CLIENT_EMAIL,
        privateKey: getPrivateKey(),
      }),
    });
  } catch (error) {
    console.warn(
      "Firebase Admin explicit credentials failed, falling back to default credentials.",
      error,
    );
  }

  // In Firebase App Hosting / other Google-managed runtimes, prefer
  // Application Default Credentials instead of storing a private key.
  return initializeApp({
    projectId:
      process.env.NEXT_PUBLIC_ADMIN_PROJECT_ID ??
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

export function getAdminFirestore() {
  const app = getFirebaseAdminApp();
  return app ? getFirestore(app) : null;
}

export function getAdminAuth() {
  const app = getFirebaseAdminApp();
  return app ? getAuth(app) : null;
}
