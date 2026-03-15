"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, ShieldCheck, ShieldX, Search } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export type RiskLevel = "safe" | "suspicious" | "scam";

export type AnalysisResult = {
  level: RiskLevel;
  explanation: string;
  signals: string[];
};

const scamPatterns = [
  { pattern: /otp|pin|password|passcode/i, weight: 4, signal: "Requests sensitive authentication data (OTP/PIN)" },
  { pattern: /won|winner|prize|lucky|congratulations/i, weight: 3, signal: "Prize/lottery baiting language" },
  { pattern: /urgent|immediately|act now|expires|24 hour/i, weight: 2, signal: "Creates artificial urgency" },
  { pattern: /send|transfer|deposit|pay.*fee|advance.*fee/i, weight: 3, signal: "Requests money upfront" },
  { pattern: /click here|link|http|bit\.ly|tinyurl/i, weight: 2, signal: "Suspicious links or redirects" },
  { pattern: /income tax|irs|govt|government|police|arrest/i, weight: 3, signal: "Impersonates authority or government" },
  { pattern: /free|no cost|zero fee|100%/i, weight: 1, signal: "Unrealistic free offer" },
  { pattern: /verify.*account|suspended|blocked|deactivated/i, weight: 3, signal: "Account threat / phishing attempt" },
  { pattern: /bitcoin|crypto|invest.*profit|double.*money/i, weight: 3, signal: "Suspicious investment scheme" },
];

export function analyzeText(text: string): AnalysisResult {
  let totalWeight = 0;
  const signals: string[] = [];

  for (const { pattern, weight, signal } of scamPatterns) {
    if (pattern.test(text)) {
      totalWeight += weight;
      signals.push(signal);
    }
  }

  let level: RiskLevel;
  let explanation: string;

  if (totalWeight >= 6) {
    level = "scam";
    explanation =
      "This message contains multiple strong indicators of a financial scam. DO NOT respond, click any links, share OTPs, or transfer money. Block the sender immediately and report to your bank or cybercrime helpline.";
  } else if (totalWeight >= 3) {
    level = "suspicious";
    explanation =
      "This message has some warning signs of a potential scam or phishing attempt. Exercise caution — verify directly with the official organization before taking any action. Legitimate companies will never ask for your OTP or PIN.";
  } else {
    level = "safe";
    explanation =
      "No major scam indicators found. The message appears reasonably safe. However, always stay vigilant — verify sender identity before sharing any personal or financial information.";
  }

  return { level, explanation, signals };
}

export const riskConfig = {
  safe: {
    icon: ShieldCheck,
    label: "SAFE",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/25",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  suspicious: {
    icon: ShieldAlert,
    label: "SUSPICIOUS",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/25",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  scam: {
    icon: ShieldX,
    label: "SCAM",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/25",
    badge: "bg-red-500/20 text-red-300 border-red-500/30",
  },
};

export default function ScamDetector() {
  const { t } = useLanguage();
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      setResult(analyzeText(text));
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="h-full overflow-y-auto px-4 md:px-6 py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">{t.scamTitle}</h2>
            <p className="text-xs text-slate-400">Detect financial fraud in seconds</p>
          </div>
        </div>

        <form onSubmit={analyze} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.scamPlaceholder}
            rows={6}
            className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all resize-none"
            required
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading || !text.trim()}
            className="w-full py-3 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-red-600/10"
          >
            {loading ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                {t.analyzing}
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                {t.analyzeBtn}
              </>
            )}
          </motion.button>
        </form>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              {(() => {
                const cfg = riskConfig[result.level];
                const Icon = cfg.icon;
                return (
                  <>
                    <div className={`rounded-2xl border p-5 flex items-center gap-4 ${cfg.bg}`}>
                      <Icon className={`w-8 h-8 flex-shrink-0 ${cfg.color}`} />
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">{t.riskLevel}</p>
                        <p className={`text-2xl font-bold tracking-wide ${cfg.color}`}>
                          {cfg.label}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          {t.scamExplanation}
                        </p>
                        <p className="text-sm text-slate-300 leading-relaxed">{result.explanation}</p>
                      </div>

                      {result.signals.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Detected Signals
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {result.signals.map((signal, i) => (
                              <span
                                key={i}
                                className={`px-2.5 py-1 rounded-full text-xs border ${cfg.badge}`}
                              >
                                {signal}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
