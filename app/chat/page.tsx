"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import FinancialToolsSidebar, { Tool } from "@/components/FinancialToolsSidebar";
import FinancialExplainerChat from "@/components/FinancialExplainerChat";
import LoanSimulator from "@/components/LoanSimulator";
import ScamDetector from "@/components/ScamDetector";
import SavingsPlanner from "@/components/SavingsPlanner";
import { useLanguage } from "@/lib/LanguageContext";

const toolTitles: Record<
  Tool,
  {
    labelKey:
      | "financialExplainer"
      | "loanSimulator"
      | "scamDetector"
      | "savingsPlanner";
    sub: string;
  }
> = {
  chat: {
    labelKey: "financialExplainer",
    sub: "Your AI-powered financial guide",
  },
  loan: {
    labelKey: "loanSimulator",
    sub: "Check loan affordability & monthly EMI",
  },
  scam: {
    labelKey: "scamDetector",
    sub: "Paste any message to detect financial fraud",
  },
  savings: {
    labelKey: "savingsPlanner",
    sub: "Plan and visualize your savings goals",
  },
};

const toolComponents: Record<Tool, React.ReactNode> = {
  chat: <FinancialExplainerChat />,
  loan: <LoanSimulator />,
  scam: <ScamDetector />,
  savings: <SavingsPlanner />,
};

export default function ChatPage() {
  const [activeTool, setActiveTool] = useState<Tool>("chat");
  const { t } = useLanguage();

  const meta = toolTitles[activeTool];

  return (
    <main className="relative w-full h-screen flex flex-col overflow-hidden">
      <BackgroundAnimation />
      <Navbar />

      {/* Full height layout below navbar */}
      <div className="flex flex-1 overflow-hidden pt-[72px]">
        {/* Sidebar */}
        <FinancialToolsSidebar activeTool={activeTool} onSelect={setActiveTool} />

        {/* Main Panel */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a]/70 backdrop-blur-md">
          {/* Panel Header */}
          <div className="px-6 py-4 border-b border-white/5 bg-slate-900/40 flex items-center gap-3 flex-shrink-0">
            <div>
              <h1 className="text-base font-semibold text-slate-100 leading-tight">
                {t[meta.labelKey]}
              </h1>
              <p className="text-xs text-slate-500">
                {meta.sub}
              </p>
            </div>
          </div>

          {/* Tool Content with animated transitions */}
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTool}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute inset-0 overflow-auto"
              >
                {toolComponents[activeTool]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
