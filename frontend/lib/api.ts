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

export async function apiChat(message: string) {
  return postJSON<{ reply: string }>("/api/chat", { message });
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

export async function apiScamCheck(message: string) {
  return postJSON<{
    level: "safe" | "suspicious" | "scam";
    explanation: string;
    signals: string[];
  }>("/api/scam-check", { message });
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
