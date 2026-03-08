import { getApps, initializeApp, type FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function hasFirebaseClientConfig() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  );
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!hasFirebaseClientConfig()) {
    return null;
  }

  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  return initializeApp(firebaseConfig);
}

let authPromise: Promise<import("firebase/auth").Auth | null> | null = null;

export async function getFirebaseAuth() {
  const app = getFirebaseApp();
  if (!app) {
    return null;
  }

  if (!authPromise) {
    authPromise = import("firebase/auth").then(({ getAuth }) => getAuth(app));
  }

  return authPromise;
}
