"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, TrendingUp } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { apiSavingsPlan } from "@/lib/api";

type Plan = {
  monthlySaving: number;
  monthsLeft: number;
  progress: number;
  totalNeeded: number;
};

function formatNPR(val: number) {
  return "NPR " + val.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export default function SavingsPlanner() {
  const { t } = useLanguage();

  const [form, setForm] = useState({
    goal: "",
    months: "",
    current: "",
  });
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: string, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const compute = async (e: React.FormEvent) => {
    e.preventDefault();
    const goal = parseFloat(form.goal);
    const months = parseFloat(form.months);
    const current = parseFloat(form.current) || 0;

    if ([goal, months].some(isNaN) || months <= 0) return;

    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const res = await apiSavingsPlan({
        goalAmount: goal,
        targetMonths: months,
        currentSavings: current,
      });
      setPlan({
        monthlySaving: res.monthlySaving,
        monthsLeft: res.monthsLeft,
        progress: res.progress,
        totalNeeded: res.totalNeeded,
      });
    } catch (err) {
      setError("Unable to reach the savings planner service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all";
  const labelCls = "text-xs font-medium text-slate-400 mb-1 block";

  return (
    <div className="h-full overflow-y-auto px-4 md:px-6 py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">{t.savingsTitle}</h2>
            <p className="text-xs text-slate-400">Plan and visualize your financial goals</p>
          </div>
        </div>

        <form onSubmit={compute} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{t.savingsGoal}</label>
              <input
                type="number"
                min={0}
                placeholder="e.g. 500000"
                value={form.goal}
                onChange={(e) => set("goal", e.target.value)}
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className={labelCls}>{t.targetMonths}</label>
              <input
                type="number"
                min={1}
                placeholder="e.g. 24"
                value={form.months}
                onChange={(e) => set("months", e.target.value)}
                className={inputCls}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>{t.currentSavings}</label>
            <input
              type="number"
              min={0}
              placeholder="e.g. 50000"
              value={form.current}
              onChange={(e) => set("current", e.target.value)}
              className={inputCls}
            />
          </div>

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-cyan-600/80 hover:bg-cyan-600 text-white font-semibold text-sm transition-colors shadow-lg shadow-cyan-600/10 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            )}
            {!loading && <TrendingUp className="w-4 h-4" />}
            {t.planBtn}
          </motion.button>
        </form>

        {error && (
          <p className="text-xs text-red-400 mt-2">{error}</p>
        )}

        <AnimatePresence>
          {plan && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 border border-cyan-500/20 rounded-2xl p-5 space-y-1">
                  <p className="text-xs text-slate-400">{t.monthlySavings}</p>
                  <p className="text-3xl font-bold text-cyan-400">
                    {formatNPR(Math.round(plan.monthlySaving))}
                  </p>
                  <p className="text-xs text-slate-500">per month for {plan.monthsLeft} months</p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 space-y-1">
                  <p className="text-xs text-slate-400">Total Still Needed</p>
                  <p className="text-3xl font-bold text-slate-200">
                    {formatNPR(Math.round(plan.totalNeeded))}
                  </p>
                  <p className="text-xs text-slate-500">remaining to reach goal</p>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-400">{t.progressLabel}</p>
                  <span className="text-sm font-semibold text-cyan-400">
                    {plan.progress.toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${plan.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  />
                </div>
                {plan.progress === 0 && (
                  <p className="text-xs text-slate-500">Start saving to track your progress here.</p>
                )}
                {plan.progress > 0 && plan.progress < 100 && (
                  <p className="text-xs text-slate-400">
                    You&apos;re {plan.progress.toFixed(0)}% of the way to your goal. Keep going!
                  </p>
                )}
                {plan.progress >= 100 && (
                  <p className="text-xs text-emerald-400 font-medium">
                    🎉 Congratulations! You&apos;ve already reached your savings goal!
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
