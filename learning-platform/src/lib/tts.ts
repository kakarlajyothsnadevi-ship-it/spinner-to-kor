// Text-to-speech using the browser Web Speech API — no external service needed.
// Gracefully degrades when the API is unavailable.

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string, opts?: { rate?: number; onEnd?: () => void }): void {
  if (!isSpeechSupported()) {
    opts?.onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = opts?.rate ?? 1;
  utter.pitch = 1;
  utter.lang = "en-US";
  if (opts?.onEnd) utter.onend = opts.onEnd;
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}
