"use client";

import { motion } from "framer-motion";
import { Home, GraduationCap, Briefcase, Car, PiggyBank, BarChart3 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export type FinancialGoal =
  | "house"
  | "education"
  | "business"
  | "vehicle"
  | "save"
  | "invest";

type Props = {
  selected: FinancialGoal;
  onSelect: (goal: FinancialGoal) => void;
};

const goalConfig: {
  id: FinancialGoal;
  icon: React.ElementType;
  labelKey:
    | "goalBuyHouse"
    | "goalEducation"
    | "goalBusiness"
    | "goalVehicle"
    | "goalSavings"
    | "goalInvest";
  desc: string;
}[] = [
  {
    id: "house",
    icon: Home,
    labelKey: "goalBuyHouse",
    desc: "Plan EMI and affordability for your dream home.",
  },
  {
    id: "education",
    icon: GraduationCap,
    labelKey: "goalEducation",
    desc: "Estimate education loan needs and repayments.",
  },
  {
    id: "business",
    icon: Briefcase,
    labelKey: "goalBusiness",
    desc: "Model cash flow for starting or growing a business.",
  },
  {
    id: "vehicle",
    icon: Car,
    labelKey: "goalVehicle",
    desc: "Compare vehicle loan options and monthly EMI.",
  },
  {
    id: "save",
    icon: PiggyBank,
    labelKey: "goalSavings",
    desc: "Decide how much to save every month.",
  },
  {
    id: "invest",
    icon: BarChart3,
    labelKey: "goalInvest",
    desc: "Project long-term returns on investments.",
  },
];

export default function FinancialGoalSelector({ selected, onSelect }: Props) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-1">
            {t.selectGoal}
          </p>
          <p className="text-[11px] text-slate-500">
            Choose a goal to see the most relevant planner.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
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
                <Icon
                  className={`w-4 h-4 ${active ? "text-cyan-300" : "text-slate-300"}`}
                />
              </div>
              <div className="relative flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-slate-100">
                  {t[goal.labelKey]}
                </span>
                <span className="text-[10px] text-slate-500 leading-snug">
                  {goal.desc}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
