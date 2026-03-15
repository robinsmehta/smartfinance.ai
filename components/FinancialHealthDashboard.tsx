"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

function clamp(num: number, min: number, max: number) {
  return Math.min(max, Math.max(min, num));
}

function formatNPR(val: number) {
  return "NPR " + val.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export default function FinancialHealthDashboard() {
  const { t } = useLanguage();

  const [form, setForm] = useState({
    income: "",
    expenses: "",
    savings: "",
    loans: "",
  });

  const [result, setResult] = useState<
    | null
    | {
        score: number;
        savingsPotential: number;
        savingsDiscipline: number;
        financialKnowledge: number;
        scamAwareness: number;
        loanReadiness: number;
      }
  >(null);

  const set = (key: keyof typeof form, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const income = parseFloat(form.income);
    const expenses = parseFloat(form.expenses);
    const savings = parseFloat(form.savings) || 0;
    const loans = parseFloat(form.loans) || 0;

    if ([income, expenses].some(isNaN) || income <= 0) return;

    const disposable = income - expenses - loans;
    const savingsPotential = Math.max(0, disposable);
    const savingsRate = clamp(savingsPotential / income, 0, 0.7);

    const savingsDiscipline = clamp((savings / Math.max(income, 1)) * 300, 0, 100);
    const financialKnowledge = 70; // heuristic baseline
    const scamAwareness = 80; // encourage security mindset
    const loanBurdenRatio = clamp(loans / Math.max(income, 1), 0, 1);
    const loanReadiness = clamp(100 - loanBurdenRatio * 80, 20, 95);

    const score = Math.round(
      (savingsDiscipline * 0.35 +
        financialKnowledge * 0.2 +
        scamAwareness * 0.2 +
        loanReadiness * 0.25) /
        1
    );

    setResult({
      score,
      savingsPotential,
      savingsDiscipline,
      financialKnowledge,
      scamAwareness,
      loanReadiness,
    });
  };

  const inputCls =
    "w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition-all";
  const labelCls = "text-xs font-medium text-slate-400 mb-1 block";

  const circumference = 2 * Math.PI * 48;
  const progress = result ? (result.score / 100) * circumference : 0;

  return (
    <div className="h-full overflow-y-auto px-4 md:px-6 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Activity className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              {t.healthTitle}
            </h2>
            <p className="text-xs text-slate-400">
              Understand your financial readiness with a simple SmartFinance score.
            </p>
          </div>
        </div>

        <form onSubmit={calculate} className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{t.monthlyIncome}</label>
              <input
                type="number"
                min={0}
                value={form.income}
                onChange={(e) => set("income", e.target.value)}
                placeholder="e.g. 60000"
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className={labelCls}>{t.monthlyExpenses}</label>
              <input
                type="number"
                min={0}
                value={form.expenses}
                onChange={(e) => set("expenses", e.target.value)}
                placeholder="e.g. 35000"
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className={labelCls}>{t.currentSavings}</label>
              <input
                type="number"
                min={0}
                value={form.savings}
                onChange={(e) => set("savings", e.target.value)}
                placeholder="e.g. 150000"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>{t.existingLoans}</label>
              <input
                type="number"
                min={0}
                value={form.loans}
                onChange={(e) => set("loans", e.target.value)}
                placeholder="e.g. 8000"
                className={inputCls}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
          >
            {t.calculateScore}
          </motion.button>
        </form>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-6"
            >
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 flex flex-col md:flex-row items-center gap-6">
                <div className="relative flex items-center justify-center">
                  <svg width={120} height={120}>
                    <circle
                      cx={60}
                      cy={60}
                      r={48}
                      stroke="#1f2937"
                      strokeWidth={8}
                      fill="transparent"
                    />
                    <motion.circle
                      cx={60}
                      cy={60}
                      r={48}
                      stroke="url(#scoreGradient)"
                      strokeWidth={8}
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - progress}
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: circumference - progress }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="50%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500 mb-0.5">
                      {t.smartfinanceScore}
                    </span>
                    <span className="text-2xl font-semibold text-slate-50">
                      {result.score}
                    </span>
                    <span className="text-[10px] text-slate-500">/ 100</span>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your SmartFinance score is a simple indicator of your
                    financial readiness based on savings discipline, knowledge,
                    scam awareness, and loan burden.
                  </p>
                  <div className="space-y-2">
                    {[
                      { label: t.savingsDiscipline, value: result.savingsDiscipline },
                      { label: t.financialKnowledge, value: result.financialKnowledge },
                      { label: t.scamAwareness, value: result.scamAwareness },
                      { label: t.loanReadiness, value: result.loanReadiness },
                    ].map((item) => (
                      <div key={item.label} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>{item.label}</span>
                          <span className="text-slate-300 font-medium">
                            {Math.round(item.value)}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${clamp(item.value, 0, 100)}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-900/60 border border-emerald-500/30 p-5 space-y-1">
                  <p className="text-xs text-slate-400">{t.savingsPotential}</p>
                  <p className="text-2xl font-semibold text-emerald-300">
                    {formatNPR(Math.round(result.savingsPotential))}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Approximate amount you could set aside each month based on
                    the details above.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 space-y-3">
                  <p className="text-xs text-slate-400">{t.spendingBreakdown}</p>
                  {(() => {
                    const income = parseFloat(form.income) || 0;
                    const expenses = parseFloat(form.expenses) || 0;
                    const loans = parseFloat(form.loans) || 0;
                    const savingsPotential = result.savingsPotential;
                    const total = income || 1;

                    const parts = [
                      { label: "Needs & lifestyle", value: expenses, color: "bg-sky-500" },
                      { label: "Existing EMIs", value: loans, color: "bg-rose-500" },
                      { label: "Potential savings", value: savingsPotential, color: "bg-emerald-500" },
                    ];

                    return (
                      <div className="space-y-2">
                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden flex">
                          {parts.map((p) => (
                            <div
                              key={p.label}
                              style={{ width: `${(p.value / total) * 100}%` }}
                              className={`${p.color} h-full`}
                            />
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {parts.map((p) => (
                            <div key={p.label} className="flex items-center gap-1 text-[11px] text-slate-400">
                              <span className={`inline-block w-2 h-2 rounded-full ${p.color}`} />
                              <span>{p.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
