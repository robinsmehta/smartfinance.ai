"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import FinancialGoalSelector, { FinancialGoal, AssetType, ASSET_OPTIONS } from "@/components/FinancialGoalSelector";
import LoanSimulator from "@/components/LoanSimulator";

function formatNPR(val: number) {
  return "NPR " + val.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export default function LoanInvestmentPlanner() {
  const { t } = useLanguage();
  const [goal, setGoal] = useState<FinancialGoal>("asset");
  const [assetType, setAssetType] = useState<AssetType>("house");

  const showLoanTools = goal === "asset" || goal === "education";

  const assetLabel = ASSET_OPTIONS.find((o) => o.value === assetType)?.label ?? "Asset";

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
            <h2 className="text-lg font-semibold text-slate-100">{t.loanTitle}</h2>
            <p className="text-xs text-slate-400">
              Calculate EMI and affordability for your financial goals.
            </p>
          </div>
        </div>

        <FinancialGoalSelector
          selected={goal}
          selectedAsset={assetType}
          onSelect={setGoal}
          onAssetSelect={setAssetType}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={goal === "asset" ? `${goal}-${assetType}` : goal}
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
                    {goal === "asset" ? `${assetLabel} Loan Tips` : "Education Loan Tips"}
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {goal === "asset"
                      ? `Use the EMI simulator to check whether financing a ${assetLabel.toLowerCase()} is realistic for your current income. As a rule of thumb, keep your total EMIs below 40% of your disposable income.`
                      : "Estimate education loan needs and repayment capacity. Check if your expected post-study income can comfortably cover EMI payments."}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Tip: Consider combining a disciplined savings plan with a reasonable loan amount for smoother cash flow.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
