"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, FileSearch } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { apiScamImage, ScamAnalysisResult } from "@/lib/api";
import ScamDetector, { riskConfig } from "@/components/ScamDetector";

export default function ScamProtection() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"text" | "image">("text");

  const [fileName, setFileName] = useState<string | null>(null);
  const [imageResult, setImageResult] = useState<ScamAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setImageResult(null);
    setError(null);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result?.toString().split(",")[1];
        if (!base64String) {
          setError("Failed to process image.");
          setLoading(false);
          return;
        }

        try {
          const res = await apiScamImage(base64String);
          setImageResult(res);
        } catch (err) {
          console.error(err);
          setError("Image analysis failed. Please check backend connection.");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to read the file.");
      setLoading(false);
    }
  };

  const renderImageResult = () => {
    if (!imageResult) return null;
    const cfg = riskConfig[imageResult.risk_level] || riskConfig["Unknown Image"];
    const Icon = cfg.icon;

    if (imageResult.risk_level === "Unknown Image" || imageResult.risk_level === "Not Financial Content") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="mt-4 p-4 rounded-xl border border-slate-700 bg-slate-800/50 flex items-center gap-4"
        >
          <div className="h-10 w-10 flex-shrink-0 bg-slate-700/50 rounded-full flex items-center justify-center">
            <Icon className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">Not related to finance</p>
            <p className="text-xs text-slate-400 mt-0.5">{imageResult.summary}</p>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="space-y-4 mt-6"
      >
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
           {imageResult.confidence && imageResult.confidence !== "Low" && (
             <div className="text-right flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Confidence</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border bg-slate-800/80 ${
                  imageResult.confidence === "High" ? "text-emerald-400 border-emerald-500/30" : "text-amber-400 border-amber-500/30"
                }`}>{imageResult.confidence}</span>
             </div>
           )}
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Summary
            </p>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {imageResult.summary}
            </p>
          </div>

          {imageResult.warning_signs && imageResult.warning_signs.length > 0 && (
            <div className="pt-2 border-t border-slate-700/50">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Detected Signals
              </p>
              <div className="flex flex-wrap gap-2">
                {imageResult.warning_signs.map((signal, i) => (
                  <span
                    key={i}
                    className={`px-2.5 py-1 rounded-full text-[11px] border ${cfg.badge}`}
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

                <label className="relative flex flex-col items-center justify-center w-full border border-dashed border-slate-700/70 rounded-2xl bg-slate-900/40 hover:border-red-500/50 hover:bg-slate-900/80 transition-all cursor-pointer px-6 py-10">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center transition-colors group-hover:border-red-500/40">
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm text-slate-200 font-medium">
                        Click to select image or drag and drop
                      </p>
                      <p className="text-[11px] text-slate-500 max-w-sm">
                        JPG, PNG, GIF up to 5MB
                      </p>
                      {fileName && (
                        <p className="text-[11px] text-emerald-400 mt-2 font-medium">
                          Selected: {fileName}
                        </p>
                      )}
                    </div>
                  </div>
                </label>
                
                {error && <p className="text-xs text-red-500 pl-1">{error}</p>}

                <div className="min-h-[40px]">
                   <AnimatePresence mode="popLayout">
                    {loading ? (
                      <motion.div
                       initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                       className="flex items-center gap-2 text-xs text-slate-400 mt-6 justify-center"
                      >
                       <span className="animate-spin w-4 h-4 border-2 border-red-500/80 border-t-transparent rounded-full" />
                       <span>{t.analyzing}</span>
                      </motion.div>
                    ) : (
                      renderImageResult()
                    )}
                   </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
