import { getApps, initializeApp, type FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyATTdLtbKEIvOFaz479oQ6iQ-wFWdK0JpI",
  authDomain: "brain-official.firebaseapp.com",
  projectId: "brain-official",
  storageBucket: "brain-official.firebasestorage.app",
  messagingSenderId: "323291636893",
  appId: "1:323291636893:web:b7df7c38d32cd4c523e074",
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
