const STEP1_SESSION_KEY = "brain-official.step1.session-id";
const STEP2_INPUT_KEY = "brain-official.step2.input";

export function getStoredStep1SessionId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STEP1_SESSION_KEY);
}

export function setStoredStep1SessionId(sessionId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STEP1_SESSION_KEY, sessionId);
}

export function clearStoredStep1SessionId() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STEP1_SESSION_KEY);
}

export function getStoredStep2Input() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(STEP2_INPUT_KEY) ?? "";
}

export function setStoredStep2Input(value: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STEP2_INPUT_KEY, value);
}

export function clearStoredStep2Input() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STEP2_INPUT_KEY);
}

export function clearStoredBrainSession() {
  clearStoredStep1SessionId();
  clearStoredStep2Input();
}
