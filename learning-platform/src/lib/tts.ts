// Text-to-speech using the browser Web Speech API — no external service needed.
// Handles the two things that usually make speech "not work":
//   1. Voices load asynchronously (getVoices() is empty until 'voiceschanged').
//   2. Browsers block speech until the first user gesture — call primeVoices()
//      from a click/tap once to unlock it.

let cachedVoices: SpeechSynthesisVoice[] = [];
let primed = false;

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function loadVoices() {
  if (!isSpeechSupported()) return;
  cachedVoices = window.speechSynthesis.getVoices();
}

// Call once from a user gesture (e.g. entering the classroom / first tap) so
// later speak() calls are allowed and voices are ready.
export function primeVoices(): void {
  if (!isSpeechSupported() || primed) return;
  primed = true;
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
  // A muted, empty utterance "unlocks" speech on strict browsers.
  try {
    const warm = new SpeechSynthesisUtterance(" ");
    warm.volume = 0;
    window.speechSynthesis.speak(warm);
  } catch {
    /* ignore */
  }
}

function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
  if (!cachedVoices.length) loadVoices();
  const prefix = lang.split("-")[0];
  // Prefer a natural-sounding voice in the requested language.
  return (
    cachedVoices.find((v) => v.lang?.toLowerCase().startsWith(prefix) && /google|natural|samantha|zira|female/i.test(v.name)) ||
    cachedVoices.find((v) => v.lang?.toLowerCase().startsWith(prefix)) ||
    cachedVoices.find((v) => v.lang?.toLowerCase().startsWith("en")) ||
    cachedVoices[0]
  );
}

const langMap: Record<string, string> = { en: "en-US", hi: "hi-IN", te: "te-IN" };

export function speak(text: string, opts?: { rate?: number; lang?: string; onEnd?: () => void }): void {
  if (!isSpeechSupported() || !text.trim()) {
    opts?.onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const bcp = langMap[opts?.lang ?? "en"] ?? "en-US";
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = opts?.rate ?? 1;
  utter.pitch = 1;
  utter.lang = bcp;
  const voice = pickVoice(bcp);
  if (voice) utter.voice = voice;
  if (opts?.onEnd) {
    utter.onend = opts.onEnd;
    utter.onerror = opts.onEnd;
  }
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}
