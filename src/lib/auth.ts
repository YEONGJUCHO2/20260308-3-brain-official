import { getFirebaseAuth } from "@/lib/firebase";
import { isEmbeddedInAppBrowser, isMobileUserAgent } from "@/lib/client/browser-env";

export async function signInWithGoogle() {
  const auth = await getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase 클라이언트 설정이 없어 로그인 기능을 사용할 수 없습니다.");
  }

  const { GoogleAuthProvider, signInWithPopup, signInWithRedirect } = await import("firebase/auth");
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

  if (isMobileUserAgent()) {
    await signInWithRedirect(auth, provider);
    return null;
  }

  try {
    return await signInWithPopup(auth, provider);
  } catch (error) {
    const code = (error as { code?: string })?.code;
    if (code === "auth/popup-blocked" || code === "auth/cancelled-popup-request") {
      await signInWithRedirect(auth, provider);
      return null;
    }

    throw error;
  }
}

export async function signOutFromFirebase() {
  const auth = await getFirebaseAuth();
  if (!auth) {
    return;
  }

  const { signOut } = await import("firebase/auth");
  await signOut(auth);
}
