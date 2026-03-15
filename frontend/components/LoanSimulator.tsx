"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { apiLoanSimulator } from "@/lib/api";

function formatNPR(val: number) {
  return "NPR " + val.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

type Result = {
  emi: number;
  status: "affordable" | "high" | "tooHigh";
  disposable: number;
  suggestion?: string;
};

export default function LoanSimulator() {
  const { t } = useLanguage();

  const [form, setForm] = useState({
    income: "",
    expenses: "",
    loanAmount: "",
    interestRate: "",
    duration: "",
  });

  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: string, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const compute = async (e: React.FormEvent) => {
    e.preventDefault();
    const income = parseFloat(form.income);
    const expenses = parseFloat(form.expenses);
    const loanAmount = parseFloat(form.loanAmount);
    const interestRate = parseFloat(form.interestRate);
    const duration = parseFloat(form.duration);

    if ([income, expenses, loanAmount, interestRate, duration].some(isNaN)) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await apiLoanSimulator({
        income,
        expenses,
        loanAmount,
        interestRate,
        durationYears: duration,
      });

      setResult({
        emi: res.emi,
        status: res.status,
        disposable: res.disposable,
        suggestion: res.suggestion,
      });
    } catch (err) {
      setError("Unable to reach the loan simulator service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all";

  const labelCls = "text-xs font-medium text-slate-400 mb-1 block";

  const statusMap = {
    affordable: { label: t.affordable, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    high: { label: t.highEMI, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    tooHigh: { label: t.tooHigh, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  };

  return (
    <div className="h-full overflow-y-auto px-4 md:px-6 py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">{t.loanTitle}</h2>
            <p className="text-xs text-slate-400">Simulate EMI and check affordability</p>
          </div>
        </div>

        <form onSubmit={compute} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "income", label: t.monthlyIncome, placeholder: "e.g. 60000" },
              { key: "expenses", label: t.monthlyExpenses, placeholder: "e.g. 25000" },
              { key: "loanAmount", label: t.loanAmount, placeholder: "e.g. 1000000" },
              { key: "interestRate", label: t.interestRate, placeholder: "e.g. 12" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className={labelCls}>{label}</label>
                <input
                  type="number"
                  min={0}
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => set(key, e.target.value)}
                  className={inputCls}
                  required
                />
              </div>
            ))}
          </div>

          <div>
            <label className={labelCls}>{t.loanDuration}</label>
            <input
              type="number"
              min={1}
              max={30}
              placeholder="e.g. 5"
              value={form.duration}
              onChange={(e) => set("duration", e.target.value)}
              className={inputCls}
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            )}
            {t.calculate}
          </motion.button>
        </form>

        {error && (
          <p className="text-xs text-red-400 mt-2">{error}</p>
        )}

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 space-y-2">
                <p className="text-xs text-slate-400">{t.estimatedEMI}</p>
                <p className="text-3xl font-bold text-blue-400">
                  {formatNPR(Math.round(result.emi))}
                </p>
                <p className="text-xs text-slate-500">per month</p>
              </div>

              <div
                className={`rounded-2xl p-5 border space-y-2 ${statusMap[result.status].bg}`}
              >
                <p className="text-xs text-slate-400">{t.affordability}</p>
                <p className={`text-base font-semibold ${statusMap[result.status].color}`}>
                  {statusMap[result.status].label}
                </p>
                <p className="text-xs text-slate-400">
                  Disposable income: {formatNPR(Math.round(result.disposable))}/mo
                </p>
                {result.suggestion && (
                  <p className="text-xs text-slate-400 mt-1">{result.suggestion}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
