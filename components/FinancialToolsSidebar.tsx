"use client";

import { motion } from "framer-motion";
import { MessageSquare, Calculator, ShieldAlert, Target } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export type Tool = "chat" | "loan" | "scam" | "savings";

type Props = {
  activeTool: Tool;
  onSelect: (tool: Tool) => void;
};

const tools: { id: Tool; icon: React.ElementType; labelKey: keyof ReturnType<typeof useLanguage>["t"]; color: string; accent: string }[] = [
  {
    id: "chat",
    icon: MessageSquare,
    labelKey: "financialExplainer",
    color: "text-blue-400",
    accent: "bg-blue-500/10 border-blue-500/25 shadow-blue-500/5",
  },
  {
    id: "loan",
    icon: Calculator,
    labelKey: "loanSimulator",
    color: "text-emerald-400",
    accent: "bg-emerald-500/10 border-emerald-500/25 shadow-emerald-500/5",
  },
  {
    id: "scam",
    icon: ShieldAlert,
    labelKey: "scamDetector",
    color: "text-red-400",
    accent: "bg-red-500/10 border-red-500/25 shadow-red-500/5",
  },
  {
    id: "savings",
    icon: Target,
    labelKey: "savingsPlanner",
    color: "text-cyan-400",
    accent: "bg-cyan-500/10 border-cyan-500/25 shadow-cyan-500/5",
  },
];

export default function FinancialToolsSidebar({ activeTool, onSelect }: Props) {
  const { t } = useLanguage();

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-[#0c1525]/80 border-r border-white/5 backdrop-blur-xl h-full">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 border-b border-white/5">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 px-2 mb-1">
          Financial Tools
        </p>
      </div>

      {/* Tool list */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;

          return (
            <motion.button
              key={tool.id}
              onClick={() => onSelect(tool.id)}
              whileHover={{ x: isActive ? 0 : 3 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                isActive
                  ? `${tool.accent} border shadow-sm ${tool.color}`
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                  isActive ? "bg-current/10" : "bg-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? tool.color : "text-slate-500"}`} />
              </div>
              <span
                className={`text-sm font-medium leading-tight ${
                  isActive ? tool.color : ""
                }`}
              >
                {t[tool.labelKey]}
              </span>
              {isActive && (
                <motion.span
                  layoutId="active-indicator"
                  className={`ml-auto w-1.5 h-1.5 rounded-full ${tool.color.replace("text-", "bg-")}`}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer hint */}
      <div className="px-5 py-4 border-t border-white/5">
        <p className="text-[10px] text-slate-600 leading-relaxed">
          SmartFinance.ai — Financial tools for Nepal. For guidance only.
        </p>
      </div>
    </aside>
  );
}
