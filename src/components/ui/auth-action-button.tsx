"use client";

import { useEffect, useState, useTransition } from "react";
import { LogIn, LogOut } from "lucide-react";
import type { User } from "firebase/auth";

import { signInWithGoogle, signOutFromFirebase } from "@/lib/auth";
import { handoffToExternalBrowser, isEmbeddedInAppBrowser, isIosUserAgent } from "@/lib/client/browser-env";
import { getFirebaseAuth } from "@/lib/firebase";

function getAuthErrorMessage(error: unknown, isLogout: boolean) {
  if (isLogout) {
    return "로그아웃에 실패했습니다. 잠시 후 다시 시도해 주세요.";
  }

  const code = (error as { code?: string } | null)?.code;

  if (code === "auth/in-app-browser-unsupported") {
    return "네이버, 카카오, 인스타 같은 인앱 브라우저에서는 Google 로그인이 차단될 수 있습니다.\nSafari 또는 Chrome에서 이 페이지를 다시 열어 로그인해 주세요.";
  }

  if (code === "auth/disallowed-useragent") {
    return "현재 브라우저에서는 Google 로그인이 차단되었습니다.\nSafari 또는 Chrome에서 다시 열어 로그인해 주세요.";
  }

  if (code === "auth/popup-blocked") {
    return "브라우저가 로그인 팝업을 막았습니다. 팝업 차단을 해제하거나 새 탭 로그인으로 다시 시도해 주세요.";
  }

  if (code === "auth/unauthorized-domain") {
    return "Firebase Authentication의 Authorized domains에 현재 주소를 추가해야 합니다.";
  }

  if (code === "auth/operation-not-allowed") {
    return "Firebase Authentication에서 Google 로그인이 아직 활성화되지 않았습니다.";
  }

  if (code === "auth/popup-closed-by-user") {
    return "로그인 팝업이 닫혀 로그인을 완료하지 못했습니다.";
  }

  const errorMessage = (error as { message?: string })?.message || "알 수 없는 오류";
  return `로그인에 실패했습니다.\n사유: ${code || errorMessage}\n브라우저 환경이나 Firebase 인증 설정을 확인해 주세요.`;
}

export function AuthActionButton() {
  const [user, setUser] = useState<User | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    void getFirebaseAuth().then((auth) => {
      if (!auth || !isMounted) {
        return;
      }

      void import("firebase/auth").then(({ onAuthStateChanged }) => {
        if (!isMounted) {
          return;
        }

        unsubscribe = onAuthStateChanged(auth, (nextUser) => {
          setUser(nextUser);
        });
      });
    });

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  function handleClick() {
    startTransition(async () => {
      try {
        if (user) {
          await signOutFromFirebase();
          return;
        }

        if (isEmbeddedInAppBrowser()) {
          const result = await handoffToExternalBrowser(window.location.href);
          if (result === "copied" && isIosUserAgent()) {
            window.alert("링크를 복사했습니다. Safari에서 붙여넣어 다시 열면 Google 로그인이 됩니다.");
            return;
          }

          if (result === "opened") {
            return;
          }
        }

        await signInWithGoogle();
      } catch (error) {
        console.error(error);
        window.alert(getAuthErrorMessage(error, Boolean(user)));
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 text-sm font-bold text-[var(--text)] shadow-[var(--shadow-soft)] transition hover:border-[rgba(139,92,246,0.35)] disabled:opacity-50"
    >
      {user ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
      {user ? "로그아웃" : "로그인"}
    </button>
  );
}
