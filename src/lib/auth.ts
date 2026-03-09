import { getFirebaseAuth } from "@/lib/firebase";
import { isEmbeddedInAppBrowser } from "@/lib/client/browser-env";

export async function signInWithGoogle() {
  const auth = await getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase 클라이언트 설정이 없어 로그인 기능을 사용할 수 없습니다.");
  }

  const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });

  if (isEmbeddedInAppBrowser()) {
    const error = new Error(
      "Google 로그인은 네이버, 카카오, 인스타 같은 인앱 브라우저에서 차단될 수 있습니다.",
    ) as Error & { code?: string };
    error.code = "auth/in-app-browser-unsupported";
    throw error;
  }

  return signInWithPopup(auth, provider);
}

export async function signOutFromFirebase() {
  const auth = await getFirebaseAuth();
  if (!auth) {
    return;
  }

  const { signOut } = await import("firebase/auth");
  await signOut(auth);
}
