import { getFirebaseAuth } from "@/lib/firebase";

export async function signInWithGoogle() {
  const auth = await getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase 클라이언트 설정이 없어 로그인 기능을 사용할 수 없습니다.");
  }

  const { GoogleAuthProvider, signInWithPopup, signInWithRedirect } = await import("firebase/auth");
  const provider = new GoogleAuthProvider();

  try {
    return await signInWithPopup(auth, provider);
  } catch (error) {
    const code = (error as { code?: string })?.code;
    if (code === "auth/popup-blocked") {
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
