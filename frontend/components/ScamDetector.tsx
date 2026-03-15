"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, ShieldCheck, ShieldX, Search, HelpCircle, FileX } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { apiScamText, ScamAnalysisResult } from "@/lib/api";

export const riskConfig: Record<string, any> = {
  "Safe": {
    icon: ShieldCheck,
    label: "SAFE",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/25",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  "Suspicious": {
    icon: ShieldAlert,
    label: "SUSPICIOUS",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/25",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  "Scam": {
    icon: ShieldX,
    label: "SCAM",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/25",
    badge: "bg-red-500/20 text-red-300 border-red-500/30",
  },
  "Not Financial Content": {
    icon: FileX,
    label: "NOT FINANCIAL",
    color: "text-slate-400",
    bg: "bg-slate-500/10 border-slate-500/25",
    badge: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  },
  "Unknown Image": {
    icon: HelpCircle,
    label: "UNKNOWN",
    color: "text-slate-400",
    bg: "bg-slate-500/10 border-slate-500/25",
    badge: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  },
};

export default function ScamDetector() {
  const { t } = useLanguage();
  const [text, setText] = useState("");
  const [result, setResult] = useState<ScamAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await apiScamText(text);
      setResult(res);
    } catch (err) {
      setError("Unable to reach the scam analysis service. Please try again.");
    } finally {
      setLoading(false);
    }
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
            <p className="text-xs text-slate-400">Detect financial fraud in text messages</p>
          </div>
        </div>

        <form onSubmit={analyze} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.scamPlaceholder}
            rows={5}
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

        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-4 pt-2"
            >
              {(() => {
                const cfg = riskConfig[result.risk_level] || riskConfig["Unknown Image"];
                const Icon = cfg.icon;
                return (
                  <>
                    <div className={`rounded-2xl border p-4 flex items-center justify-between gap-4 ${cfg.bg}`}>
                      <div className="flex items-center gap-4">
                        <Icon className={`w-8 h-8 flex-shrink-0 ${cfg.color}`} />
                        <div>
                          <p className="text-xs text-slate-400 mb-0.5">Risk Level</p>
                          <p className={`text-xl font-bold tracking-wide ${cfg.color}`}>
                            {cfg.label}
                          </p>
                        </div>
                      </div>
                      {result.confidence && result.confidence !== "Low" && (
                        <div className="text-right flex flex-col items-end">
                           <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Confidence</span>
                           <span className={`text-xs px-2 py-0.5 rounded-full border bg-slate-800/80 ${
                             result.confidence === "High" ? "text-emerald-400 border-emerald-500/30" : "text-amber-400 border-amber-500/30"
                           }`}>{result.confidence}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          Summary
                        </p>
                        <p className="text-sm text-slate-200 leading-relaxed font-medium">{result.summary}</p>
                      </div>

                      {result.warning_signs && result.warning_signs.length > 0 && (
                        <div className="pt-2 border-t border-slate-700/50">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            Warning Signs
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {result.warning_signs.map((signal, i) => (
                              <span
                                key={i}
                                className={`px-2.5 py-1 rounded-full text-[11px] border shadow-sm ${cfg.badge}`}
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
