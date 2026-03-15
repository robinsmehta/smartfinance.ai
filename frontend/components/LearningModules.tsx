"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

 type Level = "beginner" | "intermediate" | "advanced";

 type ModuleId =
  | "bankingBasics"
  | "understandingInterest"
  | "loansAndEMI"
  | "digitalPayments"
  | "avoidingScams";

 const moduleOrder: ModuleId[] = [
  "bankingBasics",
  "understandingInterest",
  "loansAndEMI",
  "digitalPayments",
  "avoidingScams",
 ];

 const moduleContent: Record<ModuleId, {
  intro: string;
  examples: string;
  village: string;
 }> = {
  bankingBasics: {
  intro:
    "Learn how bank accounts, deposits, withdrawals, and interest work in day-to-day life.",
  examples:
    "Example: Salary comes into your bank account, you withdraw only what you need in cash and keep the rest earning interest.",
  village:
    "Village style: Think of the bank as a trusted neighbour who safely stores your rice for you and returns a little extra rice every month as a thank-you.",
  },
  understandingInterest: {
  intro:
    "Understand simple vs compound interest so you can compare loans and savings schemes.",
  examples:
    "Example: A 10% simple interest loan on NPR 10,000 is always NPR 1,000 per year. With compounding, the interest amount slowly grows every year.",
  village:
    "Village style: Simple interest is like paying rent for the same room every year. Compound interest is like the room expanding a bit every year, so the rent slowly climbs.",
  },
  loansAndEMI: {
  intro:
    "See how EMIs are calculated and how tenure and rate change your monthly payments.",
  examples:
    "Example: A 5-year loan has higher EMI but finishes faster, while a 15-year loan has lower EMI but you pay more total interest.",
  village:
    "Village style: Borrowing money is like borrowing grain for planting. Paying a little back every harvest is your EMI — take only what you can comfortably return after each harvest.",
  },
  digitalPayments: {
  intro:
    "Learn how mobile banking, QR payments, and wallets like eSewa and Khalti work.",
  examples:
    "Example: Instead of handing over cash at the shop, you scan a QR code and money moves directly from your bank or wallet to the shop's account.",
  village:
    "Village style: It is like sending money with a trusted messenger instantly, without carrying a bag of cash on the bus.",
  },
  avoidingScams: {
  intro:
    "Recognize common online and phone scams so you can protect your money.",
  examples:
    "Example: Messages that ask for OTP, promise big lottery wins, or pressure you to 'pay now or account will be blocked' are strong scam signals.",
  village:
    "Village style: Just like you do not give your house keys to a stranger at the bazaar, never give your PIN or OTP to anyone on the phone.",
  },
 };

export default function LearningModules() {
  const { t } = useLanguage();
  const [activeModule, setActiveModule] = useState<ModuleId>("bankingBasics");
  const [level, setLevel] = useState<Level>("beginner");

  const levelLabel: Record<Level, string> = {
    beginner: t.beginner,
    intermediate: t.intermediate,
    advanced: t.advanced,
  };

  const levelHint: Record<Level, string> = {
    beginner: "Short, simple explanations to get started.",
    intermediate: "More detail with numbers and comparisons.",
    advanced: "Deeper insights and best-practice tips.",
  };

  const current = moduleContent[activeModule];

  const expandByLevel = (base: string) => {
    if (level === "beginner") return base;
    if (level === "intermediate")
      return base +
        " This level adds numbers, comparisons, and common mistakes to avoid.";
    return (
      base +
      " At the advanced level, we focus on long-term strategy, risk, and how to combine tools to reach life goals."
    );
  };

  return (
    <div className="h-full overflow-y-auto px-4 md:px-6 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              {t.learnTitle}
            </h2>
            <p className="text-xs text-slate-400">
              Structured, simple lessons with real-life and village-style examples.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px]">
          {([
            { id: "beginner" as Level, color: "bg-emerald-500/15 text-emerald-300" },
            { id: "intermediate" as Level, color: "bg-cyan-500/15 text-cyan-300" },
            { id: "advanced" as Level, color: "bg-indigo-500/15 text-indigo-300" },
          ]).map((lvl) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setLevel(lvl.id)}
              className={`px-3 py-1 rounded-full border border-slate-700/70 transition-all duration-200 ${
                level === lvl.id
                  ? `${lvl.color} shadow-[0_0_18px_rgba(129,140,248,0.4)]`
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70"
              }`}
            >
              {levelLabel[lvl.id]}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-slate-500">{levelHint[level]}</p>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] gap-5 mt-1">
          <div className="space-y-2">
            {moduleOrder.map((id) => (
              <motion.button
                key={id}
                type="button"
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveModule(id)}
                className={`w-full rounded-2xl border px-3.5 py-3 text-left text-sm transition-all duration-200 ${
                  activeModule === id
                    ? "border-cyan-500/60 bg-cyan-500/10 shadow-[0_0_26px_rgba(34,211,238,0.45)] text-slate-50"
                    : "border-slate-700/70 bg-slate-900/60 text-slate-300 hover:border-cyan-500/40 hover:bg-slate-900/90"
                }`}
              >
                <span className="font-semibold text-xs">
                  {t[id]}
                </span>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule + level}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 space-y-4"
            >
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  {levelLabel[level]}
                </p>
                <h3 className="text-sm font-semibold text-slate-50">
                  {t[activeModule]}
                </h3>
              </div>

              <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                <p>{expandByLevel(current.intro)}</p>
                <p>
                  <span className="font-semibold text-slate-100">Real-life example: </span>
                  {current.examples}
                </p>
                <p>
                  <span className="font-semibold text-slate-100">Village explanation: </span>
                  {current.village}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
