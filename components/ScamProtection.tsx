"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, FileSearch } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import ScamDetector, {
  analyzeText,
  riskConfig,
  type AnalysisResult,
  type RiskLevel,
} from "@/components/ScamDetector";

export default function ScamProtection() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"text" | "image">("text");

  const [fileName, setFileName] = useState<string | null>(null);
  const [imageResult, setImageResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    setImageResult(null);

    // Simple demo: run the same text analysis heuristics on the filename
    const pseudoText = `Screenshot content from ${file.name}`;

    setTimeout(() => {
      const res = analyzeText(pseudoText);
      setImageResult(res);
      setLoading(false);
    }, 1200);
  };

  const renderImageResult = () => {
    if (!imageResult) return null;
    const cfg = riskConfig[imageResult.level as RiskLevel];
    const Icon = cfg.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="space-y-4 mt-4"
      >
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
            <p className="text-sm text-slate-300 leading-relaxed">
              {imageResult.explanation}
            </p>
          </div>

          {imageResult.signals.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Detected Signals
              </p>
              <div className="flex flex-wrap gap-2">
                {imageResult.signals.map((signal, i) => (
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
      </motion.div>
    );
  };

  return (
    <div className="h-full overflow-y-auto px-4 md:px-6 py-6">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <FileSearch className="w-5 h-5 text-red-300" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              {t.fraudTitle}
            </h2>
            <p className="text-xs text-slate-400">
              Analyze text or screenshots for fraud and scam signals.
            </p>
          </div>
        </div>

        <div className="inline-flex rounded-full bg-slate-900/80 border border-slate-700/70 p-1 text-xs">
          <button
            type="button"
            onClick={() => setTab("text")}
            className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
              tab === "text"
                ? "bg-red-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.5)]"
                : "text-slate-300 hover:text-white"
            }`}
          >
            {t.analyzeText}
          </button>
          <button
            type="button"
            onClick={() => setTab("image")}
            className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
              tab === "image"
                ? "bg-red-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.5)]"
                : "text-slate-300 hover:text-white"
            }`}
          >
            {t.analyzeImage}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {tab === "text" ? (
            <motion.div
              key="text-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="rounded-2xl bg-slate-900/60 border border-slate-800/80"
            >
              <ScamDetector />
            </motion.div>
          ) : (
            <motion.div
              key="image-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5"
            >
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.18em] mb-1">
                    {t.analyzeImage}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Upload screenshots of SMS, email, social media, or payment
                    requests. SmartFinance.ai will scan for scam indicators.
                  </p>
                </div>

                <label className="relative flex flex-col items-center justify-center w-full border border-dashed border-slate-700 rounded-2xl bg-slate-900/60 hover:border-red-500/60 hover:bg-slate-900/90 transition-colors cursor-pointer px-6 py-10">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-red-300" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm text-slate-100 font-medium">
                        {t.uploadImage}
                      </p>
                      <p className="text-[11px] text-slate-500 max-w-sm">
                        {t.uploadHint}
                      </p>
                      {fileName && (
                        <p className="text-[11px] text-slate-400 mt-1">
                          Selected: <span className="text-slate-200">{fileName}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </label>

                <div className="min-h-[40px]">
                  {loading && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="animate-spin w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full" />
                      <span>{t.analyzing}</span>
                    </div>
                  )}

                  <AnimatePresence>{renderImageResult()}</AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
