"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import FinancialGoalSelector, { FinancialGoal } from "@/components/FinancialGoalSelector";
import LoanSimulator from "@/components/LoanSimulator";
import SavingsPlanner from "@/components/SavingsPlanner";

function formatNPR(val: number) {
  return "NPR " + val.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

function calculateGrowth(amount: number, annualRate: number, years: number) {
  const r = annualRate / 100;
  const future = amount * Math.pow(1 + r, years);
  const totalReturns = future - amount;
  return { future, totalReturns };
}

export default function LoanInvestmentPlanner() {
  const { t } = useLanguage();
  const [goal, setGoal] = useState<FinancialGoal>("house");

  const [investForm, setInvestForm] = useState({
    amount: "",
    years: "",
    rate: "",
  });
  const [investResult, setInvestResult] = useState<{
    future: number;
    totalReturns: number;
  } | null>(null);

  const setInvest = (key: keyof typeof investForm, value: string) => {
    setInvestForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleInvestCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(investForm.amount);
    const years = parseFloat(investForm.years);
    const rate = parseFloat(investForm.rate);
    if ([amount, years, rate].some(isNaN) || years <= 0) return;
    setInvestResult(calculateGrowth(amount, rate, years));
  };

  const showLoanTools = ["house", "education", "business", "vehicle"].includes(goal);
  const showSavingsTools = goal === "save";
  const showInvestTools = goal === "invest";

  const inputCls =
    "w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all";
  const labelCls = "text-xs font-medium text-slate-400 mb-1 block";

  return (
    <div className="h-full overflow-y-auto px-4 md:px-6 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <LineChart className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              {t.loanTitle}
            </h2>
            <p className="text-xs text-slate-400">
              Combine loan, savings, and investment tools around a single goal.
            </p>
          </div>
        </div>

        <FinancialGoalSelector selected={goal} onSelect={setGoal} />

        <AnimatePresence mode="wait">
          <motion.div
            key={goal}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="space-y-6 pt-2"
          >
            {showLoanTools && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80">
                  <LoanSimulator />
                </div>
                <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 space-y-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.18em]">
                    Goal Summary
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Use the EMI simulator to check whether this goal is realistic
                    for your current income. As a rule of thumb, try to keep EMI
                    below 40% of your disposable income.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Tip: Consider combining a disciplined savings plan with a
                    reasonable loan amount for smoother cash flow.
                  </p>
                </div>
              </div>
            )}

            {showSavingsTools && (
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <SavingsPlanner />
              </div>
            )}

            {showInvestTools && (
              <div className="grid grid-cols-1 md:grid-cols-[1.3fr_minmax(0,1fr)] gap-6">
                <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-9 w-9 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center">
                      <LineChart className="w-4 h-4 text-blue-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100">
                        Investment Growth Calculator
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Project future value using compound growth.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleInvestCalculate} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className={labelCls}>{t.investAmount}</label>
                        <input
                          type="number"
                          min={0}
                          value={investForm.amount}
                          onChange={(e) => setInvest("amount", e.target.value)}
                          placeholder="e.g. 200000"
                          className={inputCls}
                          required
                        />
                      </div>
                      <div>
                        <label className={labelCls}>{t.investYears}</label>
                        <input
                          type="number"
                          min={1}
                          value={investForm.years}
                          onChange={(e) => setInvest("years", e.target.value)}
                          placeholder="e.g. 5"
                          className={inputCls}
                          required
                        />
                      </div>
                      <div>
                        <label className={labelCls}>{t.expectedReturn}</label>
                        <input
                          type="number"
                          min={0}
                          step="0.1"
                          value={investForm.rate}
                          onChange={(e) => setInvest("rate", e.target.value)}
                          placeholder="e.g. 10"
                          className={inputCls}
                          required
                        />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      className="w-full mt-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
                    >
                      {t.calculate}
                    </motion.button>
                  </form>
                </div>

                <AnimatePresence>
                  {investResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.28 }}
                      className="space-y-3"
                    >
                      <div className="rounded-2xl bg-slate-900/60 border border-blue-500/30 p-5 space-y-1">
                        <p className="text-xs text-slate-400">
                          {t.projectedValue}
                        </p>
                        <p className="text-2xl font-bold text-blue-300">
                          {formatNPR(Math.round(investResult.future))}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Assuming annual compounding with steady returns.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-900/60 border border-emerald-500/30 p-5 space-y-1">
                        <p className="text-xs text-slate-400">
                          {t.totalReturns}
                        </p>
                        <p className="text-2xl font-bold text-emerald-300">
                          {formatNPR(Math.round(investResult.totalReturns))}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Profit over your original investment amount.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
