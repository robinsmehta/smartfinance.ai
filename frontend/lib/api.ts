const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return (await res.json()) as T;
}

export async function apiChat(message: string, language: string = "en") {
  return postJSON<{ reply: string }>("/api/chat", { message, language });
}

export async function apiLoanSimulator(payload: {
  income: number;
  expenses: number;
  loanAmount: number;
  interestRate: number;
  durationYears: number;
}) {
  return postJSON<{
    emi: number;
    status: "affordable" | "high" | "tooHigh";
    disposable: number;
    suggestion: string;
  }>("/api/loan-simulator", payload);
}

export type ScamAnalysisResult = {
  risk_level: "Safe" | "Suspicious" | "Scam" | "Unknown Image" | "Not Financial Content";
  summary: string;
  warning_signs: string[];
  confidence: "High" | "Medium" | "Low";
};

export async function apiScamText(text: string) {
  return postJSON<ScamAnalysisResult>("/api/scam-detector-text", { text });
}

export async function apiScamImage(imageBase64: string) {
  return postJSON<ScamAnalysisResult>("/api/scam-detector-image", { image_base64: imageBase64 });
}

export async function apiSavingsPlan(payload: {
  goalAmount: number;
  targetMonths: number;
  currentSavings?: number;
}) {
  return postJSON<{
    monthlySaving: number;
    monthsLeft: number;
    progress: number;
    totalNeeded: number;
  }>("/api/savings-plan", payload);
}

export async function apiGenerateImage(prompt: string) {
  return postJSON<{ image_url: string }>("/api/generate-image", { prompt });
}

export async function apiTTS(text: string): Promise<Blob> {
  const res = await fetch(`${BASE_URL}/api/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("TTS failed");
  return res.blob();
}

export async function apiSTT(file: File): Promise<{ text: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${BASE_URL}/api/stt`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("STT failed");
  return res.json();
}
