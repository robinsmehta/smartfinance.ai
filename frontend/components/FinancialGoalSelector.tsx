"use client";

import { motion } from "framer-motion";
import { Package, GraduationCap, PiggyBank, BarChart3, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export type AssetType = "house" | "vehicle" | "business" | "land" | "equipment" | "other";

export type FinancialGoal =
  | "asset"
  | "education";

export type FinancialGoalWithAsset = {
  goal: FinancialGoal;
  assetType?: AssetType;
};

export const ASSET_OPTIONS: { value: AssetType; label: string; desc: string }[] = [
  { value: "house",     label: "Buy a House",       desc: "Plan EMI and affordability for your dream home." },
  { value: "vehicle",   label: "Buy a Vehicle",      desc: "Compare vehicle loan options and monthly EMI." },
  { value: "business",  label: "Start a Business",   desc: "Model cash flow for starting or growing a business." },
  { value: "land",      label: "Buy Land / Plot",    desc: "Calculate loan for land or real estate purchase." },
  { value: "equipment", label: "Buy Equipment",      desc: "Finance machinery or professional equipment." },
  { value: "other",     label: "Other Asset",        desc: "Any other large asset purchase." },
];

type Props = {
  selected: FinancialGoal;
  selectedAsset: AssetType;
  onSelect: (goal: FinancialGoal) => void;
  onAssetSelect: (asset: AssetType) => void;
};

const goalConfig: {
  id: FinancialGoal;
  icon: React.ElementType;
  label: string;
  desc: string;
}[] = [
  {
    id: "asset",
    icon: Package,
    label: "Asset Purchase",
    desc: "Loan planning for any major asset.",
  },
  {
    id: "education",
    icon: GraduationCap,
    label: "Education",
    desc: "Estimate education loan needs and repayments.",
  },
];

export default function FinancialGoalSelector({ selected, selectedAsset, onSelect, onAssetSelect }: Props) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-1">
          {t.selectGoal}
        </p>
        <p className="text-[11px] text-slate-500">
          Choose a goal to see the most relevant planner.
        </p>
      </div>

      {/* Goal Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {goalConfig.map((goal) => {
          const Icon = goal.icon;
          const active = selected === goal.id;
          return (
            <motion.button
              key={goal.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(goal.id)}
              className={`relative rounded-2xl border px-3 py-3 flex flex-col items-start gap-2 text-left transition-all duration-200 ${
                active
                  ? "border-blue-500/70 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.35)]"
                  : "border-slate-700/70 bg-slate-900/40 hover:border-blue-500/40 hover:bg-slate-900/80"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="goal-pill"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5"
                />
              )}
              <div className="relative flex items-center justify-center h-8 w-8 rounded-xl bg-slate-900/80 border border-slate-700/70">
                <Icon className={`w-4 h-4 ${active ? "text-cyan-300" : "text-slate-300"}`} />
              </div>
              <div className="relative flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-slate-100">{goal.label}</span>
                <span className="text-[10px] text-slate-500 leading-snug">{goal.desc}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Asset Type Dropdown — only shown when "asset" goal is selected */}
      {selected === "asset" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-1.5"
        >
          <label className="text-xs font-medium text-slate-400 block">
            Asset Type
          </label>
          <div className="relative">
            <select
              value={selectedAsset}
              onChange={(e) => onAssetSelect(e.target.value as AssetType)}
              className="w-full appearance-none bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-slate-200 text-sm focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all cursor-pointer"
            >
              {ASSET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          {/* Asset description hint */}
          <p className="text-[11px] text-slate-500 pl-1">
            {ASSET_OPTIONS.find((o) => o.value === selectedAsset)?.desc}
          </p>
        </motion.div>
      )}
    </div>
  );
}
